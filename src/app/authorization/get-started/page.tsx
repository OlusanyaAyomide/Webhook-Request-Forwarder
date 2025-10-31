// src/app/authorization/get-started/page.tsx
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function GetStartedPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const email = user.emailAddresses[0]?.emailAddress
  const first_name = user.firstName || ""
  const last_name = user.lastName || ""

  if (!email) {
    throw new Error("User email not found")
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    // User already exists - redirect to sign in with error
    redirect(`/sign-in?error=account_exists&email=${encodeURIComponent(email)}`)
  }

  // Create new user
  await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      last_signed_in_at: new Date()
    },
  })

  redirect("/dashboard")
}