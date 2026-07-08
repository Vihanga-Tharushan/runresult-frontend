import { useLocation } from 'react-router-dom'

const pageMeta = {
  '/staff/registered-users': { title: 'Registered Users', desc: 'Manage athlete registration data for the selected championship.' },
  '/staff/start-list': { title: 'Start List', desc: 'Arrange lane assignments and athlete positions for events.' },
  '/staff/heat-results': { title: 'Heat Results', desc: 'Enter performances, timings, and qualification status for heats.' },
  '/staff/final-results': { title: 'Final Results', desc: 'Edit final rankings, medals, records, and performance values.' },
}

export default function StaffHeader({ title, description }) {
  const location = useLocation()
  const meta = pageMeta[location.pathname] || {}
  return (
    <div className="mb-6">
      <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">{title || meta.title}</h1>
      <p className="text-sm text-[#64748B] mt-1">{description || meta.desc}</p>
    </div>
  )
}
