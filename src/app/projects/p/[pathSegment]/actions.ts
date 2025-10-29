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

const basicSettingsSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  forwarderBaseUrl: z.string().url('Must be a valid URL'),
})

const liveUrlSchema = z.object({
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type ActionResult = {
  success: boolean
  error?: string
}

export async function updateBasicSettings(
  pathSegment: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const validatedFields = basicSettingsSchema.safeParse({
      name: formData.get('name'),
      forwarderBaseUrl: formData.get('forwarderBaseUrl'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid field passed',
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

    return { success: true }
  } catch (error) {
    console.error('Update basic settings error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update settings',
    }
  }
}

export async function updateLiveUrl(
  pathSegment: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const liveUrl = formData.get('liveUrl') as string

    const validatedFields = liveUrlSchema.safeParse({
      liveUrl: liveUrl || undefined,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid fields passed',
      }
    }

    await prisma.project.update({
      where: { pathSegment },
      data: {
        liveUrl: liveUrl || null,
      },
    })

    revalidatePath(`/dashboard/p/${pathSegment}`)

    return { success: true }
  } catch (error) {
    console.error('Update live URL error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update live URL',
    }
  }
}

export async function toggleLiveStatus(
  pathSegment: string,
  isLive: boolean
): Promise<ActionResult> {
  try {
    await prisma.project.update({
      where: { pathSegment },
      data: {
        isLive,
      },
    })

    revalidatePath(`/dashboard/p/${pathSegment}`)

    return { success: true }
  } catch (error) {
    console.error('Toggle live status error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle live status',
    }
  }
}