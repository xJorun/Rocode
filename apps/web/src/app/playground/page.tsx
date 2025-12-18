import Link from 'next/link'
import { Button } from '@rocode/ui'
import { Code2 } from 'lucide-react'

export default function PlaygroundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
          <Code2 className="h-8 w-8 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Playground Disabled</h1>
        <p className="text-zinc-400 mb-8">
          The playground feature has been disabled. Please use Roblox Studio to practice and experiment with Luau code.
        </p>
        <Link href="/problems">
          <Button>Browse Problems</Button>
        </Link>
      </div>
    </div>
  )
}

