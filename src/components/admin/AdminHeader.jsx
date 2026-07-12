import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/championships': 'Championships',
  '/admin/registered-athletes': 'Registered Athletes',
  '/admin/forms': 'Registration Forms',
  '/admin/google-sheets': 'Google Sheets',
  '/admin/certificates': 'Certificate Printing',
  '/admin/users': 'User Management',
  '/admin/settings': 'Settings',
}

export default function AdminHeader({ title, action }) {
  const location = useLocation()
  const pageTitle = title || pageTitles[location.pathname] || 'Admin'

  return (
    <div className="flex items-center justify-between mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">{pageTitle}</h1>
        <p className="text-sm text-[#64748B] mt-1">
          {location.pathname === '/admin/dashboard' && 'Overview of your sports management platform'}
          {location.pathname === '/admin/championships' && 'Create and manage championships'}
          {location.pathname === '/admin/registered-athletes' && 'View and manage athlete registrations by championship'}
          {location.pathname === '/admin/forms' && 'Configure registration forms for championships'}
          {location.pathname === '/admin/google-sheets' && 'Integrate Google Sheets for data management'}
          {location.pathname === '/admin/certificates' && 'Manage certificate printing and templates'}
          {location.pathname === '/admin/users' && 'Manage staff accounts'}
          {location.pathname === '/admin/settings' && 'Configure system settings'}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
