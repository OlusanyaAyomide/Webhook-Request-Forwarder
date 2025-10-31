import { motion } from "motion/react";
import { FolderPlus, Settings, Webhook, Activity } from "lucide-react";

const steps = [
  {
    icon: FolderPlus,
    title: "Create Project",
    description: "Start a new project and get an instant webhook URL"
  },
  {
    icon: Settings,
    title: "Configure Forwarding",
    description: "Set your destination endpoint and preferences"
  },
  {
    icon: Webhook,
    title: "Receive Webhooks",
    description: "Add the URL to your third-party service"
  },
  {
    icon: Activity,
    title: "Monitor & Debug",
    description: "Watch requests in real-time with full logging"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple four-step process
          </p>
        </div>

        <div className="relative">
          {/* Desktop timeline */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1">
            <div className="max-w-5xl mx-auto relative h-full">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#7f22fe] to-[#00d4ff] rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon container */}
                    <motion.div
                      className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#7f22fe] to-[#00d4ff] flex items-center justify-center mb-6 shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-10 h-10 text-white" strokeWidth={2} />

                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-200">
                        <span className="text-[#7f22fe]">{index + 1}</span>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>

                  {/* Mobile connector line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-6">
                      <div className="w-1 h-12 bg-gradient-to-b from-[#7f22fe] to-[#00d4ff] rounded-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Additional info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-sm text-gray-700">
              Average setup time: <strong className="text-[#7f22fe]">2 minutes</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
