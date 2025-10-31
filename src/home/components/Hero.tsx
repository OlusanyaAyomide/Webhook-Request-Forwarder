import { motion } from "motion/react";
import { ArrowRight, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressLink } from "@/components/protected/ProgressLink";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import BaseUrl from "./BaseUrl";
import Image from "next/image";

function Header({ isVisible }: { isVisible: boolean }) {
  const headerVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
      variants={headerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Echo Logo"
            className="h-10 w-10 rounded-lg xl:h-12 xl:w-12"
            height={12}
            width={12}
            unoptimized
          />
          <span className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-[#7f22fe] to-[#00d4ff] bg-clip-text text-transparent">
            Echo
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <ProgressLink href={"/sign-in"}>
            <Button variant="ghost" className="text-gray-600 px-6  hover:text-black md:px-10 hover:bg-[var(--primary)]/50 h-10">
              Login
            </Button>
          </ProgressLink>
          <ProgressLink href={"/sign-up"}>
            <Button
              className="h-10 px-5"
            >
              Sign Up For Free
            </Button>
          </ProgressLink>
        </div>
      </div>
    </motion.header>
  );
}


export function Hero() {
  const { theme, setTheme } = useTheme();
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      return;
    }
    setTheme("light");
  }, [theme, setTheme]);


  useEffect(() => {

    const SCROLL_THRESHOLD = 100;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* The new header is rendered here */}
      <Header isVisible={isHeaderVisible} />

      {/* This is your original Hero section content */}
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
              className="mb-6 font-medium text-xl md:text-2xl lg:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Stop Guessing. Start Monitoring. Webhooks Built to Echo.
            </motion.h1>

            <motion.p
              className="mb-10 text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Turn blind integrations into a fully controlled, real-time pipeline. Your complete platform for testing, monitoring, and seamless management from dev to production.
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
                  <BaseUrl />
                  <span>/</span>
                  <span className="text-yellow-600">service-project-id</span>
                  <span className="text-[#7f22fe]">/custom-path</span>
                </code>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
