import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import AthleteDashboard from './pages/AthleteDashboard'
import ResultsPage from './pages/ResultsPage'
import ChampionshipDetailPage from './pages/ChampionshipDetailPage'
import ChampionshipsPage from './pages/ChampionshipsPage'
import ChampionshipRegistrationPage from './pages/ChampionshipRegistrationPage'
import ScrollToTop from './components/ScrollToTop'
import AthleteResults from './pages/AthleteResult'
import AthletePage from './pages/Athlete'
import AdminPage from './pages/admin/AdminPage'
import StaffPage from './pages/staff/StaffPage'
import TestPage from './pages/test/test'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ForgetPassword from './pages/Forget-Password'
import { GoogleOAuthProvider } from '@react-oauth/google'


export default function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/athlete/*" element={<AthletePage />} />
            <Route path= "/admin/*" element={<AdminPage />} />
            <Route path= "/staff/*" element={<StaffPage />} />
            <Route path="/results/:championshipId" element={<ChampionshipDetailPage />} />
            <Route path="/championships/:championshipId" element={<ChampionshipRegistrationPage />} />
            <Route path="/test" element={<TestPage/>}/>
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
      </div>
    </GoogleOAuthProvider>
    </Router>
  )
}
