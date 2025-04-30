"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Share2 } from "lucide-react"
import { ShareModal } from "@/components/profile/share-modal"
import { getBaseUrl } from "@/lib/utils"

interface Activity {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
}

interface HostelActivitiesProps {
  activities: Activity[]
}

export function HostelActivities({ activities }: HostelActivitiesProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  if (activities.length === 0) {
    return null
  }

  const handleShareActivity = (e: React.MouseEvent, activity: Activity) => {
    e.stopPropagation()
    setSelectedActivity(activity)
    setShareModalOpen(true)
  }

  return (
    <div className="w-full space-y-4 mb-6">
      <h2 className="text-xl font-bold text-center">Hostel Activities</h2>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {activities.slice(0, expanded ? activities.length : 3).map((activity) => (
              <div key={activity.id} className="flex gap-3 relative">
                {activity.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={activity.imageUrl || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 pr-10">
                  <h3 className="font-medium">{activity.name}</h3>
                  {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={(e) => handleShareActivity(e, activity)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            ))}
          </div>

          {activities.length > 3 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="gap-1">
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Show More</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedActivity && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          url={`${getBaseUrl()}/activity/${selectedActivity.id}`}
          title={selectedActivity.name}
          description={selectedActivity.description || `Check out this activity: ${selectedActivity.name}`}
          image={selectedActivity.imageUrl}
        />
      )}
    </div>
  )
}
