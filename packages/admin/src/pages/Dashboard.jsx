import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../lib/api'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    galleryPhotos: 0,
    teamMembers: 0,
    documents: 0,
    activityPosts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [gallery, team, docs, posts] = await Promise.all([
          apiClient.get('/api/admin/gallery').catch(() => ({ data: { items: [] } })),
          apiClient.get('/api/admin/team').catch(() => ({ data: [] })),
          apiClient.get('/api/admin/documents').catch(() => ({ data: [] })),
          apiClient.get('/api/admin/activity-posts').catch(() => ({ data: [] })),
        ])

        setStats({
          galleryPhotos: gallery.data.items?.length || gallery.data.length || 0,
          teamMembers: team.data.length || 0,
          documents: docs.data.length || 0,
          activityPosts: posts.data.length || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const quickLinks = [
    { label: 'Site Settings', action: () => navigate('/settings'), description: 'Phone, email, address, links' },
    { label: 'Home Page', action: () => navigate('/home'), description: 'Hero, stats, mission section' },
    { label: 'About Page', action: () => navigate('/about'), description: 'Story, values, team, documents' },
    { label: 'Impact Page', action: () => navigate('/impact'), description: 'Fund allocation, testimonials' },
    { label: 'Get Involved', action: () => navigate('/get-involved'), description: 'Donations, volunteer roles' },
    { label: 'Contact Page', action: () => navigate('/contact'), description: 'Phone, email, location' },
    { label: 'Change Password', action: () => navigate('/change-password'), description: 'Update the admin account password' },
  ]

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Heritage of Hope admin panel. Below are quick stats and links to edit each section.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Gallery Photos</p>
          <p className="text-3xl font-bold text-gray-900">{stats.galleryPhotos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
          <p className="text-3xl font-bold text-gray-900">{stats.teamMembers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Documents</p>
          <p className="text-3xl font-bold text-gray-900">{stats.documents}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Activity Posts</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activityPosts}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Edit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
            >
              <p className="font-semibold text-gray-900">{link.label}</p>
              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Start with <strong>Site Settings</strong> — fill in phone, email, address</li>
          <li>Then edit <strong>Home Page</strong> — update hero text and stats</li>
          <li>Finally, use <strong>Gallery</strong> to upload photos</li>
        </ol>
      </div>
    </section>
  )
}

export default Dashboard
