'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

const schema = z.object({
  name: z.string().min(1),
  forwarderBaseUrl: z.string().url(),
})

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

interface FormState {
  errors?: {
    name?: string[];
    forwarderBaseUrl?: string[];
  };
}

export async function createProject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    forwarderBaseUrl: formData.get('forwarderBaseUrl'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, forwarderBaseUrl } = validatedFields.data
  const slug = slugify(name)
  const suffix = Math.random().toString(36).substring(2, 8)
  const pathSegment = `${slug}-${suffix}`

  await prisma.project.create({
    data: {
      name,
      slug,
      suffix,
      pathSegment,
      forwarderBaseUrl,
    },
  })

  redirect('/dashboard')

  // This return is technically unreachable due to redirect(), but satisfies TypeScript
  return {};
}
