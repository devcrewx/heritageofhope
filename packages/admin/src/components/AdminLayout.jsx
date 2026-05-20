import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/settings', label: 'Site Settings' },
  { to: '/gallery', label: 'Gallery Manager' },
  { to: '/documents', label: 'Documents' },
  { to: '/partners', label: 'Partners' },
  { to: '/team', label: 'Team Members' },
  { to: '/activity-posts', label: 'Activity Posts' },
  { to: '/home', label: 'Home Page' },
  { to: '/about', label: 'About Page' },
  { to: '/our-work', label: 'Our Work' },
  { to: '/programs', label: 'Featured Programs' },
  { to: '/impact', label: 'Impact Page' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/contact', label: 'Contact Page' },
  { to: '/submissions', label: 'Form Submissions' },
  { to: '/thank-you', label: 'Thank You Page' },
  { to: '/not-found', label: 'Not Found Page' },
  { to: '/change-password', label: 'Change Password' },
]

function AdminLayout({ user, onLogout }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <aside style={{ borderRight: '1px solid #e5e7eb', padding: '1rem', background: '#f8fafc' }}>
        <h2 style={{ marginTop: 0 }}>Heritage Admin</h2>
        <p style={{ color: '#475569', marginTop: 0 }}>{user?.email || 'Signed in'}</p>
        <nav style={{ display: 'grid', gap: '0.5rem', marginTop: '1.25rem' }}>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '0.65rem 0.8rem',
                borderRadius: '0.55rem',
                color: isActive ? '#1e293b' : '#334155',
                background: isActive ? '#e2e8f0' : 'transparent',
                fontWeight: 600,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          style={{ marginTop: '1.5rem', border: 0, background: '#0f172a', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '0.55rem', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </aside>
      <main style={{ padding: '1.25rem 1.5rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
