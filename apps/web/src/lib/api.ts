const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }

    return res.json()
  }

  async getProblems(params?: {
    search?: string
    difficulty?: string
    tags?: string[]
    status?: string
    sort?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.tags) {
      params.tags.forEach(tag => searchParams.append('tags', tag))
    }

    return this.request<{
      problems: any[]
      pagination: { page: number; limit: number; total: number; totalPages: number }
    }>(`/problems?${searchParams}`)
  }

  async getProblem(slug: string) {
    return this.request<{ problem: any; testCases: any[] }>(`/problems/${slug}`)
  }

  async runCode(slug: string, code: string, testCases?: { input: string }[]) {
    return this.request<{ status: string; results: any[]; allPassed: boolean }>(`/problems/${slug}/run`, {
      method: 'POST',
      body: JSON.stringify({ code, testCases }),
    })
  }

  async submitCode(slug: string, code: string) {
    return this.request<{ submissionId: string; status: string; runtimeMs: number; results: any[]; allPassed: boolean }>(`/problems/${slug}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async getSubmission(id: string) {
    return this.request<{ submission: any }>(`/submissions/${id}`)
  }

  async getSubmissionStatus(id: string) {
    return this.request<{ submission: any }>(`/submissions/${id}/status`)
  }

  async getProblemSubmissions(slug: string, me?: boolean) {
    return this.request<{ submissions: any[] }>(
      `/problems/${slug}/submissions${me ? '?me=1' : ''}`
    )
  }

  async getUser(username: string) {
    return this.request<{ user: any }>(`/users/${username}`)
  }

  async getUserSubmissions(username: string, page = 1) {
    return this.request<{ submissions: any[]; pagination: any }>(
      `/users/${username}/submissions?page=${page}`
    )
  }

  async getLeaderboard(range: string = 'weekly', page = 1) {
    return this.request<{ entries: any[]; pagination: any }>(
      `/leaderboard/global?range=${range}&page=${page}`
    )
  }

  async getPlans() {
    return this.request<{ plans: any[] }>('/billing/plans')
  }

  async createCheckout(priceId: string) {
    return this.request<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    })
  }

  async getBillingStatus() {
    return this.request<{ planTier: string; subscription: any }>('/billing/status')
  }

  async runPlayground(code: string) {
    return this.request<{ output: string; error: string | null; runtimeMs: number }>('/playground/run', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async createSnippet(code: string, title?: string) {
    return this.request<{ snippet: any }>('/playground/snippets', {
      method: 'POST',
      body: JSON.stringify({ code, title }),
    })
  }

  async getSnippet(id: string) {
    return this.request<{ snippet: any }>(`/playground/snippets/${id}`)
  }
}

export const api = new ApiClient()

