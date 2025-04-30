"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, Share2 } from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"

interface QRCodeGeneratorProps {
  url: string
  username: string
}

export function QRCodeGenerator({ url, username }: QRCodeGeneratorProps) {
  const [size, setSize] = useState<number>(200)
  const [bgColor, setBgColor] = useState<string>("#FFFFFF")
  const [fgColor, setFgColor] = useState<string>("#000000")
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return

    const svg = qrCodeRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `${username}-qrcode.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Settings</CardTitle>
          <CardDescription>Customize your QR code appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select value={size.toString()} onValueChange={(value) => setSize(Number.parseInt(value))}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">Small (128px)</SelectItem>
                <SelectItem value="200">Medium (200px)</SelectItem>
                <SelectItem value="256">Large (256px)</SelectItem>
                <SelectItem value="320">Extra Large (320px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-md border"
              />
              <div className="flex-1">
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="uppercase" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fgColor">Foreground Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="fgColor"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-md border"
              />
              <div className="flex-1">
                <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="uppercase" />
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Label>Your Profile URL</Label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
              {url}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>Scan this code to visit your profile page</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6">
          <div
            ref={qrCodeRef}
            className="flex items-center justify-center p-4 bg-white rounded-lg"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeSVG value={url} size={size} bgColor={bgColor} fgColor={fgColor} level="H" includeMargin={true} />
          </div>

          <div className="flex gap-4">
            <Button onClick={downloadQRCode} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setShareModalOpen(true)} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        url={url}
        title={`${username}'s Profile`}
        description={`Check out ${username}'s profile page`}
        image={null}
      />
    </div>
  )
}
