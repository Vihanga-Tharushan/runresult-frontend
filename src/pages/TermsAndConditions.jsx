import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing and using RUNRESULT ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Platform. These terms apply to all users, including athletes, administrators, and staff members.',
  },
  {
    title: '2. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. You agree to notify us immediately of any unauthorized use of your account. RUNRESULT reserves the right to suspend or terminate accounts that violate these terms.',
  },
  {
    title: '3. Athlete Registration',
    content: 'When registering for championships through the Platform, you confirm that all information provided is accurate and truthful. Registration is subject to championship-specific eligibility requirements. Bib numbers and event assignments are managed by championship organizers. Duplicate registrations for the same championship are not permitted.',
  },
  {
    title: '4. Championship Data',
    content: 'All championship results, start lists, heat results, and event schedules displayed on the Platform are sourced from official records and Google Sheets maintained by authorized administrators. While we strive for accuracy, RUNRESULT does not guarantee the completeness or correctness of third-party data. Official results as declared by event organizers shall be considered final.',
  },
  {
    title: '5. Use of the Platform',
    content: 'You may use the Platform solely for its intended purpose of viewing sports results, registering for championships, and managing your athlete profile. You must not attempt to gain unauthorized access to any part of the Platform or its systems. Automated access, scraping, or data mining is strictly prohibited without prior written consent.',
  },
  {
    title: '6. Privacy and Data Protection',
    content: 'Your use of the Platform is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using the Platform, you consent to the practices described in the Privacy Policy.',
  },
  {
    title: '7. Intellectual Property',
    content: 'All content, design, graphics, and branding on RUNRESULT are the property of RUNRESULT and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Platform without explicit written permission.',
  },
  {
    title: '8. Third-Party Services',
    content: 'The Platform integrates with third-party services including Google Sheets for data management and Google OAuth for authentication. Your use of these third-party services is subject to their respective terms of service and privacy policies. RUNRESULT is not responsible for the availability or practices of third-party services.',
  },
  {
    title: '9. Limitation of Liability',
    content: 'RUNRESULT shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. The Platform is provided "as is" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.',
  },
  {
    title: '10. Modifications',
    content: 'RUNRESULT reserves the right to modify these Terms and Conditions at any time. Changes will be effective upon posting to the Platform. Continued use of the Platform after changes constitutes acceptance of the modified terms. We encourage users to review these terms periodically.',
  },
  {
    title: '11. Governing Law',
    content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.',
  },
  {
    title: '12. Contact',
    content: 'If you have questions about these Terms and Conditions, please contact us through the official RUNRESULT website or email our support team.',
  },
]

export default function TermsAndConditions() {
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
                <Shield size={24} className="text-[#0342B3]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Terms & Conditions</h1>
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
