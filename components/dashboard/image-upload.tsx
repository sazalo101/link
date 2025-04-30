"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder = "Upload an image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would upload to a storage service
      // For this demo, we'll create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        onChange(dataUrl)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput) return

    // Basic URL validation
    try {
      new URL(urlInput)
      onChange(urlInput)
      setUrlInput("")
      setShowUrlInput(false)
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      })
    }
  }

  const handleRemoveImage = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full aspect-video rounded-md overflow-hidden border">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById("image-upload")?.click()}
                type="button"
              >
                {isUploading ? "Uploading..." : "Upload an image"}
              </Button>
            </label>
            <Button variant="link" type="button" onClick={() => setShowUrlInput(!showUrlInput)}>
              Or use an image URL
            </Button>
          </div>
        </div>
      )}

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" onClick={handleUrlSubmit}>
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
