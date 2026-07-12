import { useState , useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StaffSidebar from '../../components/staff/StaffSidebar'
import RegisteredUsersPage from './modules/RegisteredUsersPage'
import StartListPage from './modules/StartListPage'
import HeatResultsPage from './modules/HeatResultsPage'
import FinalResultsPage from './modules/FinalResultsPage'
import CertificatePrintPage from './modules/CertificatePrintPage'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../../components/loader/Loader'


export default function StaffPage() {
  const [sidebarCollapsed] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();


    useEffect(
      ()=>{
        const token = localStorage.getItem("token");
  
        if(token == null){
  
          toast.error("Please login to access Staff panel");
          navigate("/login");
          return;
        }
  
  
        axios.get(import.meta.env.VITE_API_URL + "/api/users/me",{
            headers : {
                Authorization: `Bearer ${token}`,
            },
        }).then((res)=>{
            if(res.data.user.role !== "staff"){
              toast.error("You are not authorized to access Staff panel");
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


  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <StaffSidebar />
      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {userLoaded ? <Routes>
                <Route path="/registered-users" element={<RegisteredUsersPage />} />
                <Route path="/start-list" element={<StartListPage />} />
                <Route path="/heat-results" element={<HeatResultsPage />} />
                <Route path="/final-results" element={<FinalResultsPage />} />
                <Route path="/certificate-print" element={<CertificatePrintPage />} />
                <Route path="*" element={<RegisteredUsersPage />} />
              </Routes> : <Loader />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
