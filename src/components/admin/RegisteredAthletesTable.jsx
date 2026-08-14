import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Eye, X, Mail, Hash,
  SlidersHorizontal, User, Save, Loader2,
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
const PAGE_SIZE = 25

function resolveEventName(eventId, championshipEvents) {
  if (championshipEvents && eventId !== undefined && eventId !== null) {
    const idx = Number(eventId)
    if (!isNaN(idx) && championshipEvents[idx]) return championshipEvents[idx]
  }
  return eventId
}

const sortIcons = {
  asc: ChevronUp,
  desc: ChevronDown,
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="min-w-[140px]">
      <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-[#0F172A] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

export default function RegisteredAthletesTable({ registrations, loading, championship, onUpdate }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    event: '',
    ageCategory: '',
    gender: '',
    district: '',
    institution: '',
    paymentStatus: '',
    registrationStatus: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortKey, setSortKey] = useState('bibNumber')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [detailReg, setDetailReg] = useState(null)

  const filterOptions = useMemo(() => {
    const events = new Set()
    const ageCategories = new Set()
    const genders = new Set()
    const districts = new Set()
    const institutions = new Set()

    registrations.forEach(r => {
      ;(r.selectedEvents || []).forEach(e => events.add(resolveEventName(e, championship?.selectedEvents)))
      if (r.ageCategory) ageCategories.add(r.ageCategory)
      if (r.gender) genders.add(r.gender)
      if (r.address?.district) districts.add(r.address.district)
      if (r.institution) institutions.add(r.institution)
    })

    return {
      events: [...events].sort(),
      ageCategories: [...ageCategories].sort(),
      genders: [...genders].sort(),
      districts: [...districts].sort(),
      institutions: [...institutions].sort(),
    }
  }, [registrations])

  const filtered = useMemo(() => {
    let result = [...registrations]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        (r.bibNumber || '').toLowerCase().includes(q) ||
        (r.fullName || '').toLowerCase().includes(q) ||
        (r.nameWithInitials || '').toLowerCase().includes(q) ||
        (r.athleteEmail || '').toLowerCase().includes(q) ||
        (r.mobile || '').toLowerCase().includes(q)
      )
    }

    if (filters.event) {
      result = result.filter(r =>
        (r.selectedEvents || []).some(e => resolveEventName(e, championship?.selectedEvents) === filters.event)
      )
    }
    if (filters.ageCategory) result = result.filter(r => r.ageCategory === filters.ageCategory)
    if (filters.gender) result = result.filter(r => r.gender === filters.gender)
    if (filters.district) result = result.filter(r => r.address?.district === filters.district)
    if (filters.institution) result = result.filter(r => r.institution === filters.institution)
    if (filters.paymentStatus) result = result.filter(r => r.paymentStatus === filters.paymentStatus)
    if (filters.registrationStatus) result = result.filter(r => r.registrationStatus === filters.registrationStatus)

    result.sort((a, b) => {
      let valA, valB
      switch (sortKey) {
        case 'bibNumber':
          valA = parseInt(a.bibNumber) || 0
          valB = parseInt(b.bibNumber) || 0
          break
        case 'fullName':
          valA = (a.fullName || '').toLowerCase()
          valB = (b.fullName || '').toLowerCase()
          break
        case 'ageCategory':
          valA = (a.ageCategory || '').toLowerCase()
          valB = (b.ageCategory || '').toLowerCase()
          break
        case 'institution':
          valA = (a.institution || '').toLowerCase()
          valB = (b.institution || '').toLowerCase()
          break
        case 'createdAt':
          valA = new Date(a.createdAt || 0).getTime()
          valB = new Date(b.createdAt || 0).getTime()
          break
        default:
          valA = 0
          valB = 0
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [registrations, search, filters, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ event: '', ageCategory: '', gender: '', district: '', institution: '', paymentStatus: '', registrationStatus: '' })
    setSearch('')
    setPage(1)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (search.trim() ? 1 : 0)

  const SortHeader = ({ label, sortKey: key, className = '' }) => {
    const isActive = sortKey === key
    const Icon = isActive ? sortIcons[sortDir] : null
    return (
      <th
        className={`text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider cursor-pointer select-none hover:text-[#0F172A] transition-colors ${className}`}
        onClick={() => handleSort(key)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {isActive ? <Icon size={12} className="text-primary" /> : <span className="w-3" />}
        </span>
      </th>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
        <div className="px-5 py-4 border-b border-gray-100 flex gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-100 rounded w-1/8" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-gray-50 last:border-0 flex gap-4">
            {Array.from({ length: 8 }).map((_, j) => (
              <div key={j} className="h-3 bg-gray-50 rounded w-1/8" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No registrations yet"
        description="No athletes have registered for this championship yet."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by bib number, name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-gray-200 bg-white text-[#64748B] hover:text-[#0F172A] hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#64748B] hover:text-red-500 transition-colors font-medium whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                <FilterSelect
                  label="Event"
                  value={filters.event}
                  onChange={(v) => handleFilterChange('event', v)}
                  options={filterOptions.events}
                />
                <FilterSelect
                  label="Age Category"
                  value={filters.ageCategory}
                  onChange={(v) => handleFilterChange('ageCategory', v)}
                  options={filterOptions.ageCategories}
                />
                <FilterSelect
                  label="Gender"
                  value={filters.gender}
                  onChange={(v) => handleFilterChange('gender', v)}
                  options={filterOptions.genders}
                />
                <FilterSelect
                  label="District"
                  value={filters.district}
                  onChange={(v) => handleFilterChange('district', v)}
                  options={filterOptions.districts}
                />
                <FilterSelect
                  label="Club / School"
                  value={filters.institution}
                  onChange={(v) => handleFilterChange('institution', v)}
                  options={filterOptions.institutions}
                />
                <FilterSelect
                  label="Payment"
                  value={filters.paymentStatus}
                  onChange={(v) => handleFilterChange('paymentStatus', v)}
                  options={['pending', 'paid', 'failed']}
                />
                <FilterSelect
                  label="Registration"
                  value={filters.registrationStatus}
                  onChange={(v) => handleFilterChange('registrationStatus', v)}
                  options={['pending', 'approved', 'rejected']}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{filtered.length}</span> athlete{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <SortHeader label="Bib #" sortKey="bibNumber" className="w-20" />
                <SortHeader label="Full Name" sortKey="fullName" />
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Gender</th>
                <SortHeader label="Age Cat." sortKey="ageCategory" />
                <SortHeader label="Club / School" sortKey="institution" />
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Events</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Payment</th>
                <SortHeader label="Registered" sortKey="createdAt" />
                <th className="w-16 px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((reg, index) => (
                <motion.tr
                  key={reg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center w-10 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {reg.bibNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {reg.fullName ? reg.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{reg.fullName || '—'}</p>
                        <p className="text-xs text-[#64748B] truncate">{reg.nameWithInitials || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{reg.gender || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">{reg.ageCategory || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#64748B] max-w-[180px] truncate" title={reg.institution}>{reg.institution || '—'}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(reg.selectedEvents || []).slice(0, 3).map(e => (
                        <span key={e} className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-[#64748B]">
                          {resolveEventName(e, championship?.selectedEvents)}
                        </span>
                      ))}
                      {(reg.selectedEvents || []).length > 3 && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
                          +{reg.selectedEvents.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={reg.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 text-xs text-[#64748B]">
                    {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setDetailReg(reg)}
                      className="p-2 rounded-lg text-[#64748B] hover:text-primary hover:bg-primary/10 transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-[#64748B]">
              Showing {((safePage - 1) * PAGE_SIZE) + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-1 text-xs text-[#64748B]">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        p === safePage
                          ? 'bg-primary text-white'
                          : 'text-[#64748B] hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailReg && (
          <RegistrationDetailModal
            registration={detailReg}
            championship={championship}
            onClose={() => setDetailReg(null)}
            onUpdate={onUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function RegistrationDetailModal({ registration: reg, championship, onClose, onUpdate }) {
  const [form, setForm] = useState({
    fullName: reg.fullName || '',
    nameWithInitials: reg.nameWithInitials || '',
    gender: reg.gender || '',
    dateOfBirth: reg.dateOfBirth || '',
    ageCategory: reg.ageCategory || '',
    nic: reg.nic || '',
    athleteEmail: reg.athleteEmail || '',
    mobile: reg.mobile || '',
    institution: reg.institution || '',
    district: reg.address?.district || '',
    addressLine1: reg.address?.addressLine1 || '',
    addressLine2: reg.address?.addressLine2 || '',
    selectedEvents: [...(reg.selectedEvents || [])],
    totalFee: reg.totalFee || 0,
    receiptNumber: reg.receiptNumber || '',
    paymentStatus: reg.paymentStatus || 'pending',
    registrationStatus: reg.registrationStatus || 'pending',
  })
  const [saving, setSaving] = useState(false)

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleEvent = (id) => {
    setForm(prev => {
      const selected = prev.selectedEvents.includes(id)
        ? prev.selectedEvents.filter(e => e !== id)
        : [...prev.selectedEvents, id]
      return { ...prev, selectedEvents: selected }
    })
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    try {
      const res = await axios.put(API + `/api/registrations/${reg._id}`, {
        fullName: form.fullName,
        nameWithInitials: form.nameWithInitials,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        ageCategory: form.ageCategory,
        nic: form.nic,
        athleteEmail: form.athleteEmail,
        mobile: form.mobile,
        institution: form.institution,
        address: {
          district: form.district,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
        },
        selectedEvents: form.selectedEvents,
        totalFee: Number(form.totalFee) || 0,
        receiptNumber: form.receiptNumber,
        paymentStatus: form.paymentStatus,
        registrationStatus: form.registrationStatus,
      }, { headers: authHeaders() })
      toast.success('Registration updated successfully')
      onUpdate?.(res.data.registration)
      onClose()
    } catch {
      toast.error('Failed to update registration')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
  const selectClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0F172A] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              {reg.bibNumber}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{reg.fullName}</h3>
              <p className="text-xs text-[#64748B]">{reg.registrationNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Payment:</span>
              <StatusBadge status={form.paymentStatus} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Registration:</span>
              <StatusBadge status={form.registrationStatus} />
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <User size={14} className="text-primary" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Full Name" required>
                <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Name with Initials">
                <input type="text" value={form.nameWithInitials} onChange={e => update('nameWithInitials', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Gender" required>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} className={selectClass}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </EditField>
              <EditField label="Date of Birth" required>
                <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Age Category">
                <input type="text" value={form.ageCategory} onChange={e => update('ageCategory', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="NIC">
                <input type="text" value={form.nic} onChange={e => update('nic', e.target.value)} className={inputClass} />
              </EditField>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField label="Email" required>
                <input type="email" value={form.athleteEmail} onChange={e => update('athleteEmail', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Mobile" required>
                <input type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Club / School / Institute">
                <input type="text" value={form.institution} onChange={e => update('institution', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="District">
                <input type="text" value={form.district} onChange={e => update('district', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Address Line 1">
                <input type="text" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Address Line 2">
                <input type="text" value={form.addressLine2} onChange={e => update('addressLine2', e.target.value)} className={inputClass} />
              </EditField>
            </div>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <Hash size={14} className="text-primary" />
              Selected Events ({form.selectedEvents.length})
            </h4>
            {championship?.selectedEvents?.length ? (
              <div className="flex flex-wrap gap-2">
                {championship.selectedEvents.map((eventName, idx) => {
                  const id = String(idx)
                  const checked = form.selectedEvents.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleEvent(id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        checked
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-white border-gray-200 text-[#64748B] hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'}`} />
                      {eventName}
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">
                {(reg.selectedEvents || []).map(e => resolveEventName(e, championship?.selectedEvents)).join(', ') || 'No events selected'}
              </p>
            )}
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-3">Payment Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <EditField label="Receipt Number">
                <input type="text" value={form.receiptNumber} onChange={e => update('receiptNumber', e.target.value)} className={inputClass} placeholder="Cash deposit receipt no." />
              </EditField>
              <EditField label="Total Fee (Rs.)">
                <input type="number" value={form.totalFee} onChange={e => update('totalFee', e.target.value)} className={inputClass} />
              </EditField>
              <EditField label="Payment Status">
                <select value={form.paymentStatus} onChange={e => update('paymentStatus', e.target.value)} className={selectClass}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </EditField>
              <EditField label="Registration Status">
                <select value={form.registrationStatus} onChange={e => update('registrationStatus', e.target.value)} className={selectClass}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </EditField>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Registered On</p>
                <p className="text-sm text-[#0F172A]">
                  {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A] transition-all duration-200"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

function EditField({ label, required, children }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}
