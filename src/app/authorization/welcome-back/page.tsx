// src/app/authorization/welcome-back/page.tsx
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function WelcomeBackPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const email = user.emailAddresses[0]?.emailAddress

  if (!email) {
    throw new Error("User email not found")
  }

  // Update last signed in
  await prisma.user.update({
    where: { email },
    data: {
      last_signed_in_at: new Date(),
    },
  })

  redirect("/dashboard")
}