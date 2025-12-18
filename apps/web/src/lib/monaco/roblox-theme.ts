import * as monaco from 'monaco-editor'

// Roblox Studio-inspired dark theme
export const robloxStudioTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Keywords
    { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'type.identifier', foreground: '569CD6' }, // Roblox services/types
    
    // Strings
    { token: 'string', foreground: 'CE9178' },
    { token: 'string.escape', foreground: 'D7BA7D' },
    
    // Numbers
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'number.float', foreground: 'B5CEA8' },
    { token: 'number.hex', foreground: 'B5CEA8' },
    
    // Comments
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    
    // Operators
    { token: 'operator', foreground: 'D4D4D4' },
    
    // Identifiers
    { token: 'identifier', foreground: 'D4D4D4' },
    
    // Delimiters
    { token: 'delimiter', foreground: 'D4D4D4' },
    
    // Invalid
    { token: 'invalid', foreground: 'F48771' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editor.selectionBackground': '#264F78',
    'editor.lineHighlightBackground': '#2A2D2E',
    'editorCursor.foreground': '#AEAFAD',
    'editorWhitespace.foreground': '#3B3A32',
    'editorIndentGuide.activeBackground': '#707070',
    'editor.selectionHighlightBackground': '#ADD6FF26',
    'editor.findMatchBackground': '#515C6A',
    'editor.findMatchHighlightBackground': '#EA5C0055',
    'editorBracketMatch.background': '#0064001A',
    'editorBracketMatch.border': '#888888',
  },
}

