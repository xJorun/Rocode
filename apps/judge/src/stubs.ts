export const LUAU_STUBS = `
-- RoCode Luau Runtime Stubs v1.0
-- These are simulated Roblox-like APIs for algorithm practice
-- They do NOT represent the full Roblox engine

-- Vector3 Implementation
Vector3 = {}
Vector3.__index = Vector3

function Vector3.new(x, y, z)
  local self = setmetatable({}, Vector3)
  self.X = x or 0
  self.Y = y or 0
  self.Z = z or 0
  self.Magnitude = math.sqrt(self.X^2 + self.Y^2 + self.Z^2)
  self.Unit = nil
  return self
end

Vector3.zero = Vector3.new(0, 0, 0)
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

function CFrame:Inverse()
  return CFrame.new(-self.X, -self.Y, -self.Z)
end

function CFrame:Lerp(other, alpha)
  return CFrame.new(
    self.X + (other.X - self.X) * alpha,
    self.Y + (other.Y - self.Y) * alpha,
    self.Z + (other.Z - self.Z) * alpha
  )
end

function CFrame.lookAt(pos, target)
  local cf = CFrame.new(pos.X, pos.Y, pos.Z)
  cf.LookVector = (target - pos).Unit or Vector3.new(0, 0, -1)
  return cf
end

-- Signal Implementation
local Signal = {}
Signal.__index = Signal

function Signal.new()
  local self = setmetatable({}, Signal)
  self._connections = {}
  return self
end

function Signal:Connect(callback)
  local connection = {
    _callback = callback,
    _connected = true,
    Disconnect = function(conn)
      conn._connected = false
      for i, c in ipairs(self._connections) do
        if c == conn then
          table.remove(self._connections, i)
          break
        end
      end
    end
  }
  table.insert(self._connections, connection)
  return connection
end

function Signal:Fire(...)
  for _, connection in ipairs(self._connections) do
    if connection._connected then
      connection._callback(...)
    end
  end
end

function Signal:Wait()
  return nil
end

function Signal:Once(callback)
  local connection
  connection = self:Connect(function(...)
    connection:Disconnect()
    callback(...)
  end)
  return connection
end

-- Instance Mock (very limited)
Instance = {}
Instance.__index = Instance

function Instance.new(className)
  local self = setmetatable({}, Instance)
  self.ClassName = className
  self.Name = className
  self.Parent = nil
  self._children = {}
  self._attributes = {}
  return self
end

function Instance:GetChildren()
  return self._children
end

function Instance:FindFirstChild(name)
  for _, child in ipairs(self._children) do
    if child.Name == name then
      return child
    end
  end
  return nil
end

function Instance:GetAttribute(name)
  return self._attributes[name]
end

function Instance:SetAttribute(name, value)
  self._attributes[name] = value
end

function Instance:Destroy()
  self.Parent = nil
  self._children = {}
end

-- Utility functions
function wait(seconds)
  return seconds or 0
end

function delay(seconds, callback)
  callback()
end

function spawn(callback)
  callback()
end

task = {
  wait = wait,
  delay = delay,
  spawn = spawn,
  defer = spawn,
}

-- Math extensions
math.clamp = function(value, min, max)
  return math.max(min, math.min(max, value))
end

-- Table extensions
table.find = function(t, value)
  for i, v in ipairs(t) do
    if v == value then
      return i
    end
  end
  return nil
end

table.clear = function(t)
  for k in pairs(t) do
    t[k] = nil
  end
end

table.freeze = function(t)
  return t
end

table.isfrozen = function(t)
  return false
end

table.clone = function(t)
  local new = {}
  for k, v in pairs(t) do
    new[k] = v
  end
  return new
end

-- String extensions
string.split = function(str, sep)
  local parts = {}
  for part in str:gmatch("[^" .. (sep or "%s") .. "]+") do
    table.insert(parts, part)
  end
  return parts
end

-- Global print capture
local __OUTPUT__ = {}
local originalPrint = print
print = function(...)
  local args = {...}
  local parts = {}
  for i = 1, select("#", ...) do
    table.insert(parts, tostring(args[i]))
  end
  table.insert(__OUTPUT__, table.concat(parts, "\\t"))
  originalPrint(...)
end
`

