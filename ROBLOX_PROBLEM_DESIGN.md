# Roblox Problem Design Philosophy

## Overview

RoCode is designed to be a **Roblox-specific LeetCode**, not just LeetCode with Luau syntax. This document outlines our approach to creating problems that are valuable for Roblox studios.

## Problem Categories

### 1. Roblox-Specific Problems (`roblox` tag)

These problems are directly relevant to Roblox development:

- **Event Throttle System**: Throttling RemoteEvents and GUI clicks
- **Replication Batch Optimizer**: Optimizing network calls for mobile performance
- **Yield-Safe Loop Processor**: Preventing script timeouts with proper yielding
- **Instance Tree Search**: Efficiently navigating Instance hierarchies
- **GUI Layout Calculator**: Dynamic UI positioning for different screen sizes
- **Generate Valid Animation States**: Managing animation layer state

**Key Characteristics:**
- Directly applicable to Roblox game development
- Include Roblox performance considerations
- Test Roblox-specific skills (yielding, replication, instances)
- Framed in game development context

### 2. Core Algorithms (`core-algorithms` tag)

These are fundamental algorithmic problems that test problem-solving skills:

- **Generate Parentheses**: Backtracking and recursion
- **Two Sum**: Hash tables and lookups
- **Binary Search**: Search algorithms

**Key Characteristics:**
- Explicitly labeled as "Core Algorithms"
- Include note: "While not Roblox-specific, these skills are fundamental"
- Still include Luau performance notes (GC pressure, etc.)
- Useful for studios to assess raw problem-solving ability

### 3. Roblox-Flavored Variants

Some problems are reframed with Roblox context:

- **Inventory Manager**: Generic inventory → Roblox inventory system
- **State Machine**: Generic FSM → Character movement state machine
- **Cooldown System**: Generic cooldowns → Game ability cooldowns

**Key Characteristics:**
- Same algorithmic core as classic problems
- Framed in Roblox game context
- Include Roblox performance constraints
- More engaging for Roblox developers

## Design Principles

### 1. Roblox Performance Awareness

Every problem includes performance notes relevant to Roblox:

- **GC Pressure**: "Avoid excessive string creation due to Luau GC pressure"
- **Frame Budgets**: "Solutions must complete in O(1) to avoid frame drops"
- **Yielding**: "Must yield between chunks to prevent script timeout"
- **Network Efficiency**: "Minimize RemoteEvent calls for mobile performance"

### 2. Game Development Context

Problems are framed in game development scenarios:

- Character movement systems
- Inventory management
- UI layout calculations
- Event handling
- Animation state management

### 3. Production-Ready Constraints

Constraints reflect real-world Roblox limitations:

- Script timeout limits (require yielding)
- Network bandwidth (batch updates)
- Mobile performance (optimize for low-end devices)
- Memory constraints (GC pressure)

### 4. Clear Categorization

Problems are tagged to set expectations:

- `roblox`: Directly applicable to Roblox development
- `core-algorithms`: Fundamental problem-solving
- `gameplay`: Game mechanics and systems
- `performance`: Optimization-focused
- `ui`: User interface development

## Example: Generate Parentheses → Generate Valid Animation States

**Original (Core Algorithm):**
- Generic parentheses generation
- Tests backtracking/recursion
- No game context

**Roblox Variant:**
- Animation layer state management
- Same algorithmic core
- Framed in Roblox context
- Includes performance notes about recursion depth

## Problem Template

```typescript
{
  slug: 'problem-name',
  title: 'Problem Title',
  difficulty: 'medium',
  tags: ['roblox', 'category'], // Always include 'roblox' for Roblox-specific
  statementMd: `
    Problem description...
    
    **Roblox Context:** Why this matters in Roblox development.
    
    **Example:**
    ...
  `,
  constraints: `
    Standard constraints...
    
    **Roblox Performance:** Specific performance notes for Roblox.
  `,
}
```

## Benefits for Studios

1. **Relevant Skills**: Problems test skills actually used in Roblox development
2. **Performance Awareness**: Candidates understand Roblox performance constraints
3. **Game Context**: Problems are framed in scenarios studios actually encounter
4. **Clear Expectations**: Tagging helps studios find relevant problems

## Future Improvements

- Add more Roblox API-specific problems (RemoteEvents, DataStores, etc.)
- Include replication-aware problems
- Add problems testing knowledge of Roblox security best practices
- Create problems for common Roblox patterns (ModuleScript architecture, etc.)

