import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Trophy, BarChart3, Menu, X } from 'lucide-react'
import UserDropdown from './UserDropdown'
import axios from 'axios'
import toast from 'react-hot-toast'

const navLinks = [
  { name: 'Home', path: '/athlete/dashboard', icon: Home },
  { name: 'Championships', path: '/athlete/championships', icon: Trophy },
  { name: 'Results', path: '/athlete/results', icon: BarChart3 }
]

export default function AthleteNavbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(
    ()=>{
      const token = localStorage.getItem("token");

      if(token != null){

          axios.get(import.meta.env.VITE_API_URL + "/api/users/me",{
              headers : {
                  Authorization: `Bearer ${token}`,
              },
          }).then((res)=>{
               
               setUser(res.data.user);
               setLoading(false);

          }).catch(()=>{

              toast.error("Session expired. Please login again");
              localStorage.removeItem("token");
              Navigate("/login");
              setUser(null);
              setLoading(false);
          })
      }else{
        setLoading(false);
      }
    },[]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/athlete/dashboard" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="RunResult Logo" className="h-18 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="athlete-nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user ? user.name : 'Loading...'}</p>
                  <p className="text-xs text-gray-500 leading-tight">Athlete</p>
                </div>
              </button>
              <UserDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
            </div>

            <button
              onClick={() => { setIsOpen(!isOpen); setDropdownOpen(false) }}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={17} />
                    {link.name}
                  </Link>
                )
              })}
              <div className="h-px bg-gray-100 my-2" />
             
              
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
