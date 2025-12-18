# Roblox Studio Editor Implementation

## Overview

The Monaco Editor has been enhanced to closely replicate the Roblox Studio code editor experience with full Luau support.

## Features Implemented

### 1. **Luau Language Support**
- Full Luau syntax highlighting
- Keyword recognition (and, break, do, else, elseif, end, for, function, if, local, nil, not, or, repeat, return, then, true, until, while)
- Luau-specific keywords (type, export, continue)
- String literals (single, double, long strings with `[[...]]`)
- Comments (line `--` and block `--[[...]]`)
- Number formats (decimal, hex, scientific notation)

### 2. **Roblox API Autocomplete**
- **Services**: game, workspace, Players, ReplicatedStorage, ServerStorage, TweenService, RunService, UserInputService, HttpService, DataStoreService, and more
- **Types**: Vector3, Vector2, CFrame, Color3, Instance, BasePart, Part, Model, Humanoid, and all Roblox types
- **Methods**: Common methods like GetService, FindFirstChild, GetChildren, Connect, Fire, etc.
- **Vector3/CFrame**: Specific methods like Magnitude, Dot, Cross, Lerp, LookAt, etc.

### 3. **Code Snippets**
- Function declarations
- For loops (numeric and generic)
- If statements
- Local variables
- Vector3.new, CFrame.new
- GetService calls

### 4. **Roblox Studio Theme**
- Dark theme matching Roblox Studio's color scheme
- Syntax highlighting colors:
  - Keywords: Purple (`#C586C0`)
  - Types: Teal (`#4EC9B0`)
  - Roblox Services: Blue (`#569CD6`)
  - Strings: Orange (`#CE9178`)
  - Numbers: Green (`#B5CEA8`)
  - Comments: Green (`#6A9955`)
- Background: `#1E1E1E` (Roblox Studio dark)
- Selection highlighting
- Bracket pair colorization

### 5. **Editor Features**
- Smooth cursor animation
- Parameter hints
- Hover tooltips for Roblox APIs
- Auto-indentation
- Format on paste/type
- Bracket pair guides
- Line highlighting
- Word-based suggestions

## Files Created

1. **`apps/web/src/lib/monaco/luau-language.ts`**
   - Luau language configuration
   - Syntax highlighting rules (Monarch tokenizer)

2. **`apps/web/src/lib/monaco/roblox-completions.ts`**
   - Autocomplete suggestions for Roblox APIs
   - Code snippets

3. **`apps/web/src/lib/monaco/roblox-theme.ts`**
   - Roblox Studio-inspired dark theme

4. **`apps/web/src/lib/monaco/setup-monaco.ts`**
   - Main setup function
   - Registers language, completions, hover provider, and theme

## Usage

The editor is automatically configured when you:
1. Visit a problem page (`/problems/[slug]`)
2. Visit the playground (`/playground`)

The setup runs once and configures Monaco Editor with:
- Luau language support
- Roblox API autocomplete
- Roblox Studio theme
- All editor enhancements

## Runtime

The editor still uses the **Luau runtime** for code execution. The executor (`apps/api/src/lib/executor.ts`) runs code using the actual Luau binary, maintaining full compatibility with Roblox scripting.

## What's Replicated

✅ Syntax highlighting (Luau-specific)
✅ Autocomplete (Roblox services, types, methods)
✅ Code snippets
✅ Roblox Studio theme
✅ Hover tooltips
✅ Parameter hints
✅ Bracket matching
✅ Smart indentation

## What's Not Replicated (Limitations)

❌ Live execution in Roblox environment
❌ Full API access (some APIs require running game)
❌ Debugging (breakpoints, step-through)
❌ Instance tree view
❌ Properties panel

These limitations are expected since we're running in a web environment, not Roblox Studio itself.

## Future Enhancements

- Add more Roblox API documentation in hover tooltips
- Implement type checking hints
- Add more code snippets
- Support for Luau type annotations
- Error detection and squiggles

