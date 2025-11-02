import { motion } from "motion/react";
import { XCircle, CheckCircle } from "lucide-react";

const problems = [
  {
    problem: "Local testing is hard",
    solution: "Instant URLs",
    description: "Get auto-generated webhook URLs instantly for every project without complex setup."
  },
  {
    problem: "No visibility",
    solution: "Full request logging",
    description: "See every header, body, status code, and error with complete request/response logging."
  },
  {
    problem: "Tedious switching",
    solution: "One-click environment toggle",
    description: "Switch between development and production environments with a single click."
  }
];

export function ProblemSolution() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">Built for Developer Productivity</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stop wasting time on webhook infrastructure. Focus on building great products.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#7f22fe] transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900">{item.problem}</p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-red-200 via-purple-200 to-green-200 my-6" />

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="mb-2 text-[#7f22fe]">{item.solution}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
