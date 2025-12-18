import * as monaco from 'monaco-editor'

// Roblox Services
const robloxServices = [
  'game', 'workspace', 'Players', 'ReplicatedStorage', 'ServerStorage',
  'StarterPlayer', 'StarterGui', 'StarterPack', 'Lighting', 'SoundService',
  'TweenService', 'RunService', 'UserInputService', 'HttpService', 'DataStoreService',
  'MessagingService', 'TeleportService', 'Chat', 'Teams', 'BadgeService',
  'GroupService', 'MarketplaceService', 'GuiService', 'ContextActionService',
  'PathfindingService', 'PhysicsService', 'CollectionService', 'ReplicatedFirst',
]

// Common Roblox Types
const robloxTypes = [
  'Vector3', 'Vector2', 'CFrame', 'Color3', 'ColorSequence', 'BrickColor',
  'NumberSequence', 'NumberRange', 'UDim', 'UDim2', 'Ray', 'Region3',
  'Region3int16', 'Faces', 'Axes', 'Instance', 'BasePart', 'Part', 'MeshPart',
  'Model', 'Humanoid', 'HumanoidRootPart', 'Camera', 'GuiObject', 'Frame',
  'TextLabel', 'TextButton', 'ImageLabel', 'ImageButton', 'ScrollingFrame',
  'ScreenGui', 'SurfaceGui', 'BillboardGui', 'Signal', 'RBXScriptSignal',
  'RemoteEvent', 'RemoteFunction', 'BindableEvent', 'BindableFunction',
]

// Luau built-in functions
const luauBuiltins = [
  'print', 'type', 'tonumber', 'tostring', 'pairs', 'ipairs', 'next',
  'error', 'assert', 'pcall', 'xpcall', 'select', 'unpack', 'rawget',
  'rawset', 'rawequal', 'rawlen', 'getmetatable', 'setmetatable',
  'require', 'warn', 'gcinfo', 'collectgarbage', 'loadstring', 'load',
]

// Roblox-specific built-ins
const robloxBuiltins = [
  'wait', 'spawn', 'delay', 'tick', 'time', 'elapsedTime',
]

// Common methods and properties
const commonMethods = [
  'new', 'Destroy', 'Clone', 'FindFirstChild', 'GetChildren', 'GetDescendants',
  'WaitForChild', 'IsA', 'GetService', 'GetAttribute', 'SetAttribute',
  'GetAttributes', 'GetAttributeChangedSignal', 'Connect', 'Disconnect',
  'Fire', 'Invoke', 'Wait', 'Tween', 'Animate', 'Play', 'Stop', 'Pause',
]

// Vector3 methods
const vector3Methods = [
  'Magnitude', 'Unit', 'Dot', 'Cross', 'Lerp', 'ToOrientation', 'ToWorldSpace',
  'ToObjectSpace', 'ToAxisAngle',
]

// CFrame methods
const cframeMethods = [
  'LookAt', 'Angles', 'fromEulerAnglesXYZ', 'fromEulerAnglesYXZ', 'fromAxisAngle',
  'Lerp', 'ToWorldSpace', 'ToObjectSpace', 'ToEulerAnglesXYZ', 'ToEulerAnglesYXZ',
  'PointToWorldSpace', 'PointToObjectSpace', 'VectorToWorldSpace', 'VectorToObjectSpace',
]

// Create completion items
function createServiceCompletions(): monaco.languages.CompletionItem[] {
  return robloxServices.map(service => ({
    label: service,
    kind: monaco.languages.CompletionItemKind.Module,
    insertText: service,
  }))
}

function createTypeCompletions(): monaco.languages.CompletionItem[] {
  return robloxTypes.map(type => ({
    label: type,
    kind: monaco.languages.CompletionItemKind.Class,
    insertText: type,
  }))
}

