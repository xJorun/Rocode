export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-zinc-100">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-zinc-300">
        <p className="text-sm text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6">
            <li>Roblox account information (user ID, username, display name)</li>
            <li>Code submissions and solutions</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6">
            <li>Provide and maintain our service</li>
            <li>Process your code submissions</li>
            <li>Display leaderboards and rankings</li>
            <li>Send you notifications (if enabled)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">3. Data Storage</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We retain your data for as long as your account is active.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">4. Third-Party Services</h2>
          <p>
            We use third-party services including Roblox OAuth, Stripe for payments, and Sentry for error tracking. These services have their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of certain data collection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-zinc-100">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through the support channels.
          </p>
        </section>
      </div>
    </div>
  )
}

