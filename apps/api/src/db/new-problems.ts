// 24 new Roblox-specific problems
export const newProblems = [
  {
    slug: 'cooldown-manager',
    title: 'Cooldown Manager',
    difficulty: 'easy',
    tags: ['roblox', 'cooldowns', 'time-tracking', 'gameplay'],
    statementMd: `You are given a list of ability cast timestamps for a player and a cooldown duration. Return whether each cast is valid.

**Roblox Context:** Ability cooldowns are critical for game balance. This tests your ability to track time-based state efficiently.

**Input:**
- \`casts\`: array of numbers (timestamps in seconds, increasing)
- \`cooldown\`: number

**Output:**
- array of booleans where \`true\` means the cast is allowed

**Rules:**
- A cast is valid if \`currentTime - lastValidCast >= cooldown\`
- First cast is always valid

**Example:**
\`\`\`
Input: casts = {0, 2, 5, 6}, cooldown = 3
Output: {true, false, true, false}
\`\`\``,
    template: `function validateCasts(casts, cooldown)
    local result = {}
    local lastValid = -math.huge
    for _, time in ipairs(casts) do
        if time - lastValid >= cooldown then
            table.insert(result, true)
            lastValid = time
        else
            table.insert(result, false)
        end
    end
    return result
end

local casts = readnumbers()
local cooldown = readnumber()
local result = validateCasts(casts, cooldown)
for i, valid in ipairs(result) do
    print(valid and "true" or "false")
end`,
    constraints: '1 <= #casts <= 1000\n0 <= casts[i] <= 10^6\n1 <= cooldown <= 1000\n\n**Roblox Performance:** O(n) solution required.',
    tests: [
      { input: '0 2 5 6\n3', expected: 'true\nfalse\ntrue\nfalse', visibility: 'public' },
      { input: '0 1 2 3\n1', expected: 'true\ntrue\ntrue\ntrue', visibility: 'hidden' },
    ],
  },
  // ... (I'll add the rest in the actual seed file)
]

