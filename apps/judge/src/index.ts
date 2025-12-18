import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { eq } from 'drizzle-orm'
import { executeLuau } from './executor'
import { checkPlagiarism } from './plagiarism'
import * as schema from './db/schema'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

interface RunJob {
  jobId: string
  code: string
  tests: {
    id: string
    input: string
    expectedOutput: string
    timeLimit: number
    memoryLimit: number
  }[]
  mode: 'run'
}

interface SubmitJob {
  submissionId: string
  problemId: string
  userId: string
  code: string
  tests: {
    id: string
    input: string
    expectedOutput: string
    timeLimit: number
    memoryLimit: number
    visibility: string
  }[]
}

interface PlaygroundJob {
  jobId: string
  code: string
  mode: 'playground'
}

type JudgeJobData = RunJob | SubmitJob | PlaygroundJob

const worker = new Worker<JudgeJobData>(
  'judge',
  async (job: Job<JudgeJobData>) => {
    console.log(`Processing job ${job.id} of type ${job.name}`)

    try {
      if (job.name === 'run') {
        const data = job.data as RunJob
        const results = await runTests(data.code, data.tests)
        
        await redis.setex(
          `run:${data.jobId}`,
          300,
          JSON.stringify({
            status: 'completed',
            results,
          })
        )
      } else if (job.name === 'submit') {
        const data = job.data as SubmitJob
        
        await db
          .update(schema.submissions)
          .set({ status: 'running' })
          .where(eq(schema.submissions.id, data.submissionId))

        const results = await runTests(data.code, data.tests)
        
        const allPassed = results.every(r => r.passed)
        const hasError = results.some(r => r.error)
        const hasTimeout = results.some(r => r.timedOut)
        const hasMemoryLimit = results.some(r => r.memoryExceeded)

        let status: string
        if (allPassed) {
          status = 'accepted'
        } else if (hasTimeout) {
          status = 'time_limit'
        } else if (hasMemoryLimit) {
          status = 'memory_limit'
        } else if (hasError) {
          status = 'runtime_error'
        } else {
          status = 'wrong_answer'
        }

        const totalRuntime = results.reduce((sum, r) => sum + r.runtimeMs, 0)
        const maxMemory = Math.max(...results.map(r => r.memoryKb))

        const publicResults = results
          .filter(r => data.tests.find(t => t.id === r.testId)?.visibility === 'public')
          .map(r => ({
            testId: r.testId,
            passed: r.passed,
            actualOutput: r.actualOutput,
            runtimeMs: r.runtimeMs,
            memoryKb: r.memoryKb,
            error: r.error,
          }))

        await db
          .update(schema.submissions)
          .set({
            status,
            runtimeMs: totalRuntime,
            memoryKb: maxMemory,
            testResults: publicResults,
            errorMessage: results.find(r => r.error)?.error || null,
          })
          .where(eq(schema.submissions.id, data.submissionId))

        if (status === 'accepted') {
          await db
            .insert(schema.userSolves)
            .values({
              userId: data.userId,
              problemId: data.problemId,
            })
            .onConflictDoNothing()

          await db
            .update(schema.problems)
            .set({
              submissionCount: schema.problems.submissionCount,
              acceptedCount: schema.problems.acceptedCount,
            })
            .where(eq(schema.problems.id, data.problemId))

          await checkPlagiarism(db, data.submissionId, data.problemId, data.code)
        }
      } else if (job.name === 'playground') {
        const data = job.data as PlaygroundJob
        
        const result = await executeLuau(data.code, '', 5000, 128)
        
        await redis.setex(
          `playground:${data.jobId}`,
          300,
          JSON.stringify({
            status: 'completed',
            output: result.output,
            error: result.error,
            runtimeMs: result.runtimeMs,
          })
        )
      }
    } catch (error) {
      console.error('Job processing error:', error)
      throw error
    }
  },
  {
    connection: redis,
    concurrency: parseInt(process.env.JUDGE_CONCURRENCY || '4'),
  }
)

async function runTests(
  code: string,
  tests: { id: string; input: string; expectedOutput: string; timeLimit: number; memoryLimit: number }[]
) {
  const results = []

  for (const test of tests) {
    const result = await executeLuau(code, test.input, test.timeLimit, test.memoryLimit)
    
    const actualOutput = (result.output || '').trim()
    const expectedOutput = test.expectedOutput.trim()
    const passed = !result.error && !result.timedOut && actualOutput === expectedOutput

    results.push({
      testId: test.id,
      passed,
      actualOutput: actualOutput.slice(0, 10000),
      runtimeMs: result.runtimeMs,
      memoryKb: result.memoryKb,
      error: result.error,
      timedOut: result.timedOut,
      memoryExceeded: result.memoryExceeded,
    })

    if (result.timedOut || result.memoryExceeded) {
      break
    }
  }

  return results
}

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

console.log('Judge worker started')

