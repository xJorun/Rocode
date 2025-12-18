import { spawn } from 'child_process'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { LUAU_STUBS } from './stubs'

const SANDBOX_DIR = process.env.SANDBOX_DIR || '/tmp/rocode-sandbox'
const LUAU_BINARY = process.env.LUAU_BINARY || 'luau'

interface ExecutionResult {
  output: string
  error: string | null
  runtimeMs: number
  memoryKb: number
  timedOut: boolean
  memoryExceeded: boolean
}

export async function executeLuau(
  code: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<ExecutionResult> {
  const jobId = randomUUID()
  const workDir = join(SANDBOX_DIR, jobId)
  const codeFile = join(workDir, 'solution.luau')
  const inputFile = join(workDir, 'input.txt')

  try {
    await mkdir(workDir, { recursive: true })

    const fullCode = `
${LUAU_STUBS}

local __INPUT__ = [[${input}]]
local __INPUT_LINES__ = {}
for line in __INPUT__:gmatch("[^\r\n]+") do
  table.insert(__INPUT_LINES__, line)
end
local __INPUT_INDEX__ = 1

function readline()
  local line = __INPUT_LINES__[__INPUT_INDEX__]
  __INPUT_INDEX__ = __INPUT_INDEX__ + 1
  return line
end

function readnumber()
  return tonumber(readline())
end

function readnumbers()
  local line = readline()
  local nums = {}
  for num in line:gmatch("%S+") do
    table.insert(nums, tonumber(num))
  end
  return nums
end

${code}
`

    await writeFile(codeFile, fullCode)
    await writeFile(inputFile, input)

    const startTime = Date.now()
    let output = ''
    let error: string | null = null
    let timedOut = false
    let memoryExceeded = false

    const result = await new Promise<ExecutionResult>((resolve) => {
      const proc = spawn(LUAU_BINARY, [codeFile], {
        cwd: workDir,
        timeout: timeLimit,
        env: {
          ...process.env,
          LUA_PATH: '',
          LUA_CPATH: '',
        },
      })

      let stdout = ''
      let stderr = ''

      proc.stdout.on('data', (data) => {
        stdout += data.toString()
        if (stdout.length > 1024 * 1024) {
          proc.kill()
        }
      })

      proc.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      proc.on('close', (code, signal) => {
        const runtimeMs = Date.now() - startTime

        if (signal === 'SIGTERM' || signal === 'SIGKILL') {
          timedOut = true
          error = 'Time limit exceeded'
        } else if (code !== 0) {
          error = stderr || 'Runtime error'
        }

        resolve({
          output: stdout,
          error,
          runtimeMs,
          memoryKb: 0,
          timedOut,
          memoryExceeded,
        })
      })

      proc.on('error', (err) => {
        resolve({
          output: '',
          error: err.message,
          runtimeMs: Date.now() - startTime,
          memoryKb: 0,
          timedOut: false,
          memoryExceeded: false,
        })
      })
    })

    return result
  } finally {
    try {
      await unlink(codeFile).catch(() => {})
      await unlink(inputFile).catch(() => {})
      await unlink(workDir).catch(() => {})
    } catch {}
  }
}

export async function executeInContainer(
  code: string,
  input: string,
  timeLimit: number,
  memoryLimit: number
): Promise<ExecutionResult> {
  const jobId = randomUUID()

  const result = await new Promise<ExecutionResult>((resolve) => {
    const startTime = Date.now()

    const proc = spawn('docker', [
      'run',
      '--rm',
      '--network=none',
      '--read-only',
      `--memory=${memoryLimit}m`,
      '--memory-swap=-1',
      `--cpus=0.5`,
      '--pids-limit=50',
      '--security-opt=no-new-privileges',
      '-i',
      'rocode/luau-sandbox',
      'luau',
      '-',
    ], {
      timeout: timeLimit + 1000,
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false
    let memoryExceeded = false

    proc.stdin.write(`${LUAU_STUBS}\n${code}`)
    proc.stdin.end()

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
      if (stderr.includes('memory')) {
        memoryExceeded = true
      }
    })

    proc.on('close', (code, signal) => {
      const runtimeMs = Date.now() - startTime

      if (signal === 'SIGTERM' || signal === 'SIGKILL' || runtimeMs >= timeLimit) {
        timedOut = true
      }

      resolve({
        output: stdout,
        error: code !== 0 ? stderr || 'Runtime error' : null,
        runtimeMs,
        memoryKb: 0,
        timedOut,
        memoryExceeded,
      })
    })

    proc.on('error', (err) => {
      resolve({
        output: '',
        error: err.message,
        runtimeMs: Date.now() - startTime,
        memoryKb: 0,
        timedOut: false,
        memoryExceeded: false,
      })
    })
  })

  return result
}

