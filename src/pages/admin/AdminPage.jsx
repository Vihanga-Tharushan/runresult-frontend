import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import DashboardPage from './modules/DashboardPage'
import ChampionshipsPage from './modules/ChampionshipsPage'
import FormsPage from './modules/FormsPage'
import GoogleSheetsPage from './modules/GoogleSheetsPage'
import CertificatesPage from './modules/CertificatesPage'
import UsersPage from './modules/UsersPage'
import RegisteredAthletesPage from './modules/RegisteredAthletesPage'
import SettingsPage from './modules/SettingsPage'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../../components/loader/Loader'

export default function AdminPage() {

  const navigate = useNavigate();
  const [userLoaded, setUserLoaded] = useState(false)

  useEffect(
    ()=>{
      const token = localStorage.getItem("token");

      if(token == null){

        toast.error("Please login to access admin panel");
        navigate("/login");
        return;
      }


      axios.get(import.meta.env.VITE_API_URL + "/api/users/me",{
          headers : {
              Authorization: `Bearer ${token}`,
          },
      }).then((res)=>{
          if(res.data.user.role !== "admin"){
            toast.error("You are not authorized to access admin panel");
            navigate("/");
            return;
          }

          setUserLoaded(true);

      }).catch(()=>{
          toast.error("Session expired. Please login again");
          localStorage.removeItem("token");
          navigate("/login");
      })
      
    },[]
  )

  const [sidebarCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <AdminSidebar />
      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <AdminHeader />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {userLoaded? <Routes path="/">
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/championships" element={<ChampionshipsPage />} />
                <Route path="/registered-athletes" element={<RegisteredAthletesPage />} />
                <Route path="/forms" element={<FormsPage />} />
                <Route path="/google-sheets" element={<GoogleSheetsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<DashboardPage />} />
              </Routes>:<Loader/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
