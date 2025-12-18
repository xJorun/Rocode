import Link from 'next/link'
import { Button } from '@rocode/ui'
import { ArrowRight, Code2, Trophy, Users, Zap, Shield, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>The #1 platform for Roblox developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Master <span className="gradient-text">Luau</span>
            <br />
            Get Hired
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            Practice Roblox-flavored coding challenges, compete on leaderboards,
            and showcase your skills to top studios. Built for the next generation
            of Roblox developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/problems">
              <Button size="lg" className="group">
                Start Solving
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-zinc-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-100">40+</div>
              <div className="text-sm">Problems</div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-100">4</div>
              <div className="text-sm">Tracks</div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-100">∞</div>
              <div className="text-sm">Potential</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to level up
          </h2>
          <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
            From beginner to expert, RoCode provides the tools and challenges
            to help you become a better Roblox developer.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Code2}
              title="Real Luau Execution"
              description="Run your code in a secure sandboxed environment with Roblox-like APIs and instant feedback."
            />
            <FeatureCard
              icon={Trophy}
              title="Compete & Rank"
              description="Weekly and monthly leaderboards. Earn badges, build streaks, and climb the rankings."
            />
            <FeatureCard
              icon={Users}
              title="Studio Hiring"
              description="Studios create assessments from our problem bank. Get discovered and hired."
            />
            <FeatureCard
              icon={Zap}
              title="Roblox-Flavored"
              description="Signals, state machines, inventory systems, matchmaking - problems that matter for Roblox."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Sandbox"
              description="Isolated execution with strict time and memory limits. Your code runs safely."
            />
            <FeatureCard
              icon={Sparkles}
              title="Pro Analytics"
              description="Track your progress, identify weaknesses, and get personalized practice recommendations."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-zinc-400 mb-8">
            Sign in with your Roblox account and begin your journey.
          </p>
          <Link href="/auth/login">
            <Button size="lg">
              Sign in with Roblox
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
        <Icon className="h-6 w-6 text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  )
}

