import * as monaco from 'monaco-editor'
import { luauLanguageConfig, luauTokenProvider } from './luau-language'
import { createRobloxCompletions, createContextAwareCompletions } from './roblox-completions'
import { robloxStudioTheme } from './roblox-theme'

let monacoInitialized = false

export function setupMonacoEditor(monacoInstance?: typeof monaco) {
  const monacoLib = monacoInstance || monaco
  
  if (monacoInitialized) return
  
  // Register Luau language
  monacoLib.languages.register({ id: 'luau' })
  
  // Set language configuration
  monacoLib.languages.setLanguageConfiguration('luau', luauLanguageConfig)
  
  // Set tokenizer (syntax highlighting)
  monacoLib.languages.setMonarchTokensProvider('luau', luauTokenProvider)
  
  // Register theme FIRST - before any editor instances
  monacoLib.editor.defineTheme('roblox-studio', robloxStudioTheme)
  
  // Register completion provider with context awareness
  monacoLib.languages.registerCompletionItemProvider('luau', {
    provideCompletionItems: (model, position, context) => {
      const word = model.getWordUntilPosition(position)
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }
      
      // Get context-aware completions (e.g., GetService suggestions)
      const contextCompletions = createContextAwareCompletions(
        textUntilPosition,
        position,
        range
      )
      
      // Get general Roblox completions
      const generalCompletions = createRobloxCompletions().map(item => ({
        ...item,
        range,
      }))
      
      // Combine and deduplicate
      const allSuggestions = [...contextCompletions, ...generalCompletions]
      const uniqueSuggestions = Array.from(
        new Map(allSuggestions.map(item => [item.label, item])).values()
      )
      
      return { suggestions: uniqueSuggestions }
    },
    triggerCharacters: ['.', ':', '(', '[', '"', "'", 'g', 'G'],
  })
  
  // Register hover provider (tooltips)
  monacoLib.languages.registerHoverProvider('luau', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null
      
      // Add hover documentation for Roblox APIs
      const wordText = word.word
      
      const robloxServices = [
        'game', 'workspace', 'Players', 'ReplicatedStorage', 'ServerStorage',
        'TweenService', 'RunService', 'UserInputService', 'HttpService',
        'DataStoreService', 'MessagingService', 'TeleportService', 'Chat',
        'Teams', 'BadgeService', 'GroupService', 'MarketplaceService',
        'GuiService', 'ContextActionService', 'PathfindingService',
        'PhysicsService', 'CollectionService',
      ]
      
      if (robloxServices.includes(wordText)) {
        return {
          range: new monacoLib.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${wordText}** - Roblox Service` },
            { value: `Access via: \`game:GetService("${wordText}")\`` },
          ],
        }
      }
      
      return null
    },
  })
  
  monacoInitialized = true
}

