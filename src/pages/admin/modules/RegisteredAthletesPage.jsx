import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Trophy, Search, Printer } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import RegisteredAthletesTable from '../../../components/admin/RegisteredAthletesTable'
import EmptyState from '../../../components/admin/EmptyState'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function RegisteredAthletesPage() {
  const [championships, setChampionships] = useState([])
  const [selectedChampionshipId, setSelectedChampionshipId] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loadingChamps, setLoadingChamps] = useState(true)
  const [loadingRegs, setLoadingRegs] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships || []))
      .catch(() => toast.error('Failed to load championships'))
      .finally(() => setLoadingChamps(false))
  }, [])

  useEffect(() => {
    if (!selectedChampionshipId) {
      setRegistrations([])
      return
    }
    setLoadingRegs(true)
    axios.get(API + `/api/registrations/championship/${selectedChampionshipId}`, { headers: authHeaders() })
      .then(res => setRegistrations(res.data.registrations || []))
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoadingRegs(false))
  }, [selectedChampionshipId])

  const selectedChamp = championships.find(c => c.championship_id === selectedChampionshipId || c._id === selectedChampionshipId)

  const filteredChamps = useMemo(() => {
    if (!searchQuery.trim()) return championships
    const q = searchQuery.toLowerCase()
    return championships.filter(c => c.name.toLowerCase().includes(q))
  }, [championships, searchQuery])

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const champName = selectedChamp?.name || 'Championship'
    const champEvents = selectedChamp?.selectedEvents || []

    const rows = registrations.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${r.bibNumber || ''}</strong></td>
        <td>${r.fullName || ''}</td>
        <td>${r.nameWithInitials || ''}</td>
        <td>${r.gender || ''}</td>
        <td>${r.ageCategory || ''}</td>
        <td>${r.institution || ''}</td>
        <td>${r.address?.district || ''}</td>
        <td>${(r.selectedEvents || []).map(e => { const idx = Number(e); return (!isNaN(idx) && champEvents[idx]) ? champEvents[idx] : e }).join(', ')}</td>
        <td>${r.eventCount || r.selectedEvents?.length || 0}</td>
        <td>${(r.paymentStatus || '').charAt(0).toUpperCase() + (r.paymentStatus || '').slice(1)}</td>
        <td>${r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : ''}</td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registered Athletes - ${champName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', Arial, sans-serif; padding: 24px; color: #0F172A; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #0342B3; padding-bottom: 16px; }
          .header h1 { font-size: 20px; font-weight: 800; color: #0342B3; }
          .header p { font-size: 12px; color: #64748B; margin-top: 4px; }
          .meta { display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background: #F1F5F9; text-align: left; padding: 8px 10px; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; border-bottom: 2px solid #E2E8F0; }
          td { padding: 7px 10px; border-bottom: 1px solid #F1F5F9; }
          tr:nth-child(even) { background: #FAFBFC; }
          @media print {
            body { padding: 16px; }
            @page { margin: 1cm; size: landscape; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Registered Athletes</h1>
          <p>${champName}</p>
        </div>
        <div class="meta">
          <span>Total Athletes: <strong>${registrations.length}</strong></span>
          <span>Printed on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Bib #</th><th>Full Name</th><th>Name w/ Initials</th>
              <th>Gender</th><th>Age Cat.</th><th>Club / School</th><th>District</th>
              <th>Events</th><th>No. Events</th><th>Payment</th><th>Date</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Championship Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
        <label className="block text-sm font-bold text-[#0F172A] mb-3">Select Championship</label>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <span className={selectedChamp ? 'text-[#0F172A] font-medium' : 'text-[#94A3B8]'}>
              {selectedChamp ? selectedChamp.name : 'Choose a championship...'}
            </span>
            <ChevronDown size={16} className={`text-[#64748B] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
            >
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search championships..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {loadingChamps ? (
                  <div className="p-4 text-center text-sm text-[#64748B]">Loading...</div>
                ) : filteredChamps.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[#64748B]">No championships found</div>
                ) : (
                  filteredChamps.map(c => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setSelectedChampionshipId(c.championship_id || c._id)
                        setDropdownOpen(false)
                        setSearchQuery('')
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        (c.championship_id || c._id) === selectedChampionshipId ? 'bg-primary/5 text-primary font-semibold' : 'text-[#0F172A]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {c.banner ? (
                          <img src={c.banner} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Trophy size={14} className="text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-xs text-[#64748B] truncate">{c.athleteCount || 0} athletes · {c.eventCount || 0} events</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* No championship selected state */}
      {!selectedChampionshipId && !loadingChamps && (
        <EmptyState
          icon="trophy"
          title="Select a Championship"
          description="Please select a championship above to view registered athletes."
        />
      )}

      {/* Loading state */}
      {loadingRegs && selectedChampionshipId && (
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
      )}

      {/* Table */}
      {selectedChampionshipId && !loadingRegs && (
        <div>
          <div className="flex items-center justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <Printer size={15} />
              Print Athletes
            </motion.button>
          </div>
          <RegisteredAthletesTable
            registrations={registrations}
            loading={loadingRegs}
            championship={selectedChamp}
          />
        </div>
      )}
    </div>
  )
}
