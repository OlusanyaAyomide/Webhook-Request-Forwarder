import { motion } from "motion/react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Changelog", href: "#" }
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Status", href: "#" },
    { name: "Bug Reports", href: "#" }
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Security", href: "#" }
  ]
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" }
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div>
            <motion.div
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7f22fe] to-[#00d4ff] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white">Echo</span>
            </motion.div>
            <p className="text-gray-400 text-sm mb-6">
              The developer-first webhook testing and management platform.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 hover:border-[#7f22fe] transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5 text-gray-400 hover:text-[#7f22fe]" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#7f22fe] text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#7f22fe] text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#7f22fe] text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} WebhookPro. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
