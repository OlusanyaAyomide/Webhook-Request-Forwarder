'use client'

import { SignUp } from '@clerk/nextjs'
import { motion } from "motion/react"

export default function Page() {
  return (
    <div className='grid place-items-center h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 pt-10 pb-20'>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "linear-gradient(135deg, #7f22fe 0%, #00d4ff 100%)" }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "linear-gradient(135deg, #00d4ff 0%, #7f22fe 100%)" }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <SignUp />
    </div>
  )
}