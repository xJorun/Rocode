'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, Loading } from '@rocode/ui'
import { Code2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/roblox/start`)
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error('Login failed:', e)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Code2 className="h-8 w-8 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to RoCode</h1>
            <p className="text-zinc-400">Sign in with your Roblox account to start practicing</p>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base"
          >
            {isLoading ? (
              <Loading size="sm" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.164 0L.755 18.508l18.27 5.228L23.433 5.228 5.164 0zm8.027 8.6l3.807 1.09-1.09 3.807-3.806-1.09 1.089-3.807z" />
                </svg>
                Sign in with Roblox
              </>
            )}
          </Button>

          <p className="text-xs text-zinc-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We only access your basic Roblox profile information.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

