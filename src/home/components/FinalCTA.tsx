import { motion } from "motion/react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressLink } from "@/components/protected/ProgressLink";


const features = [
  "Completely Free",
  "Instant setup - no credit card",
  "Complete request logging",
  "Real-time analytics"
];

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7f22fe] via-purple-600 to-[#00d4ff]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-white">
            Start Testing Webhooks Now
          </h2>

          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have simplified their webhook workflow.
            Get started in under 2 minutes.
          </p>

          {/* CTA Button */}
          <motion.div
            className="mb-12"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-white text-[#7f22fe] w-[170px] md:w-[200px] hover:bg-gray-100 rounded-xl px-10 py-7 shadow-2xl text-base font-medium"
            >
              <ProgressLink href={"/sign-up"}>
                Get Started Free
              </ProgressLink>
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </motion.div>

          {/* Feature list */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-white"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm md:text-base">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Trust indicator */}
          <motion.div
            className="mt-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-cyan-300 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm text-white">
              Join <strong>5,000+</strong> developers already using our platform
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
