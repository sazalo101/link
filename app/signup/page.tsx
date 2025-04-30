import { SignupForm } from "@/components/auth/signup-form"
import { LinkIcon } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            <span className="text-xl font-bold">LinkHub</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12">
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
