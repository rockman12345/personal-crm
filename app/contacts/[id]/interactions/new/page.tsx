"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewInteractionPage() {
  const router = useRouter()
  const params = useParams()
  const contactId = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch(`/api/contacts/${contactId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to log interaction")
      }

      router.push(`/contacts/${contactId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/contacts/${contactId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contact
        </Link>
      </Button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Log Interaction</h2>
        <p className="text-[var(--muted-foreground)]">Record a touchpoint with this contact</p>
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
              <label className="text-sm font-medium">Type *</label>
              <select
                name="type"
                required
                className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
                <option value="linkedin">LinkedIn</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Title *</label>
              <Input name="title" required placeholder="e.g., Intro call, Follow-up email" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <Input
                name="date"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                name="content"
                placeholder="What was discussed? Any key takeaways?"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Log Interaction"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
