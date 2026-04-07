"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewWorkflowPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create workflow")
      }

      const workflow = await res.json()
      router.push(`/workflows/${workflow.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/workflows">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workflows
        </Link>
      </Button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">New Workflow</h2>
        <p className="text-[var(--muted-foreground)]">Create a new automation sequence</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Workflow Name *</label>
              <Input name="name" required placeholder="e.g., New Lead Follow-up Sequence" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                placeholder="What does this workflow do?"
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Trigger Type</label>
              <select
                name="triggerType"
                className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <option value="manual">Manual — enroll contacts manually</option>
                <option value="tag_added">Tag Added — when a tag is added</option>
                <option value="status_changed">Status Changed — when contact status changes</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Workflow"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
