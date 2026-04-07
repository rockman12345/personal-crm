import { ContactForm } from "@/components/contacts/contact-form"

export default function NewContactPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">New Contact</h2>
        <p className="text-[var(--muted-foreground)]">Add a new person to your CRM</p>
      </div>
      <ContactForm />
    </div>
  )
}
