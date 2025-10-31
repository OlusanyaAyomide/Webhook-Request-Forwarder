import { motion } from "motion/react";
import { CreditCard, GitBranch, Bell, Zap } from "lucide-react";

const useCases = [
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Test Stripe, PayPal, and payment gateway webhooks during development",
    color: "from-purple-500 to-purple-600",
    hoverColor: "group-hover:border-purple-500"
  },
  {
    icon: GitBranch,
    title: "CI/CD Integration",
    description: "Monitor GitHub, GitLab, and Bitbucket webhook events in real-time",
    color: "from-cyan-500 to-cyan-600",
    hoverColor: "group-hover:border-cyan-500"
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Handle Slack, Discord, and notification service webhooks reliably",
    color: "from-purple-600 to-pink-500",
    hoverColor: "group-hover:border-pink-500"
  },
  {
    icon: Zap,
    title: "Custom API Events",
    description: "Build and test your own webhook-based integrations with ease",
    color: "from-cyan-600 to-purple-500",
    hoverColor: "group-hover:border-purple-500"
  }
];

export function UseCases() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Perfect For Any Use Case</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From payment processing to CI/CD pipelines, our platform handles all your webhook needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                className={`group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 ${useCase.hoverColor}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-5 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <h4 className="mb-3">{useCase.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>

                {/* Hover indicator */}
                <motion.div
                  className="mt-4 flex items-center gap-2 text-[#7f22fe] text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional use case examples */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm mb-4">Also works with</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Twilio", "SendGrid", "Shopify", "Mailchimp", "Zapier", "Auth0"].map((service, index) => (
              <motion.div
                key={index}
                className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#7f22fe] hover:text-[#7f22fe] transition-colors"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                {service}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
