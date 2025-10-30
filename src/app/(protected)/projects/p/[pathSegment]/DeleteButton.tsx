'use client'

import { Button } from "@/components/ui/button"
import { deleteProject } from "./actions"

export function DeleteButton({ pathSegment }: { pathSegment: string }) {

  return (
    <form action={deleteProject}>
      <input type="hidden" name="pathSegment" value={pathSegment} />
      <Button type="submit">Delete</Button>
    </form>
  )
}
