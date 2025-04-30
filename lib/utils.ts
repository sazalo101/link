import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUsername(name: string): string {
  // Convert to lowercase and replace spaces with underscores
  const baseUsername = name.toLowerCase().replace(/\s+/g, "_")

  // Add a random number to make it unique
  const randomSuffix = Math.floor(Math.random() * 1000)

  return `${baseUsername}_${randomSuffix}`
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // For server-side rendering
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}
