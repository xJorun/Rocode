import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool, { schema })

const problems = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['arrays', 'tables'],
    statementMd: `Given a table of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example 1:**
\`\`\`
Input: nums = {2, 7, 11, 15}, target = 9
Output: {1, 2}
Explanation: Because nums[1] + nums[2] == 9, we return {1, 2}.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = {3, 2, 4}, target = 6
Output: {2, 3}
\`\`\``,
    template: `function twoSum(nums, target)
    -- Your code here
    
end

-- Read input
local nums = readnumbers()
local target = readnumber()

-- Call solution and print result
local result = twoSum(nums, target)
print(result[1], result[2])`,
    constraints: '2 <= #nums <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    tests: [
      { input: '2 7 11 15\n9', expected: '1\t2', visibility: 'public' },
      { input: '3 2 4\n6', expected: '2\t3', visibility: 'public' },
      { input: '3 3\n6', expected: '1\t2', visibility: 'hidden' },
    ],
  },
  {
    slug: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'easy',
    tags: ['strings'],
    statementMd: `Write a function that reverses a string.

**Example 1:**
\`\`\`
Input: s = "hello"
Output: "olleh"
\`\`\`

**Example 2:**
\`\`\`
Input: s = "Roblox"
Output: "xolboR"
\`\`\``,
    template: `function reverseString(s)
    -- Your code here
    
end

local s = readline()
print(reverseString(s))`,
    constraints: '1 <= #s <= 10^5\ns consists of printable ASCII characters.',
    tests: [
      { input: 'hello', expected: 'olleh', visibility: 'public' },
      { input: 'Roblox', expected: 'xolboR', visibility: 'public' },
      { input: 'a', expected: 'a', visibility: 'hidden' },
    ],
  },
  {
    slug: 'fizz-buzz',
    title: 'Fizz Buzz',
    difficulty: 'easy',
    tags: ['math', 'strings'],
    statementMd: `Given an integer \`n\`, return a table where for each number from 1 to n:

- If the number is divisible by 3, add "Fizz"
- If the number is divisible by 5, add "Buzz"
- If the number is divisible by both 3 and 5, add "FizzBuzz"
- Otherwise, add the number as a string

**Example:**
\`\`\`
Input: n = 15
Output: {"1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"}
\`\`\``,
    template: `function fizzBuzz(n)
    -- Your code here
    
end

local n = readnumber()
local result = fizzBuzz(n)
for _, v in ipairs(result) do
    print(v)
end`,
    constraints: '1 <= n <= 10^4',
    tests: [
      { input: '15', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', visibility: 'public' },
      { input: '5', expected: '1\n2\nFizz\n4\nBuzz', visibility: 'public' },
      { input: '1', expected: '1', visibility: 'hidden' },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['strings', 'tables'],
    statementMd: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\``,
    template: `function isValid(s)
    -- Your code here
    
end

local s = readline()
print(isValid(s) and "true" or "false")`,
    constraints: '1 <= #s <= 10^4\ns consists of parentheses only \'()[]{}\'.',
    tests: [
      { input: '()', expected: 'true', visibility: 'public' },
      { input: '()[]{}', expected: 'true', visibility: 'public' },
      { input: '(]', expected: 'false', visibility: 'hidden' },
      { input: '([)]', expected: 'false', visibility: 'hidden' },
    ],
  },
  {
    slug: 'merge-sorted-arrays',
    title: 'Merge Sorted Arrays',
    difficulty: 'easy',
    tags: ['arrays', 'sorting'],
    statementMd: `You are given two sorted tables \`nums1\` and \`nums2\`. Merge them into a single sorted table.

**Example:**
\`\`\`
Input: nums1 = {1, 2, 4}, nums2 = {1, 3, 4}
Output: {1, 1, 2, 3, 4, 4}
\`\`\``,
    template: `function merge(nums1, nums2)
    -- Your code here
    
end

local nums1 = readnumbers()
local nums2 = readnumbers()
local result = merge(nums1, nums2)
print(table.concat(result, " "))`,
    constraints: '0 <= #nums1, #nums2 <= 200\n-10^9 <= nums1[i], nums2[j] <= 10^9',
    tests: [
      { input: '1 2 4\n1 3 4', expected: '1 1 2 3 4 4', visibility: 'public' },
      { input: '1\n', expected: '1', visibility: 'hidden' },
    ],
  },
  {
    slug: 'signal-debounce',
    title: 'Signal Debounce',
    difficulty: 'medium',
    tags: ['signals', 'cooldowns'],
    statementMd: `Implement a debounce function for Roblox signals. Given a series of timestamps when a signal fires and a debounce duration, return the timestamps when the callback would actually execute.

A debounced function only executes after the specified duration has passed without another call.

**Example:**
\`\`\`
Input: timestamps = {0, 100, 150, 400, 500}, duration = 200
Output: {350, 700}
Explanation: 
- Events at 0, 100, 150 are within 200ms of each other, callback fires at 150+200=350
- Events at 400, 500 are within 200ms of each other, callback fires at 500+200=700
\`\`\``,
    template: `function debounce(timestamps, duration)
    -- Your code here
    
end

local timestamps = readnumbers()
local duration = readnumber()
local result = debounce(timestamps, duration)
print(table.concat(result, " "))`,
    constraints: '1 <= #timestamps <= 10^4\n0 <= timestamps[i] <= 10^9\n1 <= duration <= 10^6',
    tests: [
      { input: '0 100 150 400 500\n200', expected: '350 700', visibility: 'public' },
      { input: '0 300 600\n200', expected: '200 500 800', visibility: 'hidden' },
    ],
  },
  {
    slug: 'inventory-manager',
    title: 'Inventory Manager',
    difficulty: 'medium',
    tags: ['roblox', 'tables', 'inventory', 'gameplay'],
    statementMd: `Implement an inventory manager for a Roblox game that supports the following operations:
- \`add(item, count)\` - Add count items
- \`remove(item, count)\` - Remove count items (returns false if not enough)
- \`get(item)\` - Get current count

Process a list of operations and return the final inventory state.

**Roblox Context:** In Roblox games, inventory systems must handle rapid add/remove operations efficiently. This problem tests your ability to manage game state with O(1) lookups.

**Example:**
\`\`\`
Input:
add Sword 5
add Shield 3
remove Sword 2
get Sword
add Potion 10
remove Shield 5

Output:
Sword: 3
Shield: 3
Potion: 10
\`\`\``,
    template: `function processInventory(operations)
    local inventory = {}
    -- Your code here
    
    return inventory
end

local ops = {}
while true do
    local line = readline()
    if not line then break end
    table.insert(ops, line)
end

local result = processInventory(ops)
local keys = {}
for k in pairs(result) do table.insert(keys, k) end
table.sort(keys)
for _, k in ipairs(keys) do
    print(k .. ": " .. result[k])
end`,
    constraints: '1 <= operations <= 1000\n\n**Roblox Performance:** Operations should complete in O(1) average time. Avoid nested loops that could cause frame drops during inventory updates.',
    tests: [
      { input: 'add Sword 5\nadd Shield 3\nremove Sword 2\nadd Potion 10', expected: 'Potion: 10\nShield: 3\nSword: 3', visibility: 'public' },
    ],
  },
  {
    slug: 'state-machine',
    title: 'State Machine',
    difficulty: 'medium',
    tags: ['roblox', 'state-machines', 'gameplay'],
    statementMd: `Implement a finite state machine for character movement in a Roblox game. Given a list of states, transitions, and a sequence of inputs, determine the final state.

**Roblox Context:** Character movement in Roblox requires careful state management to prevent animation glitches and ensure smooth transitions. This problem tests your ability to design state machines that handle complex game logic.

**Example:**
\`\`\`
States: idle, walking, jumping
Initial: idle
Transitions:
  idle + walk -> walking
  walking + stop -> idle
  idle + jump -> jumping
  walking + jump -> jumping
  jumping + land -> idle

Input sequence: walk, jump, land
Output: idle
\`\`\``,
    template: `function runStateMachine(initial, transitions, inputs)
    local state = initial
    -- Your code here
    
    return state
end

local initial = readline()
local numTransitions = readnumber()
local transitions = {}
for i = 1, numTransitions do
    local parts = string.split(readline(), " ")
    transitions[parts[1] .. "+" .. parts[2]] = parts[3]
end
local inputs = string.split(readline(), " ")

print(runStateMachine(initial, transitions, inputs))`,
    constraints: '1 <= states <= 100\n1 <= transitions <= 1000\n1 <= inputs <= 1000\n\n**Roblox Performance:** State transitions should be O(1) lookups. Avoid linear searches that could cause frame drops during rapid input sequences.',
    tests: [
      { input: 'idle\n5\nidle walk walking\nwalking stop idle\nidle jump jumping\nwalking jump jumping\njumping land idle\nwalk jump land', expected: 'idle', visibility: 'public' },
    ],
  },
  {
    slug: 'cooldown-system',
    title: 'Cooldown System',
    difficulty: 'medium',
    tags: ['cooldowns', 'simulation'],
    statementMd: `Implement a cooldown system for game abilities. Given ability cooldowns and a sequence of (time, ability) pairs representing attempted uses, return which abilities were successfully used.

An ability can only be used if its cooldown has expired.

**Example:**
\`\`\`
Abilities: Fireball (3s), Shield (5s), Heal (10s)
Attempts: (0, Fireball), (1, Fireball), (3, Fireball), (4, Shield), (8, Shield)

Output: 0:Fireball, 3:Fireball, 4:Shield
(Fireball at 1s failed because cooldown hadn't expired)
(Shield at 8s failed because 5s cooldown from 4s = ready at 9s)
\`\`\``,
    template: `function processCooldowns(cooldowns, attempts)
    local lastUsed = {}
    local results = {}
    -- Your code here
    
    return results
end

local numAbilities = readnumber()
local cooldowns = {}
for i = 1, numAbilities do
    local parts = string.split(readline(), " ")
    cooldowns[parts[1]] = tonumber(parts[2])
end

local numAttempts = readnumber()
local attempts = {}
for i = 1, numAttempts do
    local parts = string.split(readline(), " ")
    table.insert(attempts, {time = tonumber(parts[1]), ability = parts[2]})
end

local results = processCooldowns(cooldowns, attempts)
for _, r in ipairs(results) do
    print(r.time .. ":" .. r.ability)
end`,
    constraints: '1 <= abilities <= 50\n1 <= attempts <= 1000',
    tests: [
      { input: '3\nFireball 3\nShield 5\nHeal 10\n5\n0 Fireball\n1 Fireball\n3 Fireball\n4 Shield\n8 Shield', expected: '0:Fireball\n3:Fireball\n4:Shield', visibility: 'public' },
    ],
  },
  {
    slug: 'vector-distance',
    title: 'Vector Distance',
    difficulty: 'easy',
    tags: ['vectors', 'math'],
    statementMd: `Calculate the Euclidean distance between two 3D vectors.

**Example:**
\`\`\`
Input: v1 = Vector3.new(0, 0, 0), v2 = Vector3.new(3, 4, 0)
Output: 5
\`\`\``,
    template: `function distance(v1, v2)
    -- Your code here
    
end

local v1Parts = readnumbers()
local v2Parts = readnumbers()
local v1 = Vector3.new(v1Parts[1], v1Parts[2], v1Parts[3])
local v2 = Vector3.new(v2Parts[1], v2Parts[2], v2Parts[3])

print(string.format("%.2f", distance(v1, v2)))`,
    constraints: '-10^6 <= x, y, z <= 10^6',
    tests: [
      { input: '0 0 0\n3 4 0', expected: '5.00', visibility: 'public' },
      { input: '1 1 1\n1 1 1', expected: '0.00', visibility: 'public' },
      { input: '0 0 0\n1 1 1', expected: '1.73', visibility: 'hidden' },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    tags: ['searching', 'arrays'],
    statementMd: `Given a sorted array of integers, find the index of a target value using binary search. Return -1 if not found.

**Example:**
\`\`\`
Input: nums = {-1, 0, 3, 5, 9, 12}, target = 9
Output: 5
\`\`\``,
    template: `function binarySearch(nums, target)
    -- Your code here
    
end

local nums = readnumbers()
local target = readnumber()
print(binarySearch(nums, target))`,
    constraints: '1 <= #nums <= 10^4\n-10^4 <= nums[i], target <= 10^4',
    tests: [
      { input: '-1 0 3 5 9 12\n9', expected: '5', visibility: 'public' },
      { input: '-1 0 3 5 9 12\n2', expected: '-1', visibility: 'public' },
    ],
  },
  {
    slug: 'matchmaking-queue',
    title: 'Matchmaking Queue',
    difficulty: 'hard',
    tags: ['matchmaking', 'simulation'],
    statementMd: `Implement a matchmaking system. Players join with a skill rating, and matches are made when:
- There are at least 2 players in queue
- The skill difference between matched players is <= maxDiff
- Players are matched in FIFO order within their skill range

Given player joins and the match requirements, output the matches made.

**Example:**
\`\`\`
maxDiff = 100
Players: [(0, Alice, 1000), (1, Bob, 1050), (2, Charlie, 1200), (3, David, 1180)]

Output:
Match: Alice vs Bob (time 1, diff 50)
Match: Charlie vs David (time 3, diff 20)
\`\`\``,
    template: `function matchmaking(maxDiff, players)
    local queue = {}
    local matches = {}
    -- Your code here
    
    return matches
end

local maxDiff = readnumber()
local numPlayers = readnumber()
local players = {}
for i = 1, numPlayers do
    local parts = string.split(readline(), " ")
    table.insert(players, {
        time = tonumber(parts[1]),
        name = parts[2],
        skill = tonumber(parts[3])
    })
end

local matches = matchmaking(maxDiff, players)
for _, m in ipairs(matches) do
    print("Match: " .. m.p1 .. " vs " .. m.p2)
end`,
    constraints: '1 <= maxDiff <= 10000\n1 <= players <= 1000',
    tests: [
      { input: '100\n4\n0 Alice 1000\n1 Bob 1050\n2 Charlie 1200\n3 David 1180', expected: 'Match: Alice vs Bob\nMatch: Charlie vs David', visibility: 'public' },
    ],
  },
  {
    slug: 'cframe-interpolation',
    title: 'CFrame Interpolation',
    difficulty: 'medium',
    tags: ['cframe', 'math'],
    statementMd: `Given two CFrame positions and an alpha value (0-1), calculate the linearly interpolated position.

**Example:**
\`\`\`
Input: cf1 = CFrame.new(0, 0, 0), cf2 = CFrame.new(10, 10, 10), alpha = 0.5
Output: CFrame.new(5, 5, 5)
\`\`\``,
    template: `function lerpCFrame(cf1, cf2, alpha)
    -- Your code here
    
end

local cf1Parts = readnumbers()
local cf2Parts = readnumbers()
local alpha = tonumber(readline())

local cf1 = CFrame.new(cf1Parts[1], cf1Parts[2], cf1Parts[3])
local cf2 = CFrame.new(cf2Parts[1], cf2Parts[2], cf2Parts[3])

local result = lerpCFrame(cf1, cf2, alpha)
print(string.format("%.1f %.1f %.1f", result.X, result.Y, result.Z))`,
    constraints: '-10^6 <= x, y, z <= 10^6\n0 <= alpha <= 1',
    tests: [
      { input: '0 0 0\n10 10 10\n0.5', expected: '5.0 5.0 5.0', visibility: 'public' },
      { input: '0 0 0\n10 0 0\n0.25', expected: '2.5 0.0 0.0', visibility: 'hidden' },
    ],
  },
  {
    slug: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    difficulty: 'easy',
    tags: ['strings'],
    statementMd: `Find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.

**Example:**
\`\`\`
Input: strs = {"flower", "flow", "flight"}
Output: "fl"
\`\`\``,
    template: `function longestCommonPrefix(strs)
    -- Your code here
    
end

local strs = {}
while true do
    local line = readline()
    if not line or line == "" then break end
    table.insert(strs, line)
end

print(longestCommonPrefix(strs))`,
    constraints: '1 <= #strs <= 200\n0 <= #strs[i] <= 200',
    tests: [
      { input: 'flower\nflow\nflight', expected: 'fl', visibility: 'public' },
      { input: 'dog\nracecar\ncar', expected: '', visibility: 'hidden' },
    ],
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    tags: ['arrays', 'dynamic-programming'],
    statementMd: `Given an integer array, find the contiguous subarray with the largest sum and return its sum.

**Example:**
\`\`\`
Input: nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4}
Output: 6
Explanation: [4, -1, 2, 1] has the largest sum = 6
\`\`\``,
    template: `function maxSubArray(nums)
    -- Your code here
    
end

local nums = readnumbers()
print(maxSubArray(nums))`,
    constraints: '1 <= #nums <= 10^5\n-10^4 <= nums[i] <= 10^4',
    tests: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expected: '6', visibility: 'public' },
      { input: '1', expected: '1', visibility: 'hidden' },
      { input: '5 4 -1 7 8', expected: '23', visibility: 'hidden' },
    ],
  },
  {
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'easy',
    tags: ['math'],
    statementMd: `Determine if an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

**Example:**
\`\`\`
Input: x = 121
Output: true

Input: x = -121
Output: false (reads -121 from right to left, which is 121-)
\`\`\``,
    template: `function isPalindrome(x)
    -- Your code here
    
end

local x = readnumber()
print(isPalindrome(x) and "true" or "false")`,
    constraints: '-2^31 <= x <= 2^31 - 1',
    tests: [
      { input: '121', expected: 'true', visibility: 'public' },
      { input: '-121', expected: 'false', visibility: 'public' },
      { input: '10', expected: 'false', visibility: 'hidden' },
    ],
  },
  {
    slug: 'roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 'easy',
    tags: ['strings', 'math'],
    statementMd: `Convert a Roman numeral to an integer.

**Example:**
\`\`\`
Input: s = "III"
Output: 3

Input: s = "LVIII"
Output: 58
\`\`\``,
    template: `function romanToInt(s)
    -- Your code here
    
end

local s = readline()
print(romanToInt(s))`,
    constraints: '1 <= s.length <= 15',
    tests: [
      { input: 'III', expected: '3', visibility: 'public' },
      { input: 'LVIII', expected: '58', visibility: 'public' },
      { input: 'MCMXCIV', expected: '1994', visibility: 'hidden' },
    ],
  },
  {
    slug: 'best-time-to-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    tags: ['arrays', 'dynamic-programming'],
    statementMd: `You are given an array where prices[i] is the price of a stock on day i. Find the maximum profit you can achieve by buying on one day and selling on a later day.

**Example:**
\`\`\`
Input: prices = {7, 1, 5, 3, 6, 4}
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
\`\`\``,
    template: `function maxProfit(prices)
    -- Your code here
    
end

local prices = readnumbers()
print(maxProfit(prices))`,
    constraints: '1 <= prices.length <= 10^5',
    tests: [
      { input: '7 1 5 3 6 4', expected: '5', visibility: 'public' },
      { input: '7 6 4 3 1', expected: '0', visibility: 'hidden' },
    ],
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    tags: ['strings', 'tables'],
    statementMd: `Given two strings s and t, return true if t is an anagram of s.

**Example:**
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
\`\`\``,
    template: `function isAnagram(s, t)
    -- Your code here
    
end

local s = readline()
local t = readline()
print(isAnagram(s, t) and "true" or "false")`,
    constraints: '1 <= s.length, t.length <= 5 * 10^4',
    tests: [
      { input: 'anagram\nnagaram', expected: 'true', visibility: 'public' },
      { input: 'rat\ncar', expected: 'false', visibility: 'public' },
    ],
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium',
    tags: ['strings', 'tables'],
    statementMd: `Group strings that are anagrams of each other.

**Example:**
\`\`\`
Input: strs = {"eat", "tea", "tan", "ate", "nat", "bat"}
Output: {{"bat"}, {"nat", "tan"}, {"ate", "eat", "tea"}}
\`\`\``,
    template: `function groupAnagrams(strs)
    -- Your code here
    
end

local strs = {}
while true do
    local line = readline()
    if not line or line == "" then break end
    table.insert(strs, line)
end

local result = groupAnagrams(strs)
for _, group in ipairs(result) do
    table.sort(group)
    print(table.concat(group, " "))
end`,
    constraints: '1 <= strs.length <= 10^4',
    tests: [
      { input: 'eat\ntea\ntan\nate\nnat\nbat', expected: 'bat\nate eat tea\nnat tan', visibility: 'public' },
    ],
  },
  {
    slug: 'top-k-frequent',
    title: 'Top K Frequent Elements',
    difficulty: 'medium',
    tags: ['arrays', 'tables'],
    statementMd: `Given an integer array and an integer k, return the k most frequent elements.

**Example:**
\`\`\`
Input: nums = {1, 1, 1, 2, 2, 3}, k = 2
Output: {1, 2}
\`\`\``,
    template: `function topKFrequent(nums, k)
    -- Your code here
    
end

local nums = readnumbers()
local k = readnumber()
local result = topKFrequent(nums, k)
table.sort(result)
print(table.concat(result, " "))`,
    constraints: '1 <= nums.length <= 10^5',
    tests: [
      { input: '1 1 1 2 2 3\n2', expected: '1 2', visibility: 'public' },
      { input: '1\n1', expected: '1', visibility: 'hidden' },
    ],
  },
  {
    slug: 'product-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    tags: ['arrays'],
    statementMd: `Given an integer array, return an array where answer[i] is the product of all elements except nums[i].

**Example:**
\`\`\`
Input: nums = {1, 2, 3, 4}
Output: {24, 12, 8, 6}
\`\`\``,
    template: `function productExceptSelf(nums)
    -- Your code here
    
end

local nums = readnumbers()
local result = productExceptSelf(nums)
print(table.concat(result, " "))`,
    constraints: '2 <= nums.length <= 10^5',
    tests: [
      { input: '1 2 3 4', expected: '24 12 8 6', visibility: 'public' },
      { input: '-1 1 0 -3 3', expected: '0 0 9 0 0', visibility: 'hidden' },
    ],
  },
  {
    slug: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    tags: ['strings', 'tables'],
    statementMd: `Find the length of the longest substring without repeating characters.

**Example:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with length 3.
\`\`\``,
    template: `function lengthOfLongestSubstring(s)
    -- Your code here
    
end

local s = readline()
print(lengthOfLongestSubstring(s))`,
    constraints: '0 <= s.length <= 5 * 10^4',
    tests: [
      { input: 'abcabcbb', expected: '3', visibility: 'public' },
      { input: 'bbbbb', expected: '1', visibility: 'public' },
      { input: 'pwwkew', expected: '3', visibility: 'hidden' },
    ],
  },
  {
    slug: 'three-sum',
    title: 'Three Sum',
    difficulty: 'medium',
    tags: ['arrays', 'sorting'],
    statementMd: `Find all unique triplets that sum to zero.

**Example:**
\`\`\`
Input: nums = {-1, 0, 1, 2, -1, -4}
Output: {{-1, -1, 2}, {-1, 0, 1}}
\`\`\``,
    template: `function threeSum(nums)
    -- Your code here
    
end

local nums = readnumbers()
local result = threeSum(nums)
for _, triplet in ipairs(result) do
    table.sort(triplet)
    print(table.concat(triplet, " "))
end`,
    constraints: '3 <= nums.length <= 3000',
    tests: [
      { input: '-1 0 1 2 -1 -4', expected: '-1 -1 2\n-1 0 1', visibility: 'public' },
      { input: '0 1 1', expected: '', visibility: 'hidden' },
    ],
  },
  {
    slug: 'container-water',
    title: 'Container With Most Water',
    difficulty: 'medium',
    tags: ['arrays', 'two-pointers'],
    statementMd: `Given n vertical lines, find two lines that together with the x-axis form a container that holds the most water.

**Example:**
\`\`\`
Input: height = {1, 8, 6, 2, 5, 4, 8, 3, 7}
Output: 49
\`\`\``,
    template: `function maxArea(height)
    -- Your code here
    
end

local height = readnumbers()
print(maxArea(height))`,
    constraints: 'n == height.length\n2 <= n <= 10^5',
    tests: [
      { input: '1 8 6 2 5 4 8 3 7', expected: '49', visibility: 'public' },
      { input: '1 1', expected: '1', visibility: 'hidden' },
    ],
  },
  {
    slug: 'letter-combinations',
    title: 'Letter Combinations of Phone Number',
    difficulty: 'medium',
    tags: ['strings', 'backtracking'],
    statementMd: `Given a string containing digits from 2-9, return all possible letter combinations.

**Example:**
\`\`\`
Input: digits = "23"
Output: {"ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"}
\`\`\``,
    template: `function letterCombinations(digits)
    -- Your code here
    
end

local digits = readline()
local result = letterCombinations(digits)
table.sort(result)
for _, combo in ipairs(result) do
    print(combo)
end`,
    constraints: '0 <= digits.length <= 4',
    tests: [
      { input: '23', expected: 'ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf', visibility: 'public' },
      { input: '', expected: '', visibility: 'hidden' },
    ],
  },
  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'medium',
    tags: ['strings', 'backtracking', 'core-algorithms'],
    statementMd: `Given n pairs of parentheses, generate all combinations of well-formed parentheses.

**Example:**
\`\`\`
Input: n = 3
Output: {"((()))", "(()())", "(())()", "()(())", "()()()"}
\`\`\`

**Note:** This problem tests core algorithmic thinking (backtracking, recursion, state validation). While not Roblox-specific, these skills are fundamental for game system design.`,
    template: `function generateParenthesis(n)
    -- Your code here
    -- Note: Solutions should avoid excessive string creation due to Luau GC pressure
    
end

local n = readnumber()
local result = generateParenthesis(n)
table.sort(result)
for _, combo in ipairs(result) do
    print(combo)
end`,
    constraints: '1 <= n <= 8\n\n**Performance Note:** Solutions should minimize string allocations. Consider using table.concat() for building strings efficiently.',
    tests: [
      { input: '3', expected: '((()))\n(()())\n(())()\n()(())\n()()()', visibility: 'public' },
      { input: '1', expected: '()', visibility: 'hidden' },
    ],
  },
  {
    slug: 'generate-valid-animation-states',
    title: 'Generate Valid Animation States',
    difficulty: 'medium',
    tags: ['roblox', 'animations', 'backtracking', 'state-machines'],
    statementMd: `You're building an animation system for a Roblox game. Given n animation layers, generate all valid open/close state sequences such that:
- No layer closes before it opens
- Each layer must open before it can close
- All layers must be closed by the end

This is similar to generating valid parentheses, but framed for Roblox animation state management.

**Example:**
\`\`\`
Input: n = 3 layers
Output: 
Layer1: open, Layer2: open, Layer3: open, Layer3: close, Layer2: close, Layer1: close
Layer1: open, Layer2: open, Layer2: close, Layer3: open, Layer3: close, Layer1: close
... (all valid sequences)
\`\`\`

**Roblox Context:** In Roblox, animation layers often need to be managed in a specific order to prevent visual glitches. This problem tests your ability to reason about state constraints in game systems.`,
    template: `function generateAnimationStates(n)
    -- Generate all valid open/close sequences for n animation layers
    -- Return as table of sequences, where each sequence is a table of "open" or "close" actions
    -- Format: {{"open", "open", "open", "close", "close", "close"}, ...}
    -- Your code here
    
end

local n = readnumber()
local result = generateAnimationStates(n)
for _, sequence in ipairs(result) do
    print(table.concat(sequence, " "))
end`,
    constraints: '1 <= n <= 8\n\n**Roblox Performance:** Solutions must avoid deep recursion that could cause frame drops. Consider iterative approaches for production code.',
    tests: [
      { input: '2', expected: 'open open close close\nopen close open close', visibility: 'public' },
      { input: '1', expected: 'open close', visibility: 'hidden' },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    tags: ['arrays', 'sorting'],
    statementMd: `Merge all overlapping intervals.

**Example:**
\`\`\`
Input: intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}}
Output: {{1, 6}, {8, 10}, {15, 18}}
\`\`\``,
    template: `function merge(intervals)
    -- Your code here
    
end

local n = readnumber()
local intervals = {}
for i = 1, n do
    local parts = readnumbers()
    table.insert(intervals, {parts[1], parts[2]})
end

local result = merge(intervals)
for _, interval in ipairs(result) do
    print(interval[1] .. " " .. interval[2])
end`,
    constraints: '1 <= intervals.length <= 10^4',
    tests: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18', visibility: 'public' },
      { input: '2\n1 4\n4 5', expected: '1 5', visibility: 'hidden' },
    ],
  },
  {
    slug: 'jump-game',
    title: 'Jump Game',
    difficulty: 'medium',
    tags: ['arrays', 'greedy'],
    statementMd: `Determine if you can reach the last index. Each element represents max jump length.

**Example:**
\`\`\`
Input: nums = {2, 3, 1, 1, 4}
Output: true
\`\`\``,
    template: `function canJump(nums)
    -- Your code here
    
end

local nums = readnumbers()
print(canJump(nums) and "true" or "false")`,
    constraints: '1 <= nums.length <= 10^4',
    tests: [
      { input: '2 3 1 1 4', expected: 'true', visibility: 'public' },
      { input: '3 2 1 0 4', expected: 'false', visibility: 'hidden' },
    ],
  },
  {
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'medium',
    tags: ['arrays', 'simulation'],
    statementMd: `Return all elements in spiral order.

**Example:**
\`\`\`
Input: matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
Output: {1, 2, 3, 6, 9, 8, 7, 4, 5}
\`\`\``,
    template: `function spiralOrder(matrix)
    -- Your code here
    
end

local rows = readnumber()
local matrix = {}
for i = 1, rows do
    matrix[i] = readnumbers()
end

local result = spiralOrder(matrix)
print(table.concat(result, " "))`,
    constraints: 'm == matrix.length\nn == matrix[i].length',
    tests: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expected: '1 2 3 6 9 8 7 4 5', visibility: 'public' },
    ],
  },
  {
    slug: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    difficulty: 'medium',
    tags: ['arrays'],
    statementMd: `If an element is 0, set its entire row and column to 0.

**Example:**
\`\`\`
Input: matrix = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}}
Output: {{1, 0, 1}, {0, 0, 0}, {1, 0, 1}}
\`\`\``,
    template: `function setZeroes(matrix)
    -- Your code here
    
end

local rows = readnumber()
local matrix = {}
for i = 1, rows do
    matrix[i] = readnumbers()
end

setZeroes(matrix)
for _, row in ipairs(matrix) do
    print(table.concat(row, " "))
end`,
    constraints: 'm == matrix.length\nn == matrix[0].length',
    tests: [
      { input: '3\n1 1 1\n1 0 1\n1 1 1', expected: '1 0 1\n0 0 0\n1 0 1', visibility: 'public' },
    ],
  },
  {
    slug: 'rotate-image',
    title: 'Rotate Image',
    difficulty: 'medium',
    tags: ['arrays'],
    statementMd: `Rotate the image 90 degrees clockwise (in-place).

**Example:**
\`\`\`
Input: matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
Output: {{7, 4, 1}, {8, 5, 2}, {9, 6, 3}}
\`\`\``,
    template: `function rotate(matrix)
    -- Your code here
    
end

local n = readnumber()
local matrix = {}
for i = 1, n do
    matrix[i] = readnumbers()
end

rotate(matrix)
for _, row in ipairs(matrix) do
    print(table.concat(row, " "))
end`,
    constraints: 'n == matrix.length == matrix[i].length',
    tests: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expected: '7 4 1\n8 5 2\n9 6 3', visibility: 'public' },
    ],
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'medium',
    tags: ['arrays', 'backtracking'],
    statementMd: `Given a 2D board and a word, find if the word exists in the grid.

**Example:**
\`\`\`
Input: board = {{"A","B","C","E"}, {"S","F","C","S"}, {"A","D","E","E"}}, word = "ABCCED"
Output: true
\`\`\``,
    template: `function exist(board, word)
    -- Your code here
    
end

local rows = readnumber()
local board = {}
for i = 1, rows do
    local line = readline()
    board[i] = {}
    for j = 1, #line do
        board[i][j] = line:sub(j, j)
    end
end
local word = readline()

print(exist(board, word) and "true" or "false")`,
    constraints: 'm == board.length\nn == board[i].length',
    tests: [
      { input: '3\nABCE\nSFCS\nADEE\nABCCED', expected: 'true', visibility: 'public' },
    ],
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    tags: ['arrays', 'dynamic-programming'],
    statementMd: `Find the length of the longest strictly increasing subsequence.

**Example:**
\`\`\`
Input: nums = {10, 9, 2, 5, 3, 7, 101, 18}
Output: 4
Explanation: {2, 3, 7, 18}
\`\`\``,
    template: `function lengthOfLIS(nums)
    -- Your code here
    
end

local nums = readnumbers()
print(lengthOfLIS(nums))`,
    constraints: '1 <= nums.length <= 2500',
    tests: [
      { input: '10 9 2 5 3 7 101 18', expected: '4', visibility: 'public' },
      { input: '0 1 0 3 2 3', expected: '4', visibility: 'hidden' },
    ],
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `Find the longest palindromic substring.

**Example:**
\`\`\`
Input: s = "babad"
Output: "bab" or "aba"

Input: s = "cbbd"
Output: "bb"
\`\`\``,
    template: `function longestPalindrome(s)
    -- Your code here
    
end

local s = readline()
print(longestPalindrome(s))`,
    constraints: '1 <= s.length <= 1000',
    tests: [
      { input: 'babad', expected: 'bab', visibility: 'public' },
      { input: 'cbbd', expected: 'bb', visibility: 'public' },
    ],
  },
  {
    slug: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'medium',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `A message containing letters can be encoded into numbers. Find total ways to decode.

**Example:**
\`\`\`
Input: s = "12"
Output: 2
Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).
\`\`\``,
    template: `function numDecodings(s)
    -- Your code here
    
end

local s = readline()
print(numDecodings(s))`,
    constraints: '1 <= s.length <= 100',
    tests: [
      { input: '12', expected: '2', visibility: 'public' },
      { input: '226', expected: '3', visibility: 'hidden' },
    ],
  },
  {
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'medium',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `Determine if s can be segmented into space-separated words from wordDict.

**Example:**
\`\`\`
Input: s = "leetcode", wordDict = {"leet", "code"}
Output: true
\`\`\``,
    template: `function wordBreak(s, wordDict)
    -- Your code here
    
end

local s = readline()
local n = readnumber()
local wordDict = {}
for i = 1, n do
    wordDict[i] = readline()
end

print(wordBreak(s, wordDict) and "true" or "false")`,
    constraints: '1 <= s.length <= 300',
    tests: [
      { input: 'leetcode\n2\nleet\ncode', expected: 'true', visibility: 'public' },
      { input: 'applepenapple\n2\napple\npen', expected: 'true', visibility: 'hidden' },
    ],
  },
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'medium',
    tags: ['arrays', 'backtracking'],
    statementMd: `Find all unique combinations where numbers sum to target.

**Example:**
\`\`\`
Input: candidates = {2, 3, 6, 7}, target = 7
Output: {{2, 2, 3}, {7}}
\`\`\``,
    template: `function combinationSum(candidates, target)
    -- Your code here
    
end

local candidates = readnumbers()
local target = readnumber()
local result = combinationSum(candidates, target)
for _, combo in ipairs(result) do
    table.sort(combo)
    print(table.concat(combo, " "))
end`,
    constraints: '1 <= candidates.length <= 30',
    tests: [
      { input: '2 3 6 7\n7', expected: '2 2 3\n7', visibility: 'public' },
    ],
  },
  {
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'medium',
    tags: ['arrays', 'backtracking'],
    statementMd: `Return all permutations of an array.

**Example:**
\`\`\`
Input: nums = {1, 2, 3}
Output: {{1, 2, 3}, {1, 3, 2}, {2, 1, 3}, {2, 3, 1}, {3, 1, 2}, {3, 2, 1}}
\`\`\``,
    template: `function permute(nums)
    -- Your code here
    
end

local nums = readnumbers()
local result = permute(nums)
for _, perm in ipairs(result) do
    print(table.concat(perm, " "))
end`,
    constraints: '1 <= nums.length <= 6',
    tests: [
      { input: '1 2 3', expected: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', visibility: 'public' },
    ],
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'medium',
    tags: ['arrays', 'backtracking'],
    statementMd: `Return all possible subsets (power set).

**Example:**
\`\`\`
Input: nums = {1, 2, 3}
Output: {{}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}}
\`\`\``,
    template: `function subsets(nums)
    -- Your code here
    
end

local nums = readnumbers()
local result = subsets(nums)
for _, subset in ipairs(result) do
    table.sort(subset)
    print(table.concat(subset, " "))
end`,
    constraints: '1 <= nums.length <= 10',
    tests: [
      { input: '1 2 3', expected: '\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', visibility: 'public' },
    ],
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'medium',
    tags: ['arrays', 'graphs'],
    statementMd: `Count the number of islands (1s) in a 2D grid.

**Example:**
\`\`\`
Input: grid = {{"1","1","1","1","0"}, {"1","1","0","1","0"}, {"1","1","0","0","0"}, {"0","0","0","0","0"}}
Output: 1
\`\`\``,
    template: `function numIslands(grid)
    -- Your code here
    
end

local rows = readnumber()
local grid = {}
for i = 1, rows do
    local line = readline()
    grid[i] = {}
    for j = 1, #line do
        grid[i][j] = line:sub(j, j)
    end
end

print(numIslands(grid))`,
    constraints: 'm == grid.length\nn == grid[i].length',
    tests: [
      { input: '4\n11110\n11010\n11000\n00000', expected: '1', visibility: 'public' },
      { input: '3\n11000\n11000\n00100', expected: '3', visibility: 'hidden' },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'medium',
    tags: ['graphs'],
    statementMd: `Determine if you can finish all courses given prerequisites.

**Example:**
\`\`\`
Input: numCourses = 2, prerequisites = {{1, 0}}
Output: true
\`\`\``,
    template: `function canFinish(numCourses, prerequisites)
    -- Your code here
    
end

local numCourses = readnumber()
local n = readnumber()
local prerequisites = {}
for i = 1, n do
    local parts = readnumbers()
    table.insert(prerequisites, {parts[1], parts[2]})
end

print(canFinish(numCourses, prerequisites) and "true" or "false")`,
    constraints: '1 <= numCourses <= 2000',
    tests: [
      { input: '2\n1\n1 0', expected: 'true', visibility: 'public' },
      { input: '2\n2\n1 0\n0 1', expected: 'false', visibility: 'hidden' },
    ],
  },
  {
    slug: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'medium',
    tags: ['trees', 'strings'],
    statementMd: `Implement a Trie with insert, search, and startsWith methods.

**Example:**
\`\`\`
trie.insert("apple")
trie.search("apple") -> true
trie.search("app") -> false
trie.startsWith("app") -> true
\`\`\``,
    template: `function createTrie()
    local trie = {}
    -- Your code here
    
    return trie
end

local trie = createTrie()
local results = {}
while true do
    local line = readline()
    if not line then break end
    local parts = {}
    for token in line:gmatch("%S+") do
        parts[#parts + 1] = token
    end
    local op = parts[1]
    local word = parts[2]
    if op == "insert" then
        trie:insert(word)
    elseif op == "search" then
        table.insert(results, trie:search(word) and "true" or "false")
    elseif op == "startsWith" then
        table.insert(results, trie:startsWith(word) and "true" or "false")
    end
end
for _, r in ipairs(results) do
    print(r)
end`,
    constraints: '1 <= word.length <= 2000',
    tests: [
      { input: 'insert apple\ninsert app\nsearch apple\nsearch app\nsearch ap\nstartsWith ap', expected: 'true\ntrue\nfalse\ntrue', visibility: 'public' },
    ],
  },
  {
    slug: 'coin-change-2',
    title: 'Coin Change 2',
    difficulty: 'medium',
    tags: ['dynamic-programming'],
    statementMd: `Count the number of combinations that make up amount.

**Example:**
\`\`\`
Input: amount = 5, coins = {1, 2, 5}
Output: 4
\`\`\``,
    template: `function change(amount, coins)
    -- Your code here
    
end

local amount = readnumber()
local coins = readnumbers()
print(change(amount, coins))`,
    constraints: '1 <= amount <= 5000',
    tests: [
      { input: '5\n1 2 5', expected: '4', visibility: 'public' },
      { input: '3\n2', expected: '0', visibility: 'hidden' },
    ],
  },
  {
    slug: 'target-sum',
    title: 'Target Sum',
    difficulty: 'medium',
    tags: ['arrays', 'dynamic-programming'],
    statementMd: `Find number of ways to assign + or - to get target sum.

**Example:**
\`\`\`
Input: nums = {1, 1, 1, 1, 1}, target = 3
Output: 5
\`\`\``,
    template: `function findTargetSumWays(nums, target)
    -- Your code here
    
end

local nums = readnumbers()
local target = readnumber()
print(findTargetSumWays(nums, target))`,
    constraints: '1 <= nums.length <= 20',
    tests: [
      { input: '1 1 1 1 1\n3', expected: '5', visibility: 'public' },
    ],
  },
  {
    slug: 'interleaving-string',
    title: 'Interleaving String',
    difficulty: 'medium',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `Determine if s3 is formed by interleaving s1 and s2.

**Example:**
\`\`\`
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
\`\`\``,
    template: `function isInterleave(s1, s2, s3)
    -- Your code here
    
end

local s1 = readline()
local s2 = readline()
local s3 = readline()
print(isInterleave(s1, s2, s3) and "true" or "false")`,
    constraints: '0 <= s1.length, s2.length <= 100',
    tests: [
      { input: 'aabcc\ndbbca\naadbbcbcac', expected: 'true', visibility: 'public' },
    ],
  },
  {
    slug: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'hard',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `Find minimum operations to convert word1 to word2 (insert, delete, replace).

**Example:**
\`\`\`
Input: word1 = "horse", word2 = "ros"
Output: 3
\`\`\``,
    template: `function minDistance(word1, word2)
    -- Your code here
    
end

local word1 = readline()
local word2 = readline()
print(minDistance(word1, word2))`,
    constraints: '0 <= word1.length, word2.length <= 500',
    tests: [
      { input: 'horse\nros', expected: '3', visibility: 'public' },
      { input: 'intention\nexecution', expected: '5', visibility: 'hidden' },
    ],
  },
  {
    slug: 'maximal-square',
    title: 'Maximal Square',
    difficulty: 'medium',
    tags: ['arrays', 'dynamic-programming'],
    statementMd: `Find the largest square containing only 1s.

**Example:**
\`\`\`
Input: matrix = {{"1","0","1","0","0"}, {"1","0","1","1","1"}, {"1","1","1","1","1"}, {"1","0","0","1","0"}}
Output: 4
\`\`\``,
    template: `function maximalSquare(matrix)
    -- Your code here
    
end

local rows = readnumber()
local matrix = {}
for i = 1, rows do
    local line = readline()
    matrix[i] = {}
    for j = 1, #line do
        matrix[i][j] = line:sub(j, j)
    end
end

print(maximalSquare(matrix))`,
    constraints: 'm == matrix.length\nn == matrix[i].length',
    tests: [
      { input: '4\n10100\n10111\n11111\n10010', expected: '4', visibility: 'public' },
    ],
  },
  {
    slug: 'perfect-squares',
    title: 'Perfect Squares',
    difficulty: 'medium',
    tags: ['math', 'dynamic-programming'],
    statementMd: `Find the least number of perfect square numbers that sum to n.

**Example:**
\`\`\`
Input: n = 12
Output: 3
Explanation: 12 = 4 + 4 + 4
\`\`\``,
    template: `function numSquares(n)
    -- Your code here
    
end

local n = readnumber()
print(numSquares(n))`,
    constraints: '1 <= n <= 10^4',
    tests: [
      { input: '12', expected: '3', visibility: 'public' },
      { input: '13', expected: '2', visibility: 'hidden' },
    ],
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'hard',
    tags: ['strings', 'graphs'],
    statementMd: `Find shortest transformation sequence from beginWord to endWord.

**Example:**
\`\`\`
Input: beginWord = "hit", endWord = "cog", wordList = {"hot","dot","dog","lot","log","cog"}
Output: 5
\`\`\``,
    template: `function ladderLength(beginWord, endWord, wordList)
    -- Your code here
    
end

local beginWord = readline()
local endWord = readline()
local n = readnumber()
local wordList = {}
for i = 1, n do
    wordList[i] = readline()
end

print(ladderLength(beginWord, endWord, wordList))`,
    constraints: '1 <= beginWord.length <= 10',
    tests: [
      { input: 'hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog', expected: '5', visibility: 'public' },
    ],
  },
  {
    slug: 'surrounded-regions',
    title: 'Surrounded Regions',
    difficulty: 'medium',
    tags: ['arrays', 'graphs'],
    statementMd: `Capture all regions surrounded by 'X'. Replace 'O' with 'X'.

**Example:**
\`\`\`
Input: board = {{"X","X","X","X"}, {"X","O","O","X"}, {"X","X","O","X"}, {"X","O","X","X"}}
Output: {{"X","X","X","X"}, {"X","X","X","X"}, {"X","X","X","X"}, {"X","O","X","X"}}
\`\`\``,
    template: `function solve(board)
    -- Your code here
    
end

local rows = readnumber()
local board = {}
for i = 1, rows do
    local line = readline()
    board[i] = {}
    for j = 1, #line do
        board[i][j] = line:sub(j, j)
    end
end

solve(board)
for _, row in ipairs(board) do
    print(table.concat(row, ""))
end`,
    constraints: 'm == board.length\nn == board[i].length',
    tests: [
      { input: '4\nXXXX\nXOOX\nXXOX\nXOXX', expected: 'XXXX\nXXXX\nXXXX\nXOXX', visibility: 'public' },
    ],
  },
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'medium',
    tags: ['graphs'],
    statementMd: `Return a deep copy of the graph.

**Example:**
\`\`\`
Input: adjList = {{2, 4}, {1, 3}, {2, 4}, {1, 3}}
Output: Deep copy of the graph
\`\`\``,
    template: `function cloneGraph(node)
    -- Your code here
    
end

local n = readnumber()
local adjList = {}
for i = 1, n do
    adjList[i] = readnumbers()
end

local result = cloneGraph(adjList)
for i = 1, n do
    table.sort(result[i])
    print(table.concat(result[i], " "))
end`,
    constraints: '0 <= node.val <= 100',
    tests: [
      { input: '4\n2 4\n1 3\n2 4\n1 3', expected: '2 4\n1 3\n2 4\n1 3', visibility: 'public' },
    ],
  },
  {
    slug: 'course-schedule-2',
    title: 'Course Schedule II',
    difficulty: 'medium',
    tags: ['graphs'],
    statementMd: `Find the ordering of courses you should take to finish all courses.

**Example:**
\`\`\`
Input: numCourses = 4, prerequisites = {{1, 0}, {2, 0}, {3, 1}, {3, 2}}
Output: {0, 1, 2, 3} or {0, 2, 1, 3}
\`\`\``,
    template: `function findOrder(numCourses, prerequisites)
    -- Your code here
    
end

local numCourses = readnumber()
local n = readnumber()
local prerequisites = {}
for i = 1, n do
    local parts = readnumbers()
    table.insert(prerequisites, {parts[1], parts[2]})
end

local result = findOrder(numCourses, prerequisites)
if #result == 0 then
    print("")
else
    print(table.concat(result, " "))
end`,
    constraints: '1 <= numCourses <= 2000',
    tests: [
      { input: '4\n4\n1 0\n2 0\n3 1\n3 2', expected: '0 1 2 3', visibility: 'public' },
    ],
  },
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'hard',
    tags: ['strings', 'sliding-window'],
    statementMd: `Find the minimum window substring of s that contains all characters of t.

**Example:**
\`\`\`
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
\`\`\``,
    template: `function minWindow(s, t)
    -- Your code here
    
end

local s = readline()
local t = readline()
print(minWindow(s, t))`,
    constraints: 'm == s.length\nn == t.length',
    tests: [
      { input: 'ADOBECODEBANC\nABC', expected: 'BANC', visibility: 'public' },
      { input: 'a\na', expected: 'a', visibility: 'hidden' },
    ],
  },
  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'hard',
    tags: ['arrays', 'sliding-window'],
    statementMd: `Find the maximum element in each sliding window of size k.

**Example:**
\`\`\`
Input: nums = {1, 3, -1, -3, 5, 3, 6, 7}, k = 3
Output: {3, 3, 5, 5, 6, 7}
\`\`\``,
    template: `function maxSlidingWindow(nums, k)
    -- Your code here
    
end

local nums = readnumbers()
local k = readnumber()
local result = maxSlidingWindow(nums, k)
print(table.concat(result, " "))`,
    constraints: '1 <= nums.length <= 10^5',
    tests: [
      { input: '1 3 -1 -3 5 3 6 7\n3', expected: '3 3 5 5 6 7', visibility: 'public' },
    ],
  },
  {
    slug: 'median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    tags: ['arrays', 'binary-search'],
    statementMd: `Find the median of two sorted arrays.

**Example:**
\`\`\`
Input: nums1 = {1, 3}, nums2 = {2}
Output: 2.0
\`\`\``,
    template: `function findMedianSortedArrays(nums1, nums2)
    -- Your code here
    
end

local nums1 = readnumbers()
local nums2 = readnumbers()
local result = findMedianSortedArrays(nums1, nums2)
print(string.format("%.1f", result))`,
    constraints: 'nums1.length == m\nnums2.length == n',
    tests: [
      { input: '1 3\n2', expected: '2.0', visibility: 'public' },
      { input: '1 2\n3 4', expected: '2.5', visibility: 'hidden' },
    ],
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: 'hard',
    tags: ['strings', 'dynamic-programming'],
    statementMd: `Match string s against pattern p where '.' matches any char and '*' matches zero or more of preceding.

**Example:**
\`\`\`
Input: s = "aa", p = "a*"
Output: true
\`\`\``,
    template: `function isMatch(s, p)
    -- Your code here
    
end

local s = readline()
local p = readline()
print(isMatch(s, p) and "true" or "false")`,
    constraints: '1 <= s.length <= 20\n1 <= p.length <= 30',
    tests: [
      { input: 'aa\na*', expected: 'true', visibility: 'public' },
      { input: 'ab\n.*', expected: 'true', visibility: 'hidden' },
    ],
  },
  {
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'hard',
    tags: ['arrays', 'sorting'],
    statementMd: `Merge k sorted arrays into one sorted array.

**Example:**
\`\`\`
Input: lists = {{1, 4, 5}, {1, 3, 4}, {2, 6}}
Output: {1, 1, 2, 3, 4, 4, 5, 6}
\`\`\``,
    template: `function mergeKLists(lists)
    -- Your code here
    
end

local k = readnumber()
local lists = {}
for i = 1, k do
    lists[i] = readnumbers()
end

local result = mergeKLists(lists)
print(table.concat(result, " "))`,
    constraints: 'k == lists.length',
    tests: [
      { input: '3\n1 4 5\n1 3 4\n2 6', expected: '1 1 2 3 4 4 5 6', visibility: 'public' },
    ],
  },
  {
    slug: 'reverse-nodes-k-group',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'hard',
    tags: ['arrays', 'simulation'],
    statementMd: `Reverse nodes of array in groups of k.

**Example:**
\`\`\`
Input: nums = {1, 2, 3, 4, 5}, k = 2
Output: {2, 1, 4, 3, 5}
\`\`\``,
    template: `function reverseKGroup(nums, k)
    -- Your code here
    
end

local nums = readnumbers()
local k = readnumber()
local result = reverseKGroup(nums, k)
print(table.concat(result, " "))`,
    constraints: '1 <= nums.length <= 5000',
    tests: [
      { input: '1 2 3 4 5\n2', expected: '2 1 4 3 5', visibility: 'public' },
      { input: '1 2 3 4 5\n3', expected: '3 2 1 4 5', visibility: 'hidden' },
    ],
  },
  {
    slug: 'serialize-deserialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'hard',
    tags: ['trees'],
    statementMd: `Design an algorithm to serialize and deserialize a binary tree.

**Example:**
\`\`\`
Input: root = {1, 2, 3, nil, nil, 4, 5}
Output: Serialized string that can reconstruct the tree
\`\`\``,
    template: `function serialize(root)
    -- Your code here
    
end

function deserialize(data)
    -- Your code here
    
end

local n = readnumber()
local tree = {}
for i = 1, n do
    local val = readline()
    tree[i] = val == "nil" and nil or tonumber(val)
end

local data = serialize(tree)
local result = deserialize(data)
print(table.concat(result, " "))`,
    constraints: 'The number of nodes <= 10^4',
    tests: [
      { input: '7\n1\n2\n3\nnil\nnil\n4\n5', expected: '1 2 3 nil nil 4 5', visibility: 'public' },
    ],
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    difficulty: 'hard',
    tags: ['backtracking'],
    statementMd: `Place n queens on an n×n chessboard such that no two queens attack each other.

**Example:**
\`\`\`
Input: n = 4
Output: {{".Q..", "...Q", "Q...", "..Q."}, {"..Q.", "Q...", "...Q", ".Q.."}}
\`\`\``,
    template: `function solveNQueens(n)
    -- Your code here
    
end

local n = readnumber()
local result = solveNQueens(n)
for _, solution in ipairs(result) do
    print(table.concat(solution, "\\n"))
    print("---")
end`,
    constraints: '1 <= n <= 9',
    tests: [
      { input: '4', expected: '.Q..\n...Q\nQ...\n..Q.\n---\n..Q.\nQ...\n...Q\n.Q..', visibility: 'public' },
    ],
  },
  {
    slug: 'event-throttle',
    title: 'Event Throttle System',
    difficulty: 'medium',
    tags: ['roblox', 'events', 'performance', 'throttling'],
    statementMd: `Implement an event throttling system for Roblox. Given a list of events with timestamps, throttle events so that:
- At most one event fires per time window
- If multiple events occur in the same window, only the last one fires
- Return the timestamps when events actually fire

**Roblox Context:** In Roblox, events like RemoteEvents or GUI clicks can fire rapidly. Throttling prevents network spam and improves performance. This is critical for production games.

**Example:**
\`\`\`
Input: events = {0, 50, 100, 150, 200}, window = 100
Output: {0, 100, 200}
Explanation: 
- Events at 0, 50 are in window [0, 100), only 50 fires (last in window)
- Events at 100, 150 are in window [100, 200), only 150 fires
- Event at 200 starts new window, fires immediately
\`\`\``,
    template: `function throttleEvents(events, window)
    -- Your code here
    -- Return table of timestamps when events actually fire
    
end

local events = readnumbers()
local window = readnumber()
local result = throttleEvents(events, window)
print(table.concat(result, " "))`,
    constraints: '1 <= #events <= 10^4\n0 <= events[i] <= 10^9\n1 <= window <= 10^6\n\n**Roblox Performance:** Solution must be O(n) time. Avoid nested loops that could cause frame drops during high-frequency events.',
    tests: [
      { input: '0 50 100 150 200\n100', expected: '0 100 200', visibility: 'public' },
      { input: '0 10 20 30 40\n15', expected: '0 15 30', visibility: 'hidden' },
    ],
  },
  {
    slug: 'replication-batch',
    title: 'Replication Batch Optimizer',
    difficulty: 'hard',
    tags: ['roblox', 'replication', 'networking', 'optimization'],
    statementMd: `Optimize RemoteEvent replication in Roblox. Given a list of property updates with timestamps, batch updates to minimize network calls while ensuring updates are sent within a deadline.

Rules:
- Updates can be batched if they occur within a batching window
- All updates in a batch are sent together
- Each batch must be sent before its deadline expires
- Minimize total number of batches

**Roblox Context:** In Roblox, sending too many RemoteEvents causes network lag. Batching updates reduces network overhead and improves game performance, especially important for mobile players.

**Example:**
\`\`\`
Input: updates = {{time=0, data="pos1"}, {time=50, data="pos2"}, {time=150, data="pos3"}}, window=100, deadline=200
Output: 2 batches
Batch 1: [0, 50] -> sent at time 100
Batch 2: [150] -> sent at time 200
\`\`\``,
    template: `function optimizeBatches(updates, window, deadline)
    -- updates is table of {time, data}
    -- Return minimum number of batches needed
    
end

local n = readnumber()
local updates = {}
for i = 1, n do
    local parts = string.split(readline(), " ")
    table.insert(updates, {time = tonumber(parts[1]), data = parts[2]})
end
local window = readnumber()
local deadline = readnumber()

print(optimizeBatches(updates, window, deadline))`,
    constraints: '1 <= #updates <= 1000\n0 <= time <= 10^6\n1 <= window <= 1000\n1 <= deadline <= 10^6\n\n**Roblox Performance:** Critical for mobile performance. Solution should minimize batches while respecting deadlines.',
    tests: [
      { input: '3\n0 pos1\n50 pos2\n150 pos3\n100\n200', expected: '2', visibility: 'public' },
    ],
  },
  {
    slug: 'yield-safe-loop',
    title: 'Yield-Safe Loop Processor',
    difficulty: 'medium',
    tags: ['roblox', 'yielding', 'performance', 'loops'],
    statementMd: `Process a large array in chunks with yielding to prevent script timeout. Given an array and chunk size, process elements in batches, yielding between batches.

**Roblox Context:** Roblox scripts have execution time limits. Long loops can cause "Script timeout" errors. Yielding allows other scripts to run and prevents timeouts. This is essential for processing large datasets in games.

**Example:**
\`\`\`
Input: items = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, chunkSize = 3
Process: 
- Process items 1-3, yield
- Process items 4-6, yield  
- Process items 7-9, yield
- Process items 10, done
\`\`\``,
    template: `function processWithYielding(items, chunkSize, processFn)
    -- processFn(item) processes a single item
    -- Yield after each chunk to prevent timeout
    -- Return total processed count
    
    local processed = 0
    -- Your code here
    
    return processed
end

local items = readnumbers()
local chunkSize = readnumber()

-- Simulate processing (in real Roblox, you'd use task.wait())
local function processItem(item)
    return item * 2  -- Example processing
end

local result = processWithYielding(items, chunkSize, processItem)
print(result)`,
    constraints: '1 <= #items <= 10^5\n1 <= chunkSize <= 1000\n\n**Roblox Performance:** Must yield between chunks. Solutions that don\'t yield will timeout on large inputs. This is a critical skill for production Roblox code.',
    tests: [
      { input: '1 2 3 4 5 6 7 8 9 10\n3', expected: '10', visibility: 'public' },
      { input: '1 2 3 4 5\n2', expected: '5', visibility: 'hidden' },
    ],
  },
  {
    slug: 'instance-tree-search',
    title: 'Instance Tree Search',
    difficulty: 'medium',
    tags: ['roblox', 'instances', 'trees', 'search'],
    statementMd: `Search through a Roblox Instance tree to find all descendants matching a criteria. Given a root instance and a search function, return all matching instances.

**Roblox Context:** In Roblox, Instance hierarchies can be deep. Efficiently searching through them is crucial for game systems like inventory UIs, character customization, or dynamic content loading.

**Example:**
\`\`\`
Input: Root instance with children:
  - Folder "Items"
    - StringValue "Sword" (Name contains "Sword")
    - StringValue "Shield"
  - Folder "Weapons"  
    - StringValue "Sword" (Name contains "Sword")

Search: Name contains "Sword"
Output: 2 instances found
\`\`\``,
    template: `function findInstances(root, searchFn)
    -- searchFn(instance) returns true if instance matches
    -- Return table of all matching instances
    
end

-- Simulate instance structure
local function createInstance(name, children)
    return {Name = name, Children = children or {}}
end

local root = createInstance("Root", {
    createInstance("Items", {
        createInstance("Sword"),
        createInstance("Shield"),
    }),
    createInstance("Weapons", {
        createInstance("Sword"),
    }),
})

local function searchFn(instance)
    return string.find(instance.Name, "Sword") ~= nil
end

local result = findInstances(root, searchFn)
print(#result)`,
    constraints: '1 <= tree depth <= 20\n1 <= total instances <= 1000\n\n**Roblox Performance:** Avoid recursive solutions that could stack overflow on deep trees. Use iterative approaches for production code.',
    tests: [
      { input: '', expected: '2', visibility: 'public' },
    ],
  },
  {
    slug: 'gui-layout-calculator',
    title: 'GUI Layout Calculator',
    difficulty: 'medium',
    tags: ['roblox', 'ui', 'gui', 'layout'],
    statementMd: `Calculate positions for GUI elements in a responsive layout. Given screen size, element sizes, and layout rules (grid, list, etc.), calculate final positions.

**Roblox Context:** Roblox GUI layouts must adapt to different screen sizes. This problem tests your ability to calculate positions programmatically, essential for dynamic UIs.

**Example:**
\`\`\`
Input: screenWidth = 1920, screenHeight = 1080
Elements: {{width=200, height=100}, {width=200, height=100}, {width=200, height=100}}
Layout: 3 columns, center-aligned
Output: Positions for each element
\`\`\``,
    template: `function calculateLayout(screenWidth, screenHeight, elements, columns)
    -- elements is table of {width, height}
    -- Return table of {x, y} positions for each element
    
end

local screenWidth = readnumber()
local screenHeight = readnumber()
local numElements = readnumber()
local elements = {}
for i = 1, numElements do
    local parts = readnumbers()
    table.insert(elements, {width = parts[1], height = parts[2]})
end
local columns = readnumber()

local result = calculateLayout(screenWidth, screenHeight, elements, columns)
for _, pos in ipairs(result) do
    print(pos.x .. " " .. pos.y)
end`,
    constraints: '1 <= screenWidth, screenHeight <= 10000\n1 <= #elements <= 100\n1 <= columns <= 10\n\n**Roblox Performance:** Layout calculations should be O(n). Avoid recalculating positions unnecessarily.',
    tests: [
      { input: '1920\n1080\n3\n200 100\n200 100\n200 100\n3', expected: '660 0\n860 0\n1060 0', visibility: 'public' },
    ],
  },
  {
    slug: 'sudoku-solver',
    title: 'Sudoku Solver',
    difficulty: 'hard',
    tags: ['arrays', 'backtracking'],
    statementMd: `Solve a 9×9 Sudoku puzzle.

**Example:**
\`\`\`
Input: board with some cells filled
Output: Solved board
\`\`\``,
    template: `function solveSudoku(board)
    -- Your code here
    
end

local board = {}
for i = 1, 9 do
    local line = readline()
    board[i] = {}
    for j = 1, 9 do
        board[i][j] = line:sub(j, j)
    end
end

solveSudoku(board)
for _, row in ipairs(board) do
    print(table.concat(row, ""))
end`,
    constraints: 'board.length == 9\nboard[i].length == 9',
    tests: [
      { input: '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79', expected: '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179', visibility: 'public' },
    ],
  },
  // TRACK 1: CORE LUAU & SYSTEMS (24 new problems)
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
    -- Your code here
    -- Return array of booleans
    
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
]

const tracks = [
  { slug: 'roblox-core', name: 'Roblox Fundamentals', description: 'Roblox-specific problems: events, replication, instances, yielding, and game systems' },
  { slug: 'gameplay', name: 'Gameplay Systems', description: 'Master game mechanics, cooldowns, state machines, and player interactions' },
  { slug: 'ui', name: 'UI & GUI Development', description: 'Build responsive GUIs, layout calculations, and dynamic interfaces' },
  { slug: 'core-algorithms', name: 'Core Algorithms', description: 'Fundamental problem-solving skills that transfer to any domain' },
  { slug: 'performance', name: 'Performance Optimization', description: 'Optimize for frame budgets, network efficiency, and mobile performance' },
  { slug: 'architecture', name: 'Architecture', description: 'Design scalable and maintainable game systems' },
]

const badges = [
  { id: 'first-solve', name: 'First Blood', description: 'Solve your first problem', rarity: 'common' },
  { id: 'streak-7', name: 'Week Warrior', description: '7 day streak', rarity: 'common' },
  { id: 'streak-30', name: 'Monthly Master', description: '30 day streak', rarity: 'rare' },
  { id: 'streak-100', name: 'Centurion', description: '100 day streak', rarity: 'epic' },
  { id: 'easy-10', name: 'Easy Does It', description: 'Solve 10 easy problems', rarity: 'common' },
  { id: 'medium-10', name: 'Getting Serious', description: 'Solve 10 medium problems', rarity: 'rare' },
  { id: 'hard-10', name: 'Hardcore Coder', description: 'Solve 10 hard problems', rarity: 'epic' },
  { id: 'pro', name: 'Pro Member', description: 'Subscribe to Pro', rarity: 'rare' },
]

async function seed() {
  console.log('Seeding database...')

  console.log('Creating badges...')
  for (const badge of badges) {
    await db.insert(schema.badges).values(badge).onConflictDoNothing()
  }

  console.log('Creating tracks...')
  for (let i = 0; i < tracks.length; i++) {
    await db.insert(schema.tracks).values({
      ...tracks[i],
      orderIndex: i,
    }).onConflictDoNothing()
  }

  console.log('Creating problems...')
  for (const problem of problems) {
    const [created] = await db
      .insert(schema.problems)
      .values({
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        statementMd: problem.statementMd,
        template: problem.template,
        constraints: problem.constraints,
        publishedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning()

    if (created && problem.tests) {
      for (let i = 0; i < problem.tests.length; i++) {
        const test = problem.tests[i]
        await db.insert(schema.tests).values({
          problemId: created.id,
          visibility: test.visibility,
          input: test.input,
          expectedOutput: test.expected,
          orderIndex: i,
        })
      }
    }
  }

  console.log('Done seeding!')
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})