function createLuauBuiltinCompletions(): monaco.languages.CompletionItem[] {
  return luauBuiltins.map(fn => ({
    label: fn,
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: fn + '(${1})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }))
}

function createRobloxBuiltinCompletions(): monaco.languages.CompletionItem[] {
  return robloxBuiltins.map(fn => ({
    label: fn,
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: fn + '(${1})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }))
}

function createMethodCompletions(): monaco.languages.CompletionItem[] {
  return commonMethods.map(method => ({
    label: method,
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: method + '()',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }))
}

function createVector3Completions(): monaco.languages.CompletionItem[] {
  return vector3Methods.map(method => ({
    label: method,
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: method + '()',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }))
}

function createCFrameCompletions(): monaco.languages.CompletionItem[] {
  return cframeMethods.map(method => ({
    label: method,
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: method + '()',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }))
}

// Common code snippets
const snippets: monaco.languages.CompletionItem[] = [
  {
    label: 'function',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'function ${1:name}(${2:params})\n\t${3:-- body}\nend',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Function declaration',
  },
  {
    label: 'for i',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'for ${1:i} = ${2:1}, ${3:10} do\n\t${4:-- body}\nend',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Numeric for loop',
  },
  {
    label: 'for in',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'for ${1:key}, ${2:value} in ${3:pairs|ipairs}(${4:table}) do\n\t${5:-- body}\nend',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Generic for loop',
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'if ${1:condition} then\n\t${2:-- body}\nend',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'If statement',
  },
  {
    label: 'local',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'local ${1:name} = ${2:value}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Local variable',
  },
  {
    label: 'Vector3.new',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'Vector3.new(${1:x}, ${2:y}, ${3:z})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Create Vector3',
  },
  {
    label: 'CFrame.new',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'CFrame.new(${1:x}, ${2:y}, ${3:z})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Create CFrame',
  },
  {
    label: 'GetService',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'game:GetService("${1:ServiceName}")',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Get Roblox service',
  },
]

export function createContextAwareCompletions(
  textUntilPosition: string,
  position: monaco.Position,
  range: monaco.IRange
): monaco.languages.CompletionItem[] {
  const suggestions: monaco.languages.CompletionItem[] = []
  
  // Check if we're inside GetService("...")
  const getServiceMatch = textUntilPosition.match(/GetService\s*\(\s*["']([^"']*)$/)
  if (getServiceMatch) {
    // User is typing inside GetService quotes - suggest service names
    const partial = getServiceMatch[1].toLowerCase()
    const matchingServices = robloxServices.filter(service =>
      service.toLowerCase().includes(partial)
    )
    
    suggestions.push(...matchingServices.map(service => ({
      label: service,
      kind: monaco.languages.CompletionItemKind.Value,
      insertText: service,
      range,
      sortText: `0${service}`, // Prioritize these
    })))
  }
  
  // Check if we're after game: or game.
  const gameMatch = textUntilPosition.match(/game\s*[:.]\s*(\w*)$/)
  if (gameMatch) {
    const partial = gameMatch[1].toLowerCase()
    if (partial === '' || 'getservice'.startsWith(partial)) {
      suggestions.push({
        label: 'GetService',
        kind: monaco.languages.CompletionItemKind.Method,
        insertText: 'GetService("${1:ServiceName}")',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        sortText: '0GetService',
      })
    }
  }
  
  // Check if we're after Vector3. or Vector3:
  const vector3Match = textUntilPosition.match(/Vector3\s*[:.]\s*(\w*)$/)
  if (vector3Match) {
    const partial = vector3Match[1].toLowerCase()
    const matchingMethods = vector3Methods.filter(method =>
      method.toLowerCase().startsWith(partial)
    )
    
    suggestions.push(...matchingMethods.map(method => ({
      label: method,
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: method + '()',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
      sortText: `0${method}`,
    })))
  }
  
  // Check if we're after CFrame. or CFrame:
  const cframeMatch = textUntilPosition.match(/CFrame\s*[:.]\s*(\w*)$/)
  if (cframeMatch) {
    const partial = cframeMatch[1].toLowerCase()
    const matchingMethods = cframeMethods.filter(method =>
      method.toLowerCase().startsWith(partial)
    )
    
    suggestions.push(...matchingMethods.map(method => ({
      label: method,
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: method + '()',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range,
      sortText: `0${method}`,
    })))
  }
  
  return suggestions
}

export function createRobloxCompletions(): monaco.languages.CompletionItem[] {
  return [
    ...createLuauBuiltinCompletions(),
    ...createRobloxBuiltinCompletions(),
    ...createServiceCompletions(),
    ...createTypeCompletions(),
    ...createMethodCompletions(),
    ...createVector3Completions(),
    ...createCFrameCompletions(),
    ...snippets,
  ]
}

