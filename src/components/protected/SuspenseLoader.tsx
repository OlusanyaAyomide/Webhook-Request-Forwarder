'use client'

import { motion, Variants } from "motion/react";

export function SuspenseLoader() {
  const boxVariants: Variants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.3
      }
    })
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated background orbs */}
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold bg-gradient-to-r from-[#7f22fe] to-[#00d4ff] bg-clip-text text-transparent"
        >
          Echo
        </motion.div>

        {/* Animated boxes */}
        <motion.div
          className="flex items-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            "from-purple-500 to-purple-600 shadow-purple-500/50",
            "from-[#7f22fe] to-[#9d4eff] shadow-purple-500/50",
            "from-[#5c9fff] to-[#00d4ff] shadow-cyan-500/50",
            "from-cyan-500 to-cyan-600 shadow-cyan-500/50"
          ].map((gradient, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={boxVariants}
              className={`w-4 h-4 rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-600 text-sm"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}