'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'


const createAppSchema = z.object({
  name: z.string().min(1, 'App name is required'),
  url: z.string().url('Must be a valid URL'),
})

type CreateAppResult = {
  success: boolean
  errors?: Record<string, string>
  error?: string
  data?: {
    id: string
    name: string
    url: string
  }
}

export async function createApp(
  formData: FormData
): Promise<CreateAppResult> {

  const user = await currentUser()

  const userObj = await prisma.user.findUniqueOrThrow({
    where: { email: user?.emailAddresses[0].emailAddress }
  })

  console.log(formData.get("name"))

  try {
    const validatedFields = createAppSchema.safeParse({
      name: formData.get('name'),
      url: formData.get('url'),
    })


    if (!validatedFields.success) {
      return {
        success: false,
        errors: { name: "Ensure data passed is valid", url: "Ensure data passed is valid" },
      }
    }

    const { name, url } = validatedFields.data

    // Create the app
    const app = await prisma.apps.create({
      data: {
        name,
        url,
        userId: userObj.id,
        isLive: true,
      },
    })

    revalidatePath('/projects/new')
    revalidatePath('/projects')

    return {
      success: true,
      data: {
        id: app.id,
        name: app.name,
        url: app.url,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create app',
    }
  }
}

export async function getApps() {
  try {
    const apps = await prisma.apps.findMany({
      where: {
        isLive: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    })

    return apps
  } catch (error) {
    return []
  }
}

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  forwarderBaseUrl: z.string().url('Must be a valid URL'),
  appId: z.string().min(5)
})

type CreateProjectResult = {
  success: boolean
  errors?: {
    name?: string
    forwarderBaseUrl?: string
    appId?: string
  }
  error?: string
}

export async function createProject(
  formData: FormData
): Promise<CreateProjectResult> {
  try {
    const validatedFields = createProjectSchema.safeParse({
      name: formData.get('name'),
      forwarderBaseUrl: formData.get('forwarderBaseUrl'),
      appId: formData.get("appId")
    })

    const user = await currentUser()

    if (!validatedFields.success) {

      return {
        success: false,
        errors: validatedFields.error,
      }
    }

    const userObject = await prisma.user.findUnique({
      where: {
        email: user?.emailAddresses[0].emailAddress
      }
    })

    if (!userObject) {
      return {
        success: false,
      }
    }

    const { name, forwarderBaseUrl } = validatedFields.data

    // Generate slug and suffix
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const suffix = Math.random().toString(36).substring(2, 8)
    const pathSegment = `${slug}-${suffix}`


    await prisma.project.create({
      data: {
        name,
        slug,
        suffix,
        pathSegment,
        appId: validatedFields.data.appId,
        forwarderBaseUrl,
        userId: userObject.id
      },
    })

    revalidatePath('/projects')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Create project error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create project',
    }
  }
}

interface RetryWebhookParams {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

interface RetryWebhookResult {
  success: boolean;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
  duration?: number;
  error?: string;
}

export async function retryWebhook(
  params: RetryWebhookParams
): Promise<RetryWebhookResult> {

  console.log("Hello in here")
  try {
    const { url, method, headers, body } = params;

    if (!url) {
      return {
        success: false,
        error: "URL is required",
      };
    }

    // Start timing on server
    const startTime = Date.now();

    // Forward the webhook request
    const response = await fetch(url, {
      method: method || "POST",
      headers: {
        ...headers,
        "X-Retry-Request": "true",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Calculate duration on server
    const duration = Date.now() - startTime;

    const responseData = await response.text();
    let parsedData: unknown;

    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = { raw: responseData };
    }

    return {
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsedData,
      duration,
    };
  } catch (error) {
    console.error("Retry webhook error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retry webhook",
    };
  }
}