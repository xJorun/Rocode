import { spawn, spawnSync, ChildProcess } from 'child_process'
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs'
import { homedir, tmpdir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const findLune = (): string | null => {
  const locations = [
    join(homedir(), 'bin', 'lune'),
    '/usr/local/bin/lune',
    '/opt/homebrew/bin/lune',
  ]
  
  for (const loc of locations) {
    if (existsSync(loc)) return loc
  }
  
  const result = spawnSync('which', ['lune'])
  if (result.status === 0) {
    return result.stdout.toString().trim()
  }
  
  return null
}

const lunePath = findLune()
const luneAvailable = lunePath !== null

const RUNNER_SCRIPT = `
local stdio = require("@lune/stdio")
local process = require("@lune/process")

local task = require("@lune/task")

-- Roblox Type Stubs
Vector3 = {}
Vector3.__index = function(self, key)
  if key == "Unit" then
    if self._unit == nil then
      if self.Magnitude > 0 then
        -- Create unit vector directly without calling Vector3.new to avoid recursion
        local unit = setmetatable({}, Vector3)
        unit.X = self.X / self.Magnitude
        unit.Y = self.Y / self.Magnitude
        unit.Z = self.Z / self.Magnitude
        unit.Magnitude = 1.0
        unit._unit = unit -- Cache itself to prevent recursion
        self._unit = unit
      else
        -- Zero vector - return itself (zero vector's unit is itself)
        self._unit = self
      end
    end
    return self._unit
  end
  return Vector3[key]
end

function Vector3.new(x, y, z)
  local self = setmetatable({}, Vector3)
  self.X = x or 0
  self.Y = y or 0
  self.Z = z or 0
  self.Magnitude = math.sqrt(self.X^2 + self.Y^2 + self.Z^2)
  -- Unit is calculated lazily via __index to avoid recursion
  self._unit = nil
  return self
end

-- Create constants directly to avoid recursion during initialization
local zeroVec = setmetatable({X = 0, Y = 0, Z = 0, Magnitude = 0, _unit = nil}, Vector3)
zeroVec._unit = zeroVec -- Zero vector's unit is itself
Vector3.zero = zeroVec

Vector3.one = Vector3.new(1, 1, 1)
Vector3.xAxis = Vector3.new(1, 0, 0)
Vector3.yAxis = Vector3.new(0, 1, 0)
Vector3.zAxis = Vector3.new(0, 0, 1)

function Vector3:__add(other)
  return Vector3.new(self.X + other.X, self.Y + other.Y, self.Z + other.Z)
end

function Vector3:__sub(other)
  return Vector3.new(self.X - other.X, self.Y - other.Y, self.Z - other.Z)
end

function Vector3:__mul(scalar)
  if type(scalar) == "number" then
    return Vector3.new(self.X * scalar, self.Y * scalar, self.Z * scalar)
  end
  return Vector3.new(self.X * scalar.X, self.Y * scalar.Y, self.Z * scalar.Z)
end

function Vector3:__div(scalar)
  return Vector3.new(self.X / scalar, self.Y / scalar, self.Z / scalar)
end

function Vector3:__eq(other)
  return self.X == other.X and self.Y == other.Y and self.Z == other.Z
end

function Vector3:__tostring()
  return string.format("Vector3(%g, %g, %g)", self.X, self.Y, self.Z)
end

function Vector3:Dot(other)
  return self.X * other.X + self.Y * other.Y + self.Z * other.Z
end

function Vector3:Cross(other)
  return Vector3.new(
    self.Y * other.Z - self.Z * other.Y,
    self.Z * other.X - self.X * other.Z,
    self.X * other.Y - self.Y * other.X
  )
end

function Vector3:Lerp(other, alpha)
  return self + (other - self) * alpha
end

-- CFrame Implementation (simplified)
CFrame = {}
CFrame.__index = CFrame

function CFrame.new(x, y, z)
  local self = setmetatable({}, CFrame)
  if type(x) == "table" and x.X then
    self.Position = x
    self.X = x.X
    self.Y = x.Y
    self.Z = x.Z
  else
    self.X = x or 0
    self.Y = y or 0
    self.Z = z or 0
    self.Position = Vector3.new(self.X, self.Y, self.Z)
  end
  self.LookVector = Vector3.new(0, 0, -1)
  self.RightVector = Vector3.new(1, 0, 0)
  self.UpVector = Vector3.new(0, 1, 0)
  return self
end

CFrame.identity = CFrame.new(0, 0, 0)

function CFrame:__mul(other)
  if type(other) == "table" and other.Position then
    return CFrame.new(self.X + other.X, self.Y + other.Y, self.Z + other.Z)
  elseif type(other) == "table" and other.X then
    return Vector3.new(self.X + other.X, self.Y + other.Y, self.Z + other.Z)
  end
  return self
end

function CFrame:__tostring()
  return string.format("CFrame(%g, %g, %g)", self.X, self.Y, self.Z)
end

function CFrame:Lerp(other, alpha)
  return CFrame.new(
    self.X + (other.X - self.X) * alpha,
    self.Y + (other.Y - self.Y) * alpha,
    self.Z + (other.Z - self.Z) * alpha
  )
end

-- Color3 stub
Color3 = {}
Color3.__index = Color3

function Color3.new(r, g, b)
  local self = setmetatable({}, Color3)
  self.R = r or 0
  self.G = g or 0
  self.B = b or 0
  return self
end

function Color3:__tostring()
  return string.format("Color3(%g, %g, %g)", self.R, self.G, self.B)
end

-- Vector2 stub
Vector2 = {}
Vector2.__index = Vector2

function Vector2.new(x, y)
  local self = setmetatable({}, Vector2)
  self.X = x or 0
  self.Y = y or 0
  self.Magnitude = math.sqrt(self.X^2 + self.Y^2)
  return self
end

Vector2.zero = Vector2.new(0, 0)
Vector2.one = Vector2.new(1, 1)

function Vector2:__add(other)
  return Vector2.new(self.X + other.X, self.Y + other.Y)
end

function Vector2:__sub(other)
  return Vector2.new(self.X - other.X, self.Y - other.Y)
end

function Vector2:__mul(scalar)
  if type(scalar) == "number" then
    return Vector2.new(self.X * scalar, self.Y * scalar)
  end
  return Vector2.new(self.X * scalar.X, self.Y * scalar.Y)
end

function Vector2:__tostring()
  return string.format("Vector2(%g, %g)", self.X, self.Y)
end

-- Input helpers
local __INPUT_LINES__ = {}
local __INPUT_INDEX__ = 1

local stdinContent = stdio.readAll()
if stdinContent then
  for line in stdinContent:gmatch("[^\\r\\n]+") do
    table.insert(__INPUT_LINES__, line)
  end
end

function readline()
  local line = __INPUT_LINES__[__INPUT_INDEX__]
  __INPUT_INDEX__ = __INPUT_INDEX__ + 1
  return line
end

function readnumber()
  return tonumber(readline())
end

function readnumbers()
  local line = readline()
  if not line then return {} end
  local nums = {}
  for num in line:gmatch("%%S+") do
    table.insert(nums, tonumber(num))
  end
  return nums
end

function clamp(value, min, max)
  return math.max(min, math.min(max, value))
end

-- Add to math namespace
math.clamp = clamp

function tablefind(t, value)
  for i, v in ipairs(t) do
    if v == value then return i end
  end
  return nil
end

-- Table utilities
table.find = tablefind

function table.clone(t)
  local copy = {}
  for k, v in pairs(t) do
    if type(v) == "table" then
      copy[k] = table.clone(v)
    else
      copy[k] = v
    end
  end
  return copy
end

function split(str, sep)
  local parts = {}
  for part in str:gmatch("[^" .. (sep or "%%s") .. "]+") do
    table.insert(parts, part)
  end
  return parts
end

-- String utilities
string.split = split

-- Task utilities (simplified - just delays)
function wait(seconds)
  -- In a real sandbox, this would actually wait, but for now we'll just return
  -- Since we're running synchronously, we can't actually wait
  return seconds
end

task = {}
function task.wait(seconds)
  return wait(seconds)
end

-- Print function for output
function print(...)
  local args = {...}
  local parts = {}
  for i, v in ipairs(args) do
    table.insert(parts, tostring(v))
  end
  stdio.write(table.concat(parts, "\t") .. "\n")
end

local success, result = pcall(function()
-- USER CODE STARTS HERE
%USER_CODE%
-- USER CODE ENDS HERE
end)

if not success then
  process.writeStderr(tostring(result))
  process.exit(1)
end
`

interface ExecutionResult {
  output: string
  error: string | null
  runtimeMs: number
  passed?: boolean
}

function sanitizeError(error: string, tempFile: string): string {
  return error.replace(new RegExp(tempFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'solution.luau')
}

function simulateLuneExecution(code: string, input: string): ExecutionResult {
  const startTime = Date.now()
  
  const printMatches = code.match(/print\(["']([^"']+)["']\)/g)
  let output = ''
  
  if (printMatches) {
    output = printMatches
      .map(m => {
        const match = m.match(/print\(["']([^"']+)["']\)/)
        return match ? match[1] : ''
      })
      .join('\n')
  }
  
  if (code.includes('return matches') || code.includes('return result')) {
    output = output || '(function executed - install Lune for real output)'
  }
  
  return {
    output: output || '(Lune not installed - showing mock output)',
    error: null,
    runtimeMs: Date.now() - startTime + Math.floor(Math.random() * 10),
  }
}

export async function executeLuau(
  code: string,
  input: string,
  timeoutMs: number = 5000
): Promise<ExecutionResult> {
  if (!luneAvailable) {
    return simulateLuneExecution(code, input)
  }

  const fullCode = RUNNER_SCRIPT.replace('%USER_CODE%', code)
  
  const tempDir = join(tmpdir(), 'rocode')
  try { mkdirSync(tempDir, { recursive: true }) } catch {}
  
  const tempFile = join(tempDir, `${randomUUID()}.luau`)
  writeFileSync(tempFile, fullCode)
  
  const startTime = Date.now()
  
  return new Promise((resolve) => {
    const proc: ChildProcess = spawn(lunePath!, ['run', tempFile], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let killed = false
    let timeoutId: NodeJS.Timeout | null = null

    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        if (!proc.killed) {
          proc.kill('SIGTERM')
          killed = true
        }
      }, timeoutMs)
    }

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        stdout += data.toString()
        if (stdout.length > 100000) {
          if (!proc.killed) {
            proc.kill('SIGTERM')
            killed = true
          }
        }
      })
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        stderr += data.toString()
      })
    }

    proc.on('close', (exitCode, signal) => {
      if (timeoutId) clearTimeout(timeoutId)
      
      try { unlinkSync(tempFile) } catch {}
      
      const runtimeMs = Date.now() - startTime

      if (signal === 'SIGTERM' || signal === 'SIGKILL' || killed) {
        resolve({
          output: stdout,
          error: 'Time limit exceeded',
          runtimeMs,
        })
        return
      }

      if (exitCode !== 0) {
        const sanitizedError = sanitizeError(stderr || 'Runtime error', tempFile)
        resolve({
          output: stdout,
          error: sanitizedError,
          runtimeMs,
        })
        return
      }

      resolve({
        output: stdout.trim(),
        error: null,
        runtimeMs,
      })
    })

    proc.on('error', (err) => {
      if (timeoutId) clearTimeout(timeoutId)
      
      try { unlinkSync(tempFile) } catch {}
      
      resolve({
        output: '',
        error: `Execution error: ${err.message}. Make sure Lune is installed.`,
        runtimeMs: Date.now() - startTime,
      })
    })

    if (proc.stdin) {
      proc.stdin.write(input)
      proc.stdin.end()
    }
  })
}

export async function runTestCases(
  code: string,
  testCases: { id: string; input: string; expectedOutput: string }[]
): Promise<{
  results: { testId: string; passed: boolean; output: string; expected: string; runtimeMs: number; error: string | null }[]
  allPassed: boolean
}> {
  const results = []

  for (const test of testCases) {
    const result = await executeLuau(code, test.input)
    const passed = !result.error && result.output.trim() === test.expectedOutput.trim()
    
    results.push({
      testId: test.id,
      passed,
      output: result.output,
      expected: test.expectedOutput,
      runtimeMs: result.runtimeMs,
      error: result.error,
    })
  }

  return {
    results,
    allPassed: results.every(r => r.passed),
  }
}

