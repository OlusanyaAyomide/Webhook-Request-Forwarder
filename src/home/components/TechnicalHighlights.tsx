import { motion } from "motion/react";
import { Zap, BarChart3, Filter, Lock, Globe, Clock } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Real-time request forwarding" },
  { icon: BarChart3, text: "Advanced analytics & insights" },
  { icon: Filter, text: "Request filtering & routing" },
  { icon: Lock, text: "Secure HTTPS endpoints" },
  { icon: Globe, text: "Global edge network" },
  { icon: Clock, text: "Request history & replay" }
];

export function TechnicalHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Built for Developers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful technical features that make webhook development faster and more reliable
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Features list */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-cyan-100 flex items-center justify-center group-hover:from-[#7f22fe] group-hover:to-[#00d4ff] transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-[#7f22fe] group-hover:text-white transition-colors" strokeWidth={2} />
                  </motion.div>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {highlight.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right - Code example */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
              {/* Code editor header */}
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400">webhook-example.js</span>
                <div className="w-16" /> {/* Spacer */}
              </div>

              {/* Code content */}
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-cyan-300">webhookUrl</span>{" "}
                    <span className="text-white">=</span>{"\n"}
                    <span className="text-green-400">  &quot;https://webhooks.yourdomain.com/&quot;</span>{" "}
                    <span className="text-white">+</span>{"\n"}
                    <span className="text-green-400">  &quot;abc123-your-project-id&quot;</span>
                    <span className="text-white">;</span>{"\n\n"}
                    <span className="text-gray-500">{'// Configure your webhook'}</span>{"\n"}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-cyan-300">stripe</span>
                    <span className="text-white">.</span>
                    <span className="text-cyan-300">webhooks</span>
                    <span className="text-white">.</span>
                    <span className="text-yellow-300">create</span>
                    <span className="text-white">{'({'}</span>{"\n"}
                    <span className="text-cyan-300">  url</span>
                    <span className="text-white">:</span>{" "}
                    <span className="text-cyan-300">webhookUrl</span>
                    <span className="text-white">,</span>{"\n"}
                    <span className="text-cyan-300">  events</span>
                    <span className="text-white">: [</span>
                    <span className="text-green-400">&apos;payment.success&apos;</span>
                    <span className="text-white">]</span>{"\n"}
                    <span className="text-white">{'});'}</span>{"\n\n"}
                    <span className="text-gray-500">{'// Monitor in real-time ✨'}</span>
                  </code>
                </pre>
              </div>

              {/* Status bar */}
              <div className="bg-[#2d2d2d] px-4 py-2 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">Connected</span>
                </div>
                <span className="text-xs text-gray-500">JavaScript</span>
              </div>
            </div>

            {/* Info badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                <Zap className="w-4 h-4 text-[#7f22fe]" />
                <span className="text-sm text-gray-700">0ms latency</span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-2">
                <Lock className="w-4 h-4 text-[#00d4ff]" />
                <span className="text-sm text-gray-700">HTTPS secured</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">99.9% uptime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
