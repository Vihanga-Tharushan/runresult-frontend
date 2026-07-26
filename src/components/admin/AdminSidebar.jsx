import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Trophy, FileText, Table, Printer,
  Users, Settings, Medal,
  LogOut, UserCircle, PanelRightClose, PanelRightOpen,
} from 'lucide-react'

function getUserFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return { name: 'User', email: '' }
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return { name: 'User', email: '' }
  }
}

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Championships', path: '/admin/championships', icon: Trophy },
  { name: 'Registered Athletes', path: '/admin/registered-athletes', icon: Medal },
  { name: 'Registration Forms', path: '/admin/forms', icon: FileText },
  { name: 'Google Sheets', path: '/admin/google-sheets', icon: Table },
  { name: 'Certificate Printing', path: '/admin/certificates', icon: Printer },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Previous Results', path: '/admin/previous-results', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUserFromToken()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-[#E2E8F0] z-50 flex flex-col shadow-sm"
    >
      <div className="flex items-center justify-between h-16 lg:h-20 px-4 border-b border-[#E2E8F0]">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <img src="/logo.png" alt="RunResult" className="h-12 w-auto" />
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center w-full"
            >
              <img src="/logo.png" alt="RunResult" className="h-7 w-auto" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 transition-colors"
        >
          {collapsed ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#0F172A] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#E2E8F0] p-2 space-y-1">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === '/admin/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50'
          }`}
        >
          <UserCircle size={20} className="shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between flex-1 min-w-0"
              >
                <div className="truncate">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full">
          <LogOut size={20} className="shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
