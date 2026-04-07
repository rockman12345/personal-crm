"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface ContactFormProps {
  initialData?: {
    id: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    company?: string | null
    role?: string | null
    notes?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    website?: string | null
    status: string
  }
}

export function ContactForm({ initialData }: ContactFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const url = initialData ? `/api/contacts/${initialData.id}` : "/api/contacts"
      const method = initialData ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save contact")
      }

      const contact = await res.json()
      router.push(`/contacts/${contact.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
            Basic Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">First Name *</label>
              <Input
                name="firstName"
                required
                defaultValue={initialData?.firstName}
                placeholder="Jane"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last Name *</label>
              <Input
                name="lastName"
                required
                defaultValue={initialData?.lastName}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              defaultValue={initialData?.email || ""}
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <Input
              name="phone"
              type="tel"
              defaultValue={initialData?.phone || ""}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
            Professional
          </h3>
          <div className="space-y-1">
            <label className="text-sm font-medium">Company</label>
            <Input
              name="company"
              defaultValue={initialData?.company || ""}
              placeholder="Acme Corp"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Role / Title</label>
            <Input
              name="role"
              defaultValue={initialData?.role || ""}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "active"}
              className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
            Social & Web
          </h3>
          <div className="space-y-1">
            <label className="text-sm font-medium">Website</label>
            <Input
              name="website"
              type="url"
              defaultValue={initialData?.website || ""}
              placeholder="https://janedoe.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              name="linkedinUrl"
              type="url"
              defaultValue={initialData?.linkedinUrl || ""}
              placeholder="https://linkedin.com/in/janedoe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Twitter / X URL</label>
            <Input
              name="twitterUrl"
              type="url"
              defaultValue={initialData?.twitterUrl || ""}
              placeholder="https://twitter.com/janedoe"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-sm text-[var(--muted-foreground)] uppercase tracking-wide">
            Notes
          </h3>
          <Textarea
            name="notes"
            defaultValue={initialData?.notes || ""}
            placeholder="Any context, how you met, things to remember..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Contact"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
