import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { createContext, lazy, Suspense, useEffect, useState } from 'react'
import AdminLayout from './components/AdminLayout'
import { useAuth } from './hooks/useAuth'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Settings = lazy(() => import('./pages/Settings'))
const HomeEditor = lazy(() => import('./pages/HomeEditor'))
const GalleryManager = lazy(() => import('./pages/GalleryManager').then(m => ({ default: m.GalleryManager })))
const DocumentsEditor = lazy(() => import('./pages/DocumentsEditor'))
const PartnersEditor = lazy(() => import('./pages/PartnersEditor'))
const TeamEditor = lazy(() => import('./pages/TeamEditor'))
const ActivityPostsEditor = lazy(() => import('./pages/ActivityPostsEditor'))
const AboutEditor = lazy(() => import('./pages/AboutEditor'))
const ImpactEditor = lazy(() => import('./pages/ImpactEditor'))
const GetInvolvedEditor = lazy(() => import('./pages/GetInvolvedEditor'))
const OurWorkEditor = lazy(() => import('./pages/OurWorkEditor'))
const ContactEditor = lazy(() => import('./pages/ContactEditor'))
const ProgramsEditor = lazy(() => import('./pages/ProgramsEditor'))
const SubmissionsInbox = lazy(() => import('./pages/SubmissionsInbox'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const ThankYouEditor = lazy(() => import('./pages/ThankYouEditor'))
const NotFoundEditor = lazy(() => import('./pages/NotFoundEditor'))

const SiteContentContext = createContext(null)

export { SiteContentContext }

function RequireAuth({ isAuthenticated, ready, children }) {
  if (!ready) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p>Checking session...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PageLoader() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <p>Loading...</p>
    </main>
  )
}

function App() {
  const { user, ready, isAuthenticated, login, logout } = useAuth()
  const [fullSiteContent, setFullSiteContent] = useState(null)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || ''
    fetch(`${apiBase}/api/content`)
      .then(r => r.json())
      .then(d => setFullSiteContent(d.data || d))
      .catch(() => {
        fetch('/content-fallback.json')
          .then(r => r.json())
          .then(setFullSiteContent)
          .catch(() => {})
      })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login onLogin={login} isAuthenticated={isAuthenticated} /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
        <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
        <Route
          path="/"
          element={(
            <RequireAuth isAuthenticated={isAuthenticated} ready={ready}>
              <Suspense fallback={<PageLoader />}>
                <SiteContentContext.Provider value={fullSiteContent}>
                  <AdminLayout user={user} onLogout={logout} />
                </SiteContentContext.Provider>
              </Suspense>
            </RequireAuth>
          )}
        >
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="partners" element={<PartnersEditor />} />
          <Route path="team" element={<TeamEditor />} />
          <Route path="documents" element={<DocumentsEditor />} />
          <Route path="activity-posts" element={<ActivityPostsEditor />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="our-work" element={<OurWorkEditor />} />
          <Route path="programs" element={<ProgramsEditor />} />
          <Route path="impact" element={<ImpactEditor />} />
          <Route path="get-involved" element={<GetInvolvedEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="submissions" element={<SubmissionsInbox />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="thank-you" element={<ThankYouEditor />} />
          <Route path="not-found" element={<NotFoundEditor />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
