'use client'


import { createProject } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

export default function NewProjectPage() {
  const [state, formAction] = useActionState(createProject, {
    errors: {},
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">New Project</h1>
      <form action={formAction} className="flex flex-col gap-4 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />
          {state.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="forwarderBaseUrl">Forwarder Base URL</Label>
          <Input id="forwarderBaseUrl" name="forwarderBaseUrl" />
          {state.errors?.forwarderBaseUrl && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.forwarderBaseUrl}
            </p>
          )}
        </div>
        <Button type="submit">Create Project</Button>
      </form>
    </div>
  )
}
