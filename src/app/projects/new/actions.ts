'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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


const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  forwarderBaseUrl: z.string().url('Must be a valid URL'),
})

type CreateProjectResult = {
  success: boolean
  errors?: {
    name?: string
    forwarderBaseUrl?: string
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
    })

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error,
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

    // Create the project
    await prisma.project.create({
      data: {
        name,
        slug,
        suffix,
        pathSegment,
        forwarderBaseUrl,
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