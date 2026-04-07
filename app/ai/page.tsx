"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Search, Loader2 } from "lucide-react"

interface AiSummaryResult {
  summary: string
  suggestions: string[]
  contactName?: string
  error?: string
}

export default function AiPage() {
  const [contactId, setContactId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiSummaryResult | null>(null)

  async function handleSummarize() {
    if (!contactId.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: contactId.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResult({ summary: "", suggestions: [], error: data.error })
        return
      }

      let suggestions: string[] = []
      try {
        suggestions = JSON.parse(data.suggestions)
      } catch {
        suggestions = []
      }

      setResult({ summary: data.summary, suggestions })
    } catch {
      setResult({ summary: "", suggestions: [], error: "Failed to connect to AI service" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-[var(--primary)]" />
          AI Assistant
        </h2>
        <p className="text-[var(--muted-foreground)] mt-1">
          Powered by Claude — get smart summaries and follow-up suggestions for your contacts.
        </p>
      </div>

      <div className="space-y-6">
        {/* Contact Summarizer */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Summary</CardTitle>
            <CardDescription>
              Enter a contact ID to generate an AI-powered relationship summary and follow-up suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                placeholder="Contact ID (find it in the contact's URL)"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
              />
              <Button onClick={handleSummarize} disabled={loading || !contactId.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-2">{loading ? "Generating..." : "Summarize"}</span>
              </Button>
            </div>

            {result?.error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {result.error}
              </div>
            )}

            {result && !result.error && (
              <div className="rounded-md border border-[var(--border)] p-4 space-y-3" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)" }}>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Summary</h4>
                  <p className="text-sm">{result.summary}</p>
                </div>
                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Suggested Follow-ups</h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-[var(--primary)] font-bold">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Coming Soon</CardTitle>
            <CardDescription>Planned AI features for future versions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              {[
                "Natural language contact search — \"find my contacts at YC companies\"",
                "Auto-categorization of contacts from email/LinkedIn imports",
                "AI-generated outreach email drafts based on relationship history",
                "Smart workflow suggestions based on contact behavior",
                "Weekly relationship health digest",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Search className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
