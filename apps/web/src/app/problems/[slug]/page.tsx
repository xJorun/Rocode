'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button, Badge, DifficultyBadge, StatusBadge, Tabs, TabsList, TabsTrigger, TabsContent, Loading } from '@rocode/ui'
import { Play, Send, RotateCcw, Clock, Cpu, Check, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import dynamic from 'next/dynamic'
import { setupMonacoEditor } from '@/lib/monaco/setup-monaco'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function ProblemPage() {
  const params = useParams()
  const slug = params.slug as string

  const [code, setCode] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [consoleTab, setConsoleTab] = useState('testcases')
  const [runResults, setRunResults] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => api.getProblem(slug),
    enabled: !!slug,
  })

  const { data: submissionsData } = useQuery({
    queryKey: ['submissions', slug],
    queryFn: () => api.getProblemSubmissions(slug, true),
    enabled: !!slug,
  })

  useEffect(() => {
    if (data?.problem?.template && !code) {
      setCode(data.problem.template)
    }
  }, [data?.problem?.template, code])

  const runMutation = useMutation({
    mutationFn: () => api.runCode(slug, code),
    onSuccess: async (result: any) => {
      setConsoleTab('output')
      setRunResults({
        type: 'run',
        results: result.results,
        allPassed: result.allPassed,
      })
    },
    onError: (error: any) => {
      setConsoleTab('output')
      setRunResults({ type: 'error', error: error.message || 'Failed to run code' })
    },
  })

  const submitMutation = useMutation({
    mutationFn: () => api.submitCode(slug, code),
    onSuccess: async (result: any) => {
      setConsoleTab('output')
      setRunResults({
        type: 'submission',
        status: result.status,
        runtimeMs: result.runtimeMs,
        testResults: result.results,
        allPassed: result.allPassed,
      })
    },
    onError: (error: any) => {
      setConsoleTab('output')
      setRunResults({ type: 'error', error: error.message || 'Failed to submit' })
    },
  })

  const handleReset = () => {
    if (data?.problem?.template) {
      setCode(data.problem.template)
    }
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loading text="Loading problem..." />
      </div>
    )
  }

  if (!data?.problem) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-zinc-400">Problem not found</p>
      </div>
    )
  }

  const { problem, testCases } = data

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-4 mt-2 w-fit">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="editorial">Editorial</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{problem.statementMd}</ReactMarkdown>
              </div>

              {problem.constraints && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Constraints</h3>
                  <div className="text-sm text-zinc-400 font-mono bg-zinc-900 rounded-lg p-3">
                    {problem.constraints}
                  </div>
                </div>
              )}

              {testCases && testCases.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Examples</h3>
                  <div className="space-y-4">
                    {testCases.map((tc: any, i: number) => (
                      <div key={tc.id} className="bg-zinc-900 rounded-lg p-4">
                        <p className="text-xs text-zinc-500 mb-2">Example {i + 1}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-zinc-400 mb-1">Input</p>
                            <pre className="text-sm font-mono">{tc.input}</pre>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-400 mb-1">Output</p>
                            <pre className="text-sm font-mono">{tc.expectedOutput}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="editorial" className="flex-1 overflow-auto p-4">
              <div className="text-center text-zinc-400 py-8">
                <p>Solve the problem to unlock the editorial</p>
                <p className="text-sm mt-1">or upgrade to Pro for instant access</p>
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
              {submissionsData?.submissions && submissionsData.submissions.length > 0 ? (
                <div className="space-y-2">
                  {submissionsData.submissions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
                    >
                      <StatusBadge status={sub.status} />
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        {sub.runtimeMs && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {sub.runtimeMs}ms
                          </span>
                        )}
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-zinc-400 py-8">No submissions yet</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>Luau</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language="luau"
              theme="roblox-studio"
              value={code}
              onChange={(value) => setCode(value || '')}
              beforeMount={(monaco) => {
                setupMonacoEditor(monaco)
              }}
              onMount={(editor, monaco) => {
                // Ensure theme is set
                monaco.editor.setTheme('roblox-studio')
                // Roblox Studio-like settings
                editor.updateOptions({
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Consolas, "Courier New", monospace',
                  fontLigatures: false,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  tabSize: 4,
                  insertSpaces: true,
                  detectIndentation: false,
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                  },
                  acceptSuggestionOnCommitCharacter: true,
                  acceptSuggestionOnEnter: 'on',
                  snippetSuggestions: 'top',
                  suggestSelection: 'first',
                  wordBasedSuggestions: 'all',
                  parameterHints: {
                    enabled: true,
                    cycle: true,
                  },
                  hover: {
                    enabled: true,
                    delay: 300,
                  },
                  colorDecorators: true,
                  bracketPairColorization: {
                    enabled: true,
                  },
                  guides: {
                    bracketPairs: 'active',
                    indentation: true,
                  },
                })
              }}
            />
          </div>

          <div className="h-48 border-t border-zinc-800 flex flex-col">
            <Tabs value={consoleTab} onValueChange={setConsoleTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800">
                <TabsList className="h-8">
                  <TabsTrigger value="testcases" className="text-xs">Test Cases</TabsTrigger>
                  <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => runMutation.mutate()}
                    disabled={runMutation.isPending || submitMutation.isPending}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending || runMutation.isPending}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit
                  </Button>
                </div>
              </div>

              <TabsContent value="testcases" className="flex-1 overflow-auto p-2">
                <div className="grid grid-cols-2 gap-2">
                  {testCases?.slice(0, 2).map((tc: any, i: number) => (
                    <div key={tc.id} className="bg-zinc-900 rounded p-2">
                      <p className="text-xs text-zinc-400 mb-1">Case {i + 1}</p>
                      <pre className="text-xs font-mono">{tc.input}</pre>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="output" className="flex-1 overflow-auto p-2">
                {runMutation.isPending || submitMutation.isPending ? (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Loading size="sm" />
                    <span>Running...</span>
                  </div>
                ) : runResults ? (
                  <div className="space-y-2">
                    {runResults.type === 'error' && (
                      <pre className="text-sm font-mono text-red-400 bg-red-500/10 rounded p-2">
                        {runResults.error}
                      </pre>
                    )}

                    {runResults.type === 'submission' && (
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={runResults.status} />
                        {runResults.runtimeMs && (
                          <span className="text-xs text-zinc-400">
                            {runResults.runtimeMs}ms
                          </span>
                        )}
                        {runResults.allPassed && (
                          <span className="text-xs text-emerald-400 font-medium">All tests passed!</span>
                        )}
                      </div>
                    )}

                    {runResults.type === 'run' && runResults.allPassed && (
                      <div className="text-emerald-400 text-sm font-medium mb-2">
                        ✓ All test cases passed
                      </div>
                    )}

                    {(runResults.results || runResults.testResults)?.map((result: any, i: number) => (
                      <div
                        key={result.testId || i}
                        className={`p-3 rounded-lg ${
                          result.passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-sm font-medium">Test {i + 1}</span>
                          <span className="text-xs text-zinc-400">{result.runtimeMs}ms</span>
                        </div>
                        {!result.passed && (
                          <div className="text-xs font-mono space-y-1">
                            {result.error ? (
                              <div className="text-red-400">{result.error}</div>
                            ) : (
                              <>
                                <div className="text-zinc-400">Output: <span className="text-zinc-200">{result.output || result.actualOutput || '(empty)'}</span></div>
                                <div className="text-zinc-400">Expected: <span className="text-zinc-200">{result.expected || '(check)'}</span></div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">Run your code to see output</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

