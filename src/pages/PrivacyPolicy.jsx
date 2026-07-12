import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  {
    title: '1. Information We Collect',
    content: 'When you create an account, we collect your full name, email address, and password (stored in encrypted form). When you register for championships, we collect additional information including your date of birth, school, zone, district, and event preferences. We also collect usage data such as login timestamps, pages visited, and device information to improve the Platform.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your personal information to manage your athlete account, process championship registrations, display your results and performance history, communicate important updates about championships you are registered for, and improve the overall functionality of the Platform. Your email address is used for account authentication and essential notifications only.',
  },
  {
    title: '3. Championship Data Sharing',
    content: 'Registration data, including your name, bib number, school, and zone, may be shared with championship organizers and displayed in official start lists and results. This data is sourced from and synced with Google Sheets managed by authorized administrators. Results data, including your performance achievements and rankings, is publicly displayed as part of official championship records.',
  },
  {
    title: '4. Data Storage and Security',
    content: 'Your data is stored on secure servers and protected by industry-standard encryption. Passwords are hashed and never stored in plain text. We use HTTPS to encrypt all data transmitted between your device and our servers. While we implement robust security measures, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '5. Third-Party Services',
    content: 'RUNRESULT uses Google OAuth for secure authentication — we do not store your Google credentials. Championship data is managed through Google Sheets integration. These third-party services have their own privacy policies, and we encourage you to review them. We only share the minimum data necessary to enable these integrations.',
  },
  {
    title: '6. Cookies and Tracking',
    content: 'We use essential cookies to maintain your login session and remember your preferences. We do not use advertising cookies or sell your data to third parties for marketing purposes. Session data is stored locally in your browser and can be cleared at any time by logging out.',
  },
  {
    title: '7. Data Retention',
    content: 'Your account data is retained as long as your account remains active. If you delete your account, we will remove your personal information within a reasonable timeframe. Championship registration records and results may be retained for historical and archival purposes, as they form part of official competition records.',
  },
  {
    title: '8. Your Rights',
    content: 'You have the right to access, correct, or request deletion of your personal data at any time. You can update your profile information directly from your athlete dashboard. To request data deletion or for any privacy-related inquiries, please contact us through the official RUNRESULT website.',
  },
  {
    title: '9. Children\'s Privacy',
    content: 'RUNRESULT is designed for use by student-athletes who may be under the age of 18. We take extra care to protect the privacy of minors. Registration for championships is facilitated through authorized school administrators. We do not knowingly collect unnecessary personal information from minors beyond what is required for championship participation.',
  },
  {
    title: '10. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page with an updated revision date. Continued use of the Platform after changes are posted constitutes acceptance of the updated policy.',
  },
  {
    title: '11. Contact Us',
    content: 'If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us through the official RUNRESULT website or contact our support team directly.',
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <Navbar />

      <div className="pt-24 lg:pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0342B3] transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Sign Up
            </Link>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#0342B3]/10 flex items-center justify-center shrink-0">
                <Lock size={24} className="text-[#0342B3]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Privacy Policy</h1>
                <p className="text-sm text-[#64748B] mt-1">Last updated: July 2026</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <h2 className="text-base font-bold text-[#0F172A] mb-2">{section.title}</h2>
                  <p className="text-sm text-[#64748B] leading-relaxed">{section.content}</p>
                  {i < sections.length - 1 && <hr className="mt-8 border-gray-100" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
