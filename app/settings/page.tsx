import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-[var(--muted-foreground)]">Configure your Personal CRM</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Integration</CardTitle>
            <CardDescription>Configure your AI provider API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-[var(--muted)] p-4 text-sm">
              <p className="font-medium mb-1">To enable AI features:</p>
              <ol className="list-decimal list-inside space-y-1 text-[var(--muted-foreground)]">
                <li>
                  Get an API key from{" "}
                  <span className="font-mono text-[var(--foreground)]">console.anthropic.com</span>
                </li>
                <li>
                  Add it to your{" "}
                  <span className="font-mono text-[var(--foreground)]">.env</span> file:
                  <pre className="mt-1 bg-[var(--background)] rounded p-2 text-xs overflow-x-auto">
                    ANTHROPIC_API_KEY=&quot;your-key-here&quot;
                  </pre>
                </li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription>Database configuration and management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-[var(--muted)] p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Provider</span>
                <span className="font-mono">SQLite (local dev)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Location</span>
                <span className="font-mono">prisma/dev.db</span>
              </div>
              <p className="text-[var(--muted-foreground)] text-xs mt-2">
                To migrate to PostgreSQL for Vercel deployment, update the{" "}
                <span className="font-mono text-[var(--foreground)]">datasource</span> in{" "}
                <span className="font-mono text-[var(--foreground)]">prisma/schema.prisma</span> and set{" "}
                <span className="font-mono text-[var(--foreground)]">DATABASE_URL</span> to your Postgres connection string.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment</CardTitle>
            <CardDescription>Deploy to Vercel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-[var(--muted)] p-4 text-sm space-y-2 text-[var(--muted-foreground)]">
              <p>To deploy to Vercel:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Postgres database on Vercel Storage</li>
                <li>Update Prisma schema to use postgres provider</li>
                <li>Set DATABASE_URL in Vercel environment variables</li>
                <li>Set ANTHROPIC_API_KEY in Vercel environment variables</li>
                <li>Run <span className="font-mono text-[var(--foreground)]">vercel deploy</span></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
