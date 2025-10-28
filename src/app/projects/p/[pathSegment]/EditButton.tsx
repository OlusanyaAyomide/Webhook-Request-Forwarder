'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProject } from "./actions"
import { useActionState } from "react"
import { Project } from "@prisma/client"

export function EditButton({ project }: { project: Project }) {
  const [state, formAction] = useActionState(updateProject.bind(null, project.pathSegment), {
    errors: {},
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the details of your project.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={project.name} />
            {state.errors?.name && (
              <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="forwarderBaseUrl">Forwarder Base URL</Label>
            <Input
              id="forwarderBaseUrl"
              name="forwarderBaseUrl"
              defaultValue={project.forwarderBaseUrl}
            />
            {state.errors?.forwarderBaseUrl && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.forwarderBaseUrl}
              </p>
            )}
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
