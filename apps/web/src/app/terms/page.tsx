export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-zinc-100">Terms of Service</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-zinc-300">
        <p className="text-sm text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">1. Acceptance of Terms</h2>
          <p>
            By accessing and using RoCode, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">2. Use License</h2>
          <p>
            Permission is granted to temporarily use RoCode for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">4. Code Submissions</h2>
          <p>
            You retain ownership of code you submit. By submitting code, you grant RoCode a license to use, store, and evaluate your code for the purpose of providing the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">5. Prohibited Uses</h2>
          <p>You may not use RoCode:</p>
          <ul className="list-disc pl-6">
            <li>For any unlawful purpose</li>
            <li>To submit malicious code</li>
            <li>To attempt to gain unauthorized access</li>
            <li>To interfere with the service's operation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">6. Disclaimer</h2>
          <p>
            The materials on RoCode are provided on an 'as is' basis. RoCode makes no warranties, expressed or implied.
          </p>
        </section>
      </div>
    </div>
  )
}

