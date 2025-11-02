import { motion } from "motion/react";
import { CheckCircle, Repeat, Layers } from "lucide-react";
import { ProgressLink } from "@/components/protected/ProgressLink";

const benefits = [
  {
    icon: Repeat,
    text: "Create once, reuse everywhere across all projects"
  },
  {
    icon: Layers,
    text: "Live apps automatically override project URLs"
  },
  {
    icon: CheckCircle,
    text: "Seamless production deployment workflows"
  }
];

export function ApplicationManagement() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-cyan-50 opacity-50" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-[#7f22fe] px-4 py-2 rounded-full mb-6">
              <Layers className="w-4 h-4" />
              <span className="text-sm">Application Management</span>
            </div>

            <h2 className="mb-6">
              Create Once, Reuse Everywhere
            </h2>

            <p className="text-gray-600 mb-8">
              Build reusable application configurations that work seamlessly across all your projects.
              Perfect for production webhooks that need to be shared across multiple environments.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7f22fe] to-[#00d4ff] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 pt-2">{benefit.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-8 p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm">Live Mode Active</span>
              </div>
              <p className="text-purple-100 text-sm">
                Production apps automatically override development URLs when deployed
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Screenshot mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 overflow-hidden">
              {/* Mock browser chrome */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 text-xs text-gray-400">Create Application</div>
              </div>

              {/* Mock form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Application Name</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <span className="text-gray-900">Production API</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Webhook URL</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <code className="text-sm text-[#7f22fe]">
                      https://api.example.com/webhooks
                    </code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Environment</label>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-[var(--primary)]/5 border-2 border-[#7f22fe] rounded-xl px-4 py-3 text-center">
                      <span className="text-[#7f22fe]">Production</span>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
                      <span className="text-gray-400">Development</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-[#7f22fe] to-[#00d4ff] text-white rounded-xl py-4 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ProgressLink href={"sign-up"}>
                    Create Application
                  </ProgressLink>
                </motion.button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-cyan-200 rounded-full blur-3xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
