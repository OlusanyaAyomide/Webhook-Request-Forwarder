'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Project } from '@prisma/client'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { toast } from 'sonner'
import { updateBasicSettings, updateLiveUrl, toggleLiveStatus } from '@/app/projects/p/[pathSegment]/actions'
import { Loader2 } from 'lucide-react'

export default function ProjectConfiguration({ project }: { project: Project }) {
  const [isBasicPending, setIsBasicPending] = useState(false)
  const [isLivePending, setIsLivePending] = useState(false)
  const [isTogglePending, setIsTogglePending] = useState(false)

  const handleBasicSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsBasicPending(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateBasicSettings(project.pathSegment, formData)

      if (result.success) {
        toast.success('Basic settings updated successfully')
      } else {
        toast.error(result.error || 'Failed to update settings')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsBasicPending(false)
    }
  }

  const handleLiveUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLivePending(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateLiveUrl(project.pathSegment, formData)

      if (result.success) {
        toast.success('Live URL updated successfully')
      } else {
        toast.error(result.error || 'Failed to update live URL')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLivePending(false)
    }
  }

  const handleToggleLive = async (checked: boolean) => {
    setIsTogglePending(true)

    try {
      const result = await toggleLiveStatus(project.pathSegment, checked)

      if (result.success) {
        toast.success(`Project is now ${checked ? 'live' : 'offline'}`)
      } else {
        toast.error(result.error || 'Failed to toggle live status')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsTogglePending(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBasicSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                name="name"
                defaultValue={project.name}
                className="mt-2"
                disabled={isBasicPending}
              />
            </div>
            <div>
              <Label htmlFor="forwarder-url">Forwarder URL</Label>
              <Input
                id="forwarder-url"
                name="forwarderBaseUrl"
                defaultValue={project.forwarderBaseUrl}
                className="mt-2"
                disabled={isBasicPending}
              />
            </div>
            <div>
              <Label htmlFor="path-segment">Path Segment</Label>
              <Input
                id="path-segment"
                defaultValue={project.pathSegment}
                className="mt-2"
                disabled
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="h-10 md:h-12 px-8 text-white"
                disabled={isBasicPending}
              >
                {isBasicPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Configuration</CardTitle>
          <CardDescription>Configure your live webhook forwarding URL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLiveUrlSubmit} className="space-y-4">
            <div>
              <Label htmlFor="live-url">Live URL</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                This is the URL that requests will be forwarded to once the live switch is toggled
              </p>
              <Input
                id="live-url"
                name="liveUrl"
                placeholder="https://api.example.com/webhook"
                defaultValue={project.liveUrl || ''}
                disabled={isLivePending}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="h-10 md:h-12 px-8 text-white"
                disabled={isLivePending}
              >
                {isLivePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Live URL
              </Button>
            </div>
          </form>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="live-toggle">Go Live</Label>
                <p className="text-sm text-muted-foreground">
                  Enable webhook forwarding to your live URL
                </p>
              </div>
              <Switch
                id="live-toggle"
                checked={project.isLive}
                onCheckedChange={handleToggleLive}
                disabled={isTogglePending}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}