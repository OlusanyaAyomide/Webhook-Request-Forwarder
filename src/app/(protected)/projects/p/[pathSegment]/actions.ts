'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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


export async function updateApplication(
  pathSegment: string,
  appId: string | null
): Promise<ActionResult> {
  try {
    // Validate that the app exists if appId is provided
    if (appId) {
      const appExists = await prisma.apps.findUnique({
        where: { id: appId },
      })

      if (!appExists) {
        return {
          success: false,
          error: 'Selected application does not exist',
        }
      }
    }

    await prisma.project.update({
      where: { pathSegment },
      data: {
        appId: appId,
      },
    })

    revalidatePath(`/dashboard/p/${pathSegment}`)

    return { success: true }
  } catch (error) {
    console.error('Update application error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update application',
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

export async function deleteProject(
  pathSegment: string
): Promise<ActionResult> {
  try {
    // First, delete all related request logs
    await prisma.requestLog.deleteMany({
      where: {
        project: {
          pathSegment
        }
      },
    })

    // Then delete the project itself
    await prisma.project.delete({
      where: { pathSegment },
    })

    revalidatePath('/projects')

    return { success: true }
  } catch (error) {
    console.error('Delete project error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete project',
    }
  }
}