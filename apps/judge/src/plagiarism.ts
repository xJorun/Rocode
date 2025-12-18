import { eq, and, desc, ne } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

function tokenize(code: string): string[] {
  const normalized = code
    .replace(/--\[\[[\s\S]*?\]\]/g, '')
    .replace(/--.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/["'].*?["']/g, 'STR')
    .replace(/\b\d+\.?\d*\b/g, 'NUM')
    .toLowerCase()
    .trim()

  const tokens = normalized.match(/\b\w+\b|[^\w\s]/g) || []
  return tokens
}

function calculateSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0

  const set1 = new Set(tokens1)
  const set2 = new Set(tokens2)

  let intersection = 0
  for (const token of set1) {
    if (set2.has(token)) {
      intersection++
    }
  }

  const union = set1.size + set2.size - intersection
  return union > 0 ? intersection / union : 0
}

function nGramSimilarity(tokens1: string[], tokens2: string[], n: number = 3): number {
  if (tokens1.length < n || tokens2.length < n) return 0

  const getNGrams = (tokens: string[]) => {
    const ngrams = new Set<string>()
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(' '))
    }
    return ngrams
  }

  const ngrams1 = getNGrams(tokens1)
  const ngrams2 = getNGrams(tokens2)

  let intersection = 0
  for (const ngram of ngrams1) {
    if (ngrams2.has(ngram)) {
      intersection++
    }
  }

  const union = ngrams1.size + ngrams2.size - intersection
  return union > 0 ? intersection / union : 0
}

export async function checkPlagiarism(
  db: NodePgDatabase<any>,
  submissionId: string,
  problemId: string,
  code: string
) {
  try {
    const tokens = tokenize(code)

    if (tokens.length < 20) {
      return
    }

    const recentSubmissions = await db.query.submissions.findMany({
      where: (submissions, { eq, and, ne }) =>
        and(
          eq(submissions.problemId, problemId),
          eq(submissions.status, 'accepted'),
          ne(submissions.id, submissionId)
        ),
      orderBy: (submissions, { desc }) => desc(submissions.createdAt),
      limit: 100,
      columns: {
        id: true,
        userId: true,
        code: true,
      },
    })

    const FLAGS_THRESHOLD = 0.85

    for (const submission of recentSubmissions) {
      const otherTokens = tokenize(submission.code)

      if (otherTokens.length < 20) continue

      const jaccardSim = calculateSimilarity(tokens, otherTokens)
      const ngramSim = nGramSimilarity(tokens, otherTokens)

      const combinedScore = (jaccardSim * 0.4) + (ngramSim * 0.6)

      if (combinedScore >= FLAGS_THRESHOLD) {
        await db.insert(
          (await import('./db/schema')).plagiarismFlags
        ).values({
          submissionId,
          matchedSubmissionId: submission.id,
          score: combinedScore.toFixed(4),
        })
      }
    }
  } catch (error) {
    console.error('Plagiarism check error:', error)
  }
}

