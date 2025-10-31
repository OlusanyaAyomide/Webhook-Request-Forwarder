import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export default async function AuthorizationPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in") // fallback if unauthenticated
  }

  const email = user.emailAddresses[0]?.emailAddress
  const first_name = user.firstName || ""
  const last_name = user.lastName || ""



  if (!email) {
    throw new Error("User email not found")
  }

  // Check if the user exists in Prisma
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        last_signed_in_at: new Date()
      },
    })
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        last_signed_in_at: new Date(),
      },
    })
  }

  console.log('redirecting...')

  redirect("/dashboard")
}
