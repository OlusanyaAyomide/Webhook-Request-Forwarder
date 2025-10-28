'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function deleteProject(formData: FormData) {

  console.log('rhereee')
  const pathSegment = formData.get('pathSegment') as string

  const proj = await prisma.project.findFirst({
    where: { pathSegment }
  })

  await prisma.requestLog.deleteMany({
    where: {
      projectId: proj?.id
    }
  })

  await prisma.project.delete({
    where: { pathSegment },
  })


  redirect('/dashboard')
}

interface FormState {
  errors?: {
    name?: string[];
    forwarderBaseUrl?: string[];
  };
}

const schema = z.object({
  name: z.string().min(1),
  forwarderBaseUrl: z.string().url(),
})

interface FormState {
  errors?: {
    name?: string[];
    forwarderBaseUrl?: string[];
  };
}

export async function updateProject(
  pathSegment: string,
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

  await prisma.project.update({
    where: { pathSegment },
    data: {
      name,
      forwarderBaseUrl,
    },
  })

  revalidatePath(`/dashboard/p/${pathSegment}`)

  return {}
}