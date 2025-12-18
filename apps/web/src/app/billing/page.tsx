'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Loading } from '@rocode/ui'
import { Check, Crown, Sparkles, Building2 } from 'lucide-react'

export default function BillingPage() {
  const { user } = useAuth()

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.getPlans(),
  })

  const { data: status, isLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => api.getBillingStatus(),
    enabled: !!user,
  })

  const checkoutMutation = useMutation({
    mutationFn: (priceId: string) => api.createCheckout(priceId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url
      }
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  const currentPlan = status?.planTier || 'free'

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Upgrade to Pro</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Unlock unlimited access, advanced analytics, and premium features
          to accelerate your Luau learning journey.
        </p>
      </div>

      {status?.subscription && (
        <Card className="mb-8 border-emerald-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">You're a Pro member!</p>
                  <p className="text-sm text-zinc-400">
                    {status.subscription.cancelAtPeriodEnd
                      ? `Ends ${new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}`
                      : `Renews ${new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className={currentPlan === 'free' ? 'border-zinc-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Free</span>
              <span className="text-2xl font-bold">$0</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-6">Perfect for getting started</p>
            <ul className="space-y-3 mb-6">
              {[
                'Full account & profile',
                'Public leaderboards',
                '20 submissions per day',
                'Editorials after solve',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="primary" className="px-3">
              <Sparkles className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pro</span>
              <div className="text-right">
                <span className="text-2xl font-bold">$9.99</span>
                <span className="text-sm text-zinc-400">/mo</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-6">For serious developers</p>
            <ul className="space-y-3 mb-6">
              {[
                'Unlimited submissions',
                'Full editorial access',
                'Analytics dashboard',
                'Interview prep mode',
                'Pro badge',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => checkoutMutation.mutate(process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!)}
              disabled={currentPlan === 'pro' || checkoutMutation.isPending}
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
            <p className="text-xs text-zinc-500 text-center mt-3">
              Or save 17% with annual billing ($99.99/year)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Studio
              </span>
              <span className="text-sm text-zinc-400">Custom</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-6">For hiring teams</p>
            <ul className="space-y-3 mb-6">
              {[
                'Everything in Pro',
                'Create assessments',
                'Private problem bank',
                'Candidate reports',
                'Team management',
                'API access',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

