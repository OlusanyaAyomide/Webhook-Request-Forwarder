'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Project, Apps } from '@prisma/client'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { toast } from 'sonner'
import {
  updateBasicSettings,
  updateApplication,
  toggleLiveStatus,
  deleteProject,
} from '@/app/(protected)/projects/p/[pathSegment]/actions'
import { Loader2, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

import { useRouter } from 'next/navigation'
import NewAppDialog from './NewAppDialog'

interface ProjectConfigurationProps {
  project: Project
  apps: Apps[]
}

export default function ProjectConfiguration({ project, apps }: ProjectConfigurationProps) {
  const router = useRouter()
  const [isBasicPending, setIsBasicPending] = useState(false)
  const [isAppPending, setIsAppPending] = useState(false)
  const [isTogglePending, setIsTogglePending] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [selectedAppId, setSelectedAppId] = useState(project.appId || '')

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

  const handleApplicationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAppPending(true)

    try {
      const result = await updateApplication(project.pathSegment, selectedAppId || null)

      if (result.success) {
        toast.success('Application updated successfully')
      } else {
        toast.error(result.error || 'Failed to update application')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsAppPending(false)
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

  const handleDeleteProject = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm')
      return
    }

    setIsDeletePending(true)

    try {
      const result = await deleteProject(project.pathSegment)

      if (result.success) {
        toast.success('Project deleted successfully')
        setIsDeleteOpen(false)
        router.push('/projects')
      } else {
        toast.error(result.error || 'Failed to delete project')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeletePending(false)
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
          <CardTitle>Application Configuration</CardTitle>
          <CardDescription>Select the application for webhook forwarding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="app-select">Application</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Select an existing application or add a new one
              </p>
              <Select
                value={selectedAppId}
                onValueChange={setSelectedAppId}
                disabled={isAppPending}
              >
                <SelectTrigger id="app-select">
                  <SelectValue placeholder="Select an application" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <NewAppDialog
              onSuccess={(app) => {
                setSelectedAppId(app.id)
              }}
            />
            <div>
              <Button
                type="submit"
                className="h-10 md:h-12 px-8 text-white"
                disabled={isAppPending || !selectedAppId}
              >
                {isAppPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Application
              </Button>
            </div>
          </form>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="live-toggle">Go Live</Label>
                <p className="text-sm text-muted-foreground">
                  Enable webhook forwarding to your application
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

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete this project and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="h-10 md:h-12 px-8"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  &quot;{project.name}&quot; and all associated request logs.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="delete-confirm">
                  Type <span className="font-bold">delete</span> to confirm your intention
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="delete"
                  className="mt-2"
                  disabled={isDeletePending}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                  className='w-full h-12 flex'
                  disabled={isDeletePending || deleteConfirmation.toLowerCase() !== 'delete'}
                >
                  {isDeletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  )
}