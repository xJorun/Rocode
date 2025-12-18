'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Loading } from '@rocode/ui'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, fetchUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      setToken(token)
      fetchUser().then(() => {
        router.push('/problems')
      })
    } else {
      router.push('/auth/login')
    }
  }, [searchParams, setToken, fetchUser, router])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loading text="Signing you in..." />
    </div>
  )
}

