import * as monaco from 'monaco-editor'

// Luau language definition for Monaco Editor
export const luauLanguageConfig: monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '--',
    blockComment: ['--[[', ']]'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  indentationRules: {
    increaseIndentPattern: /^\s*(function|if|for|while|repeat|do)\b/,
    decreaseIndentPattern: /^\s*(end|until|else|elseif)\b/,
  },
}

// Luau syntax highlighting (Monarch tokenizer)
export const luauTokenProvider: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  tokenPostfix: '.luau',
  
  keywords: [
    'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
    'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return',
    'then', 'true', 'until', 'while',
    // Luau-specific
    'type', 'export', 'continue',
  ],
  
  typeKeywords: [
    'string', 'number', 'boolean', 'table', 'function', 'nil', 'any',
    'Vector3', 'CFrame', 'Instance', 'Signal', 'RBXScriptSignal',
  ],
  
  operators: [
    '+', '-', '*', '/', '%', '^', '#', '==', '~=', '<=', '>=', '<', '>',
    '=', '(', ')', '{', '}', '[', ']', ';', ':', ',', '.', '..', '...',
  ],
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@default': 'identifier',
          },
        },
      ],
      
      // Uppercase identifiers (Roblox services)
      [/[A-Z][\w$]*/, 'type.identifier'],
      
      // Whitespace
      { include: '@whitespace' },
      
      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\d+[eE][\-+]?\d+/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],
      
      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string_double' }],
      [/'/, { token: 'string.quote', bracket: '@open', next: '@string_single' }],
      [/\[=*\[/, { token: 'string.quote', bracket: '@open', next: '@string_long' }],
      
      // Comments
      [/--\[\[/, 'comment', '@comment_long'],
      [/--.*$/, 'comment'],
      
      // Delimiters
      [/[{}()\[\]]/, '@brackets'],
      [/[;,.]/, 'delimiter'],
      
      // Operators
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': '',
        },
      }],
    ],
    
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],
    
    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],
    
    string_long: [
      [/[^\]]+/, 'string'],
      [/\]\]/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],
    
    comment_long: [
      [/[^\]]+/, 'comment'],
      [/\]\]/, { token: 'comment', next: '@pop' }],
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
}

