import { motion } from "motion/react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { TrendingUp, Zap, Clock } from "lucide-react";

const requestData = [
  { time: "00:00", requests: 12 },
  { time: "04:00", requests: 8 },
  { time: "08:00", requests: 45 },
  { time: "12:00", requests: 67 },
  { time: "16:00", requests: 89 },
  { time: "20:00", requests: 52 },
];

const statusData = [
  { status: "200", count: 234 },
  { status: "201", count: 89 },
  { status: "400", count: 12 },
  { status: "500", count: 3 },
];

export function Analytics() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);

  useEffect(() => {
    // Animated count-up effect
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setTotalRequests(Math.floor(12847 * progress));
      setSuccessRate(Math.floor(98.2 * progress * 10) / 10);
      setAvgDuration(Math.floor(145 * progress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTotalRequests(12847);
        setSuccessRate(98.2);
        setAvgDuration(145);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Real-Time Analytics Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor webhook performance with detailed analytics, success rates, and trend visualization.
          </p>
        </div>

        <motion.div
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 border border-gray-200 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Metrics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#7f22fe]" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Requests</p>
              <h3 className="text-[#7f22fe]">{totalRequests.toLocaleString()}</h3>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-cyan-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Success Rate</p>
              <h3 className="text-[#00d4ff]">{successRate}%</h3>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#7f22fe]" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">Avg Duration</p>
              <h3 className="text-gray-900">{avgDuration}ms</h3>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="mb-6">Requests Over Time</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={requestData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#7f22fe"
                    strokeWidth={3}
                    dot={{ fill: '#7f22fe', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="mb-6">Status Code Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7f22fe" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
