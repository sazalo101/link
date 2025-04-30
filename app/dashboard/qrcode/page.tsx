import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { QRCodeGenerator } from "@/components/dashboard/qrcode-generator"
import { getBaseUrl } from "@/lib/utils"

export default async function QRCodePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const profileUrl = `${getBaseUrl()}/${session.user.username}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code</h1>
        <p className="text-muted-foreground">Generate a QR code for your profile page.</p>
      </div>

      <QRCodeGenerator url={profileUrl} username={session.user.username as string} />
    </div>
  )
}
