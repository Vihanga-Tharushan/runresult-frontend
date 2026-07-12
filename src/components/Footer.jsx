import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Building2, User, Mail, Phone, Code, Laptop,
} from 'lucide-react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.25 h-4.25">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.25 h-4.25">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.25 h-4.25">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.25 h-4.25">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const socialLinks = [
  { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
  { Icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">

          {/* Brand */}
          <motion.div {...fadeUp}>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="RunResult Logo" className="h-11 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-5 max-w-xs">
              <span className="font-semibold text-white/80">RUNRESULT</span> is a professional Sports
              Results Management System designed to simplify championship registrations, athlete
              management, and official result publication.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-white hover:text-[#0342B3] transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-white/70" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Run Result System</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <User size={14} className="text-white/70" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Ruwan R Samarakkodi</p>
                  <p className="text-xs text-white/40">Founder</p>
                </div>
              </li>
              <li>
                <a href="mailto:runresults700@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Mail size={14} className="text-white/70" />
                  </div>
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors break-all">runresults700@gmail.com</p>
                </a>
              </li>
              <li>
                <a href="tel:+94760347594" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Phone size={14} className="text-white/70" />
                  </div>
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors">+94 76 034 7594</p>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Website Development */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Website Development</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <Laptop size={14} className="text-white/70" />
              </div>
              <p className="text-sm text-white/80 font-medium">Vihanga Tharushan</p>
            </div>
            <ul className="space-y-3 mb-5">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-white/70" />
                </div>
                <a href="tel:+94785718845" className="text-sm text-white/80 group-hover:text-white transition-colors">+94 78 571 8845</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-white/70" />
                </div>
                <a href="mailto:vihangatharushan013@gmail.com" className="text-sm text-white/80 group-hover:text-white transition-colors break-all">vihangatharushan013@gmail.com</a>
              </li>
            </ul>
            
          </motion.div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-xs text-white/35">&copy; 2026 RUNRESULT. All Rights Reserved.</p>
            <p className="text-xs text-white/35">
              Designed &amp; Developed by{' '}
              <span className="text-white/55 font-medium">Vihanga Tharushan</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
