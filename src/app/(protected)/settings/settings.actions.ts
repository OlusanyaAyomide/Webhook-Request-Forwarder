'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function updateAppUrl(appId: string, url: string) {
  try {

    const user = await currentUser()

    // Verify the app belongs to the user
    const app = await prisma.apps.findFirst({
      where: {
        id: appId,
        User: {
          email: user?.emailAddresses[0].emailAddress
        }
      },
    })

    if (!app) {
      return { success: false, error: 'App not found' }
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return { success: false, error: 'Invalid URL format' }
    }

    await prisma.apps.update({
      where: { id: appId },
      data: { url },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Error updating app URL:', error)
    return { success: false, error: 'Failed to update URL' }
  }
}

export async function updateAppLiveStatus(appId: string, isLive: boolean) {
  try {
    const user = await currentUser()

    // Verify the app belongs to the user
    const app = await prisma.apps.findFirst({
      where: {
        id: appId,
        User: {
          email: user?.emailAddresses[0].emailAddress
        },
      },
      include: {
        projects: true,
      },
    })

    if (!app) {
      return { success: false, error: 'App not found' }
    }

    // Update app and all associated projects in a transaction
    await prisma.$transaction(async (tx) => {
      // Update the app
      await tx.apps.update({
        where: { id: appId },
        data: { isLive },
      })

      // Update all projects under this app
      if (app.projects.length > 0) {
        await tx.project.updateMany({
          where: {
            appId: appId,
          },
          data: {
            isLive,
            // When going live, update forwarderBaseUrl to app's url
            ...(isLive && { forwarderBaseUrl: app.url }),
          },
        })
      }
    })

    revalidatePath('/settings')
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Error updating app live status:', error)
    return { success: false, error: 'Failed to update live status' }
  }
}

export async function deleteApp(appId: string) {
  try {
    const user = await currentUser()

    // Verify the app belongs to the user
    const app = await prisma.apps.findFirst({
      where: {
        id: appId,
        User: {
          email: user?.emailAddresses[0].emailAddress
        },
      },
      include: {
        projects: {
          include: {
            requestLogs: true,
          },
        },
      },
    })

    if (!app) {
      return { success: false, error: 'App not found' }
    }

    // Delete app and all associated data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all request logs for projects under this app
      for (const project of app.projects) {
        if (project.requestLogs.length > 0) {
          await tx.requestLog.deleteMany({
            where: { projectId: project.id },
          })
        }
      }

      // Delete all projects under this app
      if (app.projects.length > 0) {
        await tx.project.deleteMany({
          where: { appId: appId },
        })
      }

      // Delete the app
      await tx.apps.delete({
        where: { id: appId },
      })
    })

    revalidatePath('/settings')
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Error deleting app:', error)
    return { success: false, error: 'Failed to delete app' }
  }
}

export async function getAppsWithProjects() {
  try {
    const user = await currentUser()

    const apps = await prisma.apps.findMany({
      where: {
        User: {
          email: user?.emailAddresses[0].emailAddress
        },
      },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            pathSegment: true,
            isLive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return { success: true, apps }
  } catch (error) {

    return { success: false, error: 'Failed to fetch apps', apps: [] }
  }
}