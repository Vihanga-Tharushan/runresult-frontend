import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, FileText, Table, Link as LinkIcon, Download, ExternalLink } from 'lucide-react'
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

export default function PreviousResultDetailPage() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get(API + '/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data.user)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get(API + `/api/previous-results/${id}`)
      .then(res => setResult(res.data.previousResult))
      .catch(() => setResult(null))
      .finally(() => setLoading(false))
  }, [id])

  const Nav = user?.role === 'athlete' ? AthleteNavbar : Navbar

  if (loading) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Nav />
        <div className="pt-20 lg:pt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-100 rounded w-48" />
              <div className="h-64 bg-gray-100 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
                <div className="h-3 bg-gray-50 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </motion.main>
    )
  }

  if (!result) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Nav />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-20 lg:pt-24">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">Result Not Found</h2>
          <p className="text-sm text-[#64748B] mb-6">The previous result you are looking for does not exist.</p>
          <Link
            to="/previous-results"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Previous Results
          </Link>
        </div>
        <Footer />
      </motion.main>
    )
  }

  const typeInfo = resultTypeConfig[result.resultType] || resultTypeConfig.pdf
  const TypeIcon = typeInfo.icon

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Nav />

      <div className="pt-20 lg:pt-24">
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link
                to="/previous-results"
                className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <ArrowLeft size={16} /> Back to Previous Results
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <TypeIcon size={56} className="text-primary/20" />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border ${typeInfo.color}`}>
                    <TypeIcon size={14} />
                    {typeInfo.label}
                  </span>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-4">
                  {result.championshipName}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span>{result.venue}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-primary shrink-0" />
                    <span>{new Date(result.fromDate).toLocaleDateString()} - {new Date(result.toDate).toLocaleDateString()}</span>
                  </p>
                </div>

                {result.description && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#0F172A] mb-2">Description</h2>
                    <p className="text-sm text-[#64748B] leading-relaxed">{result.description}</p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-[#0F172A] mb-4">Result Document</h2>

                  {result.resultType === 'pdf' && result.fileUrl && (
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <iframe
                          src={result.fileUrl}
                          className="w-full h-[600px]"
                          title="PDF Preview"
                        />
                      </div>
                      <a
                        href={result.fileUrl}
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200"
                      >
                        <Download size={16} /> Download PDF
                      </a>
                    </div>
                  )}

                  {result.resultType === 'spreadsheet' && result.fileUrl && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <iframe
                          src={`https://viewered.azurewebsites.net/viewer?src=${encodeURIComponent(result.fileUrl)}`}
                          className="w-full h-[600px]"
                          title="Spreadsheet Preview"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <a
                        href={result.fileUrl}
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200"
                      >
                        <Download size={16} /> Download Spreadsheet
                      </a>
                    </div>
                  )}

                  {result.resultType === 'drive' && result.driveLink && (
                    <div className="space-y-4">
                      {(() => {
                        const driveMatch = result.driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/)
                        if (driveMatch) {
                          const embedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`
                          return (
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                              <iframe
                                src={embedUrl}
                                className="w-full h-[600px]"
                                title="Google Drive Preview"
                              />
                            </div>
                          )
                        }
                        return null
                      })()}
                      <a
                        href={result.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200"
                      >
                        <ExternalLink size={16} /> Open in Google Drive
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-xs text-[#94A3B8]">
                  Uploaded on {new Date(result.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </motion.main>
  )
}
