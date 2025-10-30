'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createProject } from './actions'

export default function NewProjectPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    forwarderBaseUrl?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)

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
        <div className="pt-2 mt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 md:h-12 px-14 text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}
