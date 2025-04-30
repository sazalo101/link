import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LinkIcon, QrCode, User } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            <span className="text-xl font-bold">LinkHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Share all your links in one place
            </h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              Create your personalized link page and share it with the world. Generate a QR code for easy sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <LinkIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Manage Your Links</h3>
              <p className="text-muted-foreground">Add, edit, and organize all your important links in one place.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">QR Code Generation</h3>
              <p className="text-muted-foreground">
                Automatically generate a QR code for your profile page for easy sharing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Custom Profile</h3>
              <p className="text-muted-foreground">Get your own personalized URL that you can share with anyone.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
