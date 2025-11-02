// src/components/protected/NewAppDialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createApp } from '@/app/(protected)/projects/new/actions'


interface NewAppDialogProps {
  onSuccess?: (app: { id: string; name: string; url: string }) => void
}

export default function NewAppDialog({ onSuccess }: NewAppDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    url?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const url = formData.get('url')?.toString().trim() || ''

    try {
      const parsed = new URL(url)

      // Reject "http://" (only allow "https://")
      if (parsed.protocol !== 'https:') {
        setErrors({ url: 'Only secure URLs (https://) are allowed' })
        setIsPending(false)
        return
      }

    } catch {
      setErrors({ url: 'Please enter a valid URL (e.g. https://api.example.com)' })
      setIsPending(false)
      return
    }


    try {
      const result = await createApp(formData)

      if (result.success && result.data) {
        toast.success('App created successfully')
        setOpen(false)


        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(result.data)
        }

        // Refresh the page to update the apps list
        router.refresh()
      } else if (result.errors) {
        setErrors(result.errors)
        toast.error('Please fix the errors and try again')
      } else {
        toast.error(result.error || 'Failed to create app')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Create app error:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
          <DialogDescription>
            Add a new app to forward requests to when you toggle the live url. Enter the app name and its
            permanent URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          <div>
            <Label htmlFor="app-name">App Name</Label>
            <Input
              id="app-name"
              name="name"
              placeholder="e.g., Production API"
              disabled={isPending}
              className="mt-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="app-url">Permanent URL</Label>
            <Input
              id="app-url"
              name="url"
              type="url"
              placeholder="https://api.example.com"
              disabled={isPending}
              className="mt-2"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>
          <div className="grid grid-cols-2 justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className='h-10 md:h-12'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className='text-white h-10 md:h-12'>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create App
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}