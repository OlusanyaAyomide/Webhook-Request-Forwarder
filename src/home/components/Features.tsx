import { motion } from "motion/react";
import { Link2, FileText, ToggleRight, Copy } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Link2,
    title: "Instant Webhook URLs",
    description: "Auto-generated URLs for every project. Copy and paste into any third-party service in seconds.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: FileText,
    title: "Complete Request Logging",
    description: "Capture every detail: headers, body, status codes, duration, and errors. Never miss a webhook again.",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: ToggleRight,
    title: "Smart Environment Switching",
    description: "Toggle between development and production modes instantly. Live apps override project URLs automatically.",
    color: "from-purple-600 to-cyan-500"
  }
];

export function Features() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make webhook development seamless and productive.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </motion.div>

                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>

                {/* Special interaction for first feature */}
                {index === 0 && (
                  <motion.div
                    className="relative bg-gray-900 rounded-xl p-4 overflow-hidden group cursor-pointer"
                    onClick={() => handleCopy(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <code className="text-sm text-cyan-400 block overflow-hidden text-ellipsis whitespace-nowrap">
                      https://hooks.dev/abc123
                    </code>
                    <motion.div
                      className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm rounded-lg p-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </motion.div>
                    {copiedIndex === index && (
                      <motion.div
                        className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-green-300">Copied!</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Animation for second feature */}
                {index === 1 && (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-gray-600">POST /webhook</span>
                          <span className="text-xs text-gray-400 ml-auto">200</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Animation for third feature */}
                {index === 2 && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-gray-600">Dev</span>
                    <motion.div
                      className="relative w-14 h-8 bg-[#7f22fe] rounded-full cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{ x: [0, 24, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <span className="text-sm text-gray-600">Prod</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
