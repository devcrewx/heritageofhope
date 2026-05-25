import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone, Calendar, Eye } from 'lucide-react'
import apiClient from '../lib/apiClient'

export default function SubmissionsInbox() {
  const [activeTab, setActiveTab] = useState('contact')
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState({ contact: 0, volunteer: 0, partner: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/api/admin/forms/stats')
      setStats(res.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchSubmissions = async (type) => {
    setLoading(true)
    try {
      const res = await apiClient.get('/api/admin/forms/submissions', {
        params: { type }
      })
      setSubmissions(res.data.data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchSubmissions('contact')
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    fetchSubmissions(tab)
    setSelectedSubmission(null)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderContactSubmission = (sub) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSubmission(sub)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{sub.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Mail size={14} /> {sub.email}
          </p>
          {sub.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={14} /> {sub.phone}
            </p>
          )}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={14} /> {formatDate(sub.createdAt)}
        </div>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2">{sub.message}</p>
    </div>
  )

  const renderVolunteerSubmission = (sub) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSubmission(sub)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{sub.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Mail size={14} /> {sub.email}
          </p>
          {sub.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={14} /> {sub.phone}
            </p>
          )}
          {sub.interest && (
            <p className="text-sm text-blue-600 mt-1">
              Interest: <span className="font-medium">{sub.interest}</span>
            </p>
          )}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={14} /> {formatDate(sub.createdAt)}
        </div>
      </div>
      {sub.message && <p className="text-sm text-gray-700 line-clamp-2">{sub.message}</p>}
    </div>
  )

  const renderPartnerSubmission = (sub) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSubmission(sub)}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{sub.organizationName}</h3>
          <p className="text-sm text-gray-600 mt-1">Contact: {sub.contactPerson}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Mail size={14} /> {sub.email}
          </p>
          {sub.phone && (
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={14} /> {sub.phone}
            </p>
          )}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar size={14} /> {formatDate(sub.createdAt)}
        </div>
      </div>
      {sub.inquiry && <p className="text-sm text-gray-700 line-clamp-2">{sub.inquiry}</p>}
    </div>
  )

  const renderSubmission = (sub) => {
    switch (activeTab) {
      case 'contact':
        return renderContactSubmission(sub)
      case 'volunteer':
        return renderVolunteerSubmission(sub)
      case 'partner':
        return renderPartnerSubmission(sub)
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Submissions</h1>
        <p className="text-gray-600">View and manage contact, volunteer, and partnership inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Submissions</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Contact Forms</p>
          <p className="text-3xl font-bold text-blue-600">{stats.contact}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Volunteer Forms</p>
          <p className="text-3xl font-bold text-green-600">{stats.volunteer}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Partnership Inquiries</p>
          <p className="text-3xl font-bold text-purple-600">{stats.partner}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabChange('contact')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact ({stats.contact})
          </button>
          <button
            onClick={() => handleTabChange('volunteer')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'volunteer'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Volunteer ({stats.volunteer})
          </button>
          <button
            onClick={() => handleTabChange('partner')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'partner'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Partnership ({stats.partner})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="mb-8">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No submissions yet</div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={`${activeTab}-${sub.id}`}>{renderSubmission(sub)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'contact' && selectedSubmission.name}
                {activeTab === 'volunteer' && selectedSubmission.name}
                {activeTab === 'partner' && selectedSubmission.organizationName}
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'contact' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </>
              )}

              {activeTab === 'volunteer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  {selectedSubmission.interest && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
                      <p className="text-gray-900">{selectedSubmission.interest}</p>
                    </div>
                  )}
                  {selectedSubmission.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'partner' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <p className="text-gray-900">{selectedSubmission.organizationName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <p className="text-gray-900">{selectedSubmission.contactPerson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  {selectedSubmission.inquiry && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.inquiry}</p>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                <p className="text-gray-600">{formatDate(selectedSubmission.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex gap-2">
              <button
                onClick={() => {
                  const email = selectedSubmission.email
                  window.location.href = `mailto:${email}`
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reply
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
