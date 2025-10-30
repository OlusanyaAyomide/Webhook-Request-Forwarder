// src/components/protected/NewProjectForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createProject } from '@/app/(protected)/projects/new/actions'
import NewAppDialog from './NewAppDialog'
import { trimText } from '@/services/services'


interface App {
  id: string
  name: string
  url: string
}

interface NewProjectFormProps {
  apps: App[]
}

export default function NewProjectForm({ apps }: NewProjectFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string>('')
  const [errors, setErrors] = useState<{
    name?: string
    forwarderBaseUrl?: string
    appId?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)

    // Add the selected app ID to the form data
    if (selectedAppId) {
      formData.set('appId', selectedAppId)
    }

    try {
      const result = await createProject(formData)

      if (result.success) {
        toast.success('Project created successfully')
        router.push('/projects')
      } else if (result.errors) {
        setErrors(result.errors)
        toast.error('Please fix the errors and try again')
      } else {
        toast.error(result.error || 'Failed to create project')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Create project error:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">New Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="My Webhook Project"
            disabled={isPending}
            className="mt-4"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="forwarderBaseUrl">Forwarder Base URL</Label>
          <Input
            id="forwarderBaseUrl"
            name="forwarderBaseUrl"
            placeholder="https://api.example.com"
            disabled={isPending}
            className="mt-5"
          />
          {errors.forwarderBaseUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.forwarderBaseUrl}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="app">Select App</Label>
            <NewAppDialog
              onSuccess={(app) => {
                setSelectedAppId(app.id)
              }}
            />
          </div>
          <Select
            value={selectedAppId}
            onValueChange={setSelectedAppId}
            disabled={isPending}
          >
            <SelectTrigger id="app" className="mt-2">
              <SelectValue placeholder="Choose an app" />
            </SelectTrigger>
            <SelectContent>
              {apps.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No apps available. Create one first.
                </div>
              ) : (
                apps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex">
                      <span className="font-medium">{app.name}</span>
                      <span className="text-foreground/50 ml-1 text-muted-foreground">
                        url: {
                          trimText(app.url, 40)
                        }
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.appId && (
            <p className="text-red-500 text-sm mt-1">{errors.appId}</p>
          )}
        </div>

        <div className="pt-2 mt-4">
          <Button
            type="submit"
            disabled={isPending || !selectedAppId}
            className="h-10 md:h-12 w-[220px] text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}