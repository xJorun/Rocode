'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, Input, Button, Avatar, AvatarImage, AvatarFallback, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@rocode/ui'
import { User, Bell, Shield, CreditCard, Save, Mail, Crown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Loading } from '@rocode/ui'

export default function SettingsPage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [email, setEmail] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading settings..." />
      </div>
    )
  }

  const handleSave = () => {
    // TODO: Implement API call to save settings
    console.log('Saving settings...')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback className="text-2xl">{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.displayName || user.username}</p>
                    <p className="text-sm text-zinc-400">@{user.username}</p>
                    {user.planTier === 'pro' && (
                      <Badge variant="pro" className="mt-2">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro Member
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      disabled
                    />
                    <p className="text-xs text-zinc-400 mt-1">Email is managed through your Roblox account</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <Input value={user.username} disabled />
                    <p className="text-xs text-zinc-400 mt-1">Username cannot be changed</p>
                  </div>
                </div>

                <Button onClick={handleSave} className="mt-6">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-zinc-400">Receive notifications about your submissions and achievements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 rounded bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-zinc-400">Receive updates about new features and special offers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="w-5 h-5 rounded bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Billing & Subscription</h2>
              
              <div className="p-6 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-lg">Current Plan</p>
                    <p className="text-sm text-zinc-400">
                      {user.planTier === 'pro' ? 'Pro Membership' : 'Free Plan'}
                    </p>
                  </div>
                  {user.planTier === 'pro' ? (
                    <Badge variant="pro">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </div>

                {user.planTier === 'free' ? (
                  <div>
                    <p className="text-zinc-400 mb-4">Upgrade to Pro for unlimited access, analytics, and more!</p>
                    <Button asChild>
                      <a href="/billing">Upgrade to Pro</a>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button variant="outline" asChild>
                      <a href="/billing">Manage Subscription</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900/50 rounded-lg">
                  <p className="font-medium mb-2">Profile Visibility</p>
                  <p className="text-sm text-zinc-400 mb-4">Control who can see your profile and activity</p>
                  <select className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-lg">
                  <p className="font-medium mb-2">Show Solved Problems</p>
                  <p className="text-sm text-zinc-400 mb-4">Display your solved problems on your profile</p>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="mt-6">
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
