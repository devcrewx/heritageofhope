import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Settings from './pages/Settings'
import HomeEditor from './pages/HomeEditor'
import { GalleryManager } from './pages/GalleryManager'
import DocumentsEditor from './pages/DocumentsEditor'
import PartnersEditor from './pages/PartnersEditor'
import TeamEditor from './pages/TeamEditor'
import ActivityPostsEditor from './pages/ActivityPostsEditor'
import AboutEditor from './pages/AboutEditor'
import ImpactEditor from './pages/ImpactEditor'
import GetInvolvedEditor from './pages/GetInvolvedEditor'
import OurWorkEditor from './pages/OurWorkEditor'
import ContactEditor from './pages/ContactEditor'
import ProgramsEditor from './pages/ProgramsEditor'
import SubmissionsInbox from './pages/SubmissionsInbox'
import ChangePassword from './pages/ChangePassword'
import ThankYouEditor from './pages/ThankYouEditor'
import NotFoundEditor from './pages/NotFoundEditor'

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

function App() {
  const { user, ready, isAuthenticated, login, logout } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} isAuthenticated={isAuthenticated} />} />
        <Route
          path="/"
          element={(
            <RequireAuth isAuthenticated={isAuthenticated} ready={ready}>
              <AdminLayout user={user} onLogout={logout} />
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
