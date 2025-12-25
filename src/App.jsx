import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import MethodologyPage from './components/MethodologyPage'
import LandingPage from './components/LandingPage'
import SurveyForm from './components/SurveyForm'
import CookiePolicyPage from './components/CookiePolicyPage'
import DashboardPage from './components/DashboardPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-notion-bg text-notion-text">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/survey" element={<LandingPage />} />
          <Route path="/survey/form" element={<SurveyForm />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
