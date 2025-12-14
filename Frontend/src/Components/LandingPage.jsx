import { useNavigate } from "react-router-dom";
import { FaUsers, FaMoneyBillWave, FaChartLine, FaFileInvoiceDollar, FaArrowLeft, FaShieldAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CountUp from "react-countup";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-900">RemuneTrack</div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#stats" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Stats</a>
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#demo" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Demo</a>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Professional Clean */}
      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-xl mb-6">
              <FaShieldAlt size={14} />
              Trusted by 150+ Educational Institutions
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Faculty <span className="text-blue-600">Remuneration</span>
              <br />
              <span className="text-4xl lg:text-5xl">System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Streamline faculty payments, generate automated slips, 
              and maintain accurate records with our secure, institutional-grade platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                Get Started Free
                <FaArrowLeft className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
              <button
                onClick={() => navigate("/demo")}
                className="px-8 py-4 border-2 border-gray-200 text-gray-900 font-semibold text-lg rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all bg-white"
              >
                Request Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold mb-2">₹2.5M+</div>
                  <div className="text-sm opacity-90">Monthly Processed</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold mb-2">250+</div>
                  <div className="text-sm opacity-90">Faculty Managed</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl text-center col-span-2">
                  <FaFileInvoiceDollar className="w-16 h-16 mx-auto mb-3 opacity-80" />
                  <div className="text-lg font-semibold">Auto-Generated Slips</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-white/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-3">
                <CountUp end={250} duration={2.5} />+
              </div>
              <div className="text-2xl font-semibold text-gray-900">Faculty Members</div>
              <div className="text-gray-500">Managed Monthly</div>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-emerald-600 mb-3">
                ₹<CountUp end={1200000} duration={2.5} separator="," />
              </div>
              <div className="text-2xl font-semibold text-gray-900">Payments Processed</div>
              <div className="text-gray-500">Per Semester</div>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-indigo-600 mb-3">
                <CountUp end={7} duration={2.5} />+
              </div>
              <div className="text-2xl font-semibold text-gray-900">Academic Semesters</div>
              <div className="text-gray-500">Fully Supported</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage faculty remuneration efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaUsers,
                title: "Faculty Management",
                desc: "Complete lifecycle management from onboarding to payments",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: FaMoneyBillWave,
                title: "Smart Payments",
                desc: "Automated calculations with travel allowances and deductions",
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                icon: FaFileInvoiceDollar,
                title: "Payment Slips",
                desc: "Professional PDF slips with institutional branding",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              {
                icon: FaChartLine,
                title: "Analytics Dashboard",
                desc: "Track payments, budgets, and semester-wise comparisons",
                color: "text-amber-600",
                bg: "bg-amber-50"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 ${feature.bg} ${feature.color} mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-blue-200 text-blue-800 font-semibold rounded-2xl mb-8 shadow-lg max-w-max mx-auto">
              <FaCheckCircle size={18} />
              <span>Ready in 5 Minutes</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Experience our intuitive interface designed specifically for educational institutions.
            </p>
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-sm">
                <div className="text-center p-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">Add Faculty</div>
                  <div className="text-gray-600">3 clicks</div>
                </div>
                <div className="text-center p-6 border-l-2 border-gray-200 md:border-l-0 md:border-t-2">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">Generate Slips</div>
                  <div className="text-gray-600">1 click</div>
                </div>
                <div className="text-center p-6 md:border-t-2 border-t-2 border-gray-200">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">Export Reports</div>
                  <div className="text-gray-600">Instant</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ready to Simplify <span className="text-blue-600">Faculty Payments?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join educational institutions using our platform for accurate, 
              efficient remuneration management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all w-full sm:w-auto justify-center cursor-pointer"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-10 py-5 border-2 border-gray-200 text-gray-900 font-bold text-xl rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all bg-white w-full sm:w-auto"
              >
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">FacultyPay</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Professional faculty remuneration management for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FacultyPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
