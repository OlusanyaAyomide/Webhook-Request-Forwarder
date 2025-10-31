import { motion } from "motion/react";
import { Link, Zap, ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressLink } from "@/components/protected/ProgressLink";


export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 pt-32 pb-20">

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

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="mb-6 font-medim text-xl md:text-2xl lg:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Echo your webhooks. Not the pain
          </motion.h1>

          <motion.p
            className="mb-10 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your all in one webhook Testing & Monitoring Platform
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProgressLink href={"/sign-up"}>
              <Button
                className="bg-[#7f22fe] hover:bg-[#6a1dd6] rounded-xl w-[200px] group py-6 shadow-lg shadow-purple-500/30"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-all duration-200" />
              </Button>
            </ProgressLink>

          </motion.div>
        </div>

        {/* Animated Webhook Flow Visualization */}
        <motion.div
          className="mt-20 max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-purple-100">
            <div className="flex items-center justify-between gap-8">
              {/* Third Party Service */}
              <motion.div
                className="flex-1 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Server className="w-10 h-10 text-white" />
                </div>
                <p className="text-sm text-gray-600">Third Party<br />Service</p>
              </motion.div>

              {/* Animated Arrow */}
              <motion.div
                className="flex items-center gap-2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#7f22fe]" />
                  <div className="w-2 h-2 rounded-full bg-[#7f22fe]" />
                  <div className="w-2 h-2 rounded-full bg-[#7f22fe]" />
                </div>
                <ArrowRight className="w-6 h-6 text-[#7f22fe]" />
              </motion.div>

              {/* Our App */}
              <motion.div
                className="flex-1 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7f22fe] to-[#00d4ff] flex items-center justify-center shadow-lg">
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Your Webhook<br />URL</p>
              </motion.div>

              {/* Animated Arrow */}
              <motion.div
                className="flex items-center gap-2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                  <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                  <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                </div>
                <ArrowRight className="w-6 h-6 text-[#00d4ff]" />
              </motion.div>

              {/* Your Endpoint */}
              <motion.div
                className="flex-1 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Your<br />Endpoint</p>
              </motion.div>
            </div>

            {/* Code Example */}
            <motion.div
              className="mt-8 bg-[#1e1e1e] rounded-xl p-4 overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <code className="text-sm text-[#00d4ff]">
                https://webhooks.yourdomain.com/
                <span className="text-[#7f22fe]">abc123-your-project-id</span>
              </code>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
