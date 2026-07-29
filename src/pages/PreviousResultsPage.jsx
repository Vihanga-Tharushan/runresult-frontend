import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, FileText, Table, Link as LinkIcon, Download, ExternalLink, Search } from 'lucide-react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import AthleteNavbar from '../components/AthleteNavbar'
import Footer from '../components/Footer'

const API = import.meta.env.VITE_API_URL

const resultTypeConfig = {
  pdf: { label: 'PDF', color: 'bg-red-50 text-red-600 border-red-100', icon: FileText },
  spreadsheet: { label: 'Spreadsheet', color: 'bg-green-50 text-green-600 border-green-100', icon: Table },
  drive: { label: 'Google Drive', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: LinkIcon },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function PreviousResultsPage() {
  const [previousResults, setPreviousResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get(API + '/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data.user)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    axios.get(API + '/api/previous-results')
      .then(res => setPreviousResults(res.data.previousResults))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const Nav = user?.role === 'athlete' ? AthleteNavbar : Navbar

  const filteredResults = previousResults.filter(r =>
    r.championshipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.venue.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Nav />

      <section className="pt-24 lg:pt-28 pb-8 lg:pb-10 bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl sm:text-4xl lg:text-3xl font-extrabold text-primary mt-2">
              Previous Results
            </h3>
          </motion.div>
        </div>
      </section>

      <section className="pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-10"
          >
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search championships..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-32 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-50 rounded w-1/2" />
                      <div className="h-3 bg-gray-50 rounded w-2/3" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-9 bg-gray-100 rounded-xl w-1/2" />
                        <div className="h-9 bg-gray-50 rounded-xl w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">
                  {searchQuery ? 'No results found' : 'No previous results available'}
                </h3>
                <p className="text-sm text-[#64748B] max-w-sm">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Archived championship results will appear here.'}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredResults.map((result, index) => {
                  const typeInfo = resultTypeConfig[result.resultType] || resultTypeConfig.pdf
                  const TypeIcon = typeInfo.icon
                  return (
                    <motion.div
                      key={result._id}
                      {...fadeUp}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-32 overflow-hidden bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <TypeIcon size={40} className="text-primary/20" />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeInfo.color}`}>
                            <TypeIcon size={12} />
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {result.championshipName}
                        </h3>

                        <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                          <p className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary shrink-0" />
                            <span className="truncate">{result.venue}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-primary shrink-0" />
                            <span>{new Date(result.fromDate).toLocaleDateString()} - {new Date(result.toDate).toLocaleDateString()}</span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/previous-results/${result._id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A] transition-all duration-200"
                          >
                            View Details
                          </Link>
                          {result.resultType === 'drive' ? (
                            <a
                              href={result.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all duration-200"
                            >
                              <ExternalLink size={14} /> Open Result
                            </a>
                          ) : (
                            <a
                              href={result.fileUrl}
                              download
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all duration-200"
                            >
                              <Download size={14} /> Download
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}
