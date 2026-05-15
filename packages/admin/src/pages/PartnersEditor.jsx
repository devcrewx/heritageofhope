import React, { useState, useEffect } from 'react';
import { Trash2, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { apiClient } from '../api';

export default function PartnersEditor() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    file: null
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/partners');
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
      alert('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', isActive: true, file: null });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a partner name');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('isActive', formData.isActive);
      if (formData.file) {
        data.append('file', formData.file);
      }

      if (editingId) {
        await apiClient.patch(`/admin/partners/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await apiClient.post('/admin/partners', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      await loadPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Failed to save partner');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setEditingId(partner.id);
    setFormData({
      name: partner.name,
      isActive: partner.isActive,
      file: null
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this partner? This cannot be undone.')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/admin/partners/${id}`);
      await loadPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Failed to delete partner');
    } finally {
      setLoading(false);
    }
  };

  const movePartner = async (id, direction) => {
    const index = partners.findIndex(p => p.id === id);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === partners.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedPartners = [...partners];
    [updatedPartners[index], updatedPartners[newIndex]] = [updatedPartners[newIndex], updatedPartners[index]];

    try {
      setLoading(true);
      await apiClient.patch('/admin/partners/reorder', {
        partners: updatedPartners.map((p, i) => ({
          id: p.id,
          sortOrder: i
        }))
      });
      setPartners(updatedPartners);
    } catch (error) {
      console.error('Error reordering partners:', error);
      alert('Failed to reorder partners');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Partners</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Partner' : 'Add Partner'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Partner Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Global Health Initiative"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-gray-400" />
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept="image/*"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
            {formData.file && (
              <p className="text-sm text-green-600 mt-1">✓ {formData.file.name}</p>
            )}
            {editingId && !formData.file && (
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current logo</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              id="isActive"
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium">
              Active (show on public site)
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingId ? 'Update Partner' : 'Add Partner'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Partners List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">Partners ({partners.length})</h2>
        {partners.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No partners yet</p>
        ) : (
          partners.map((partner, index) => (
            <div
              key={partner.id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 flex-1">
                {partner.logoUrl && (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-12 h-12 object-cover rounded bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{partner.name}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{partner.isActive ? '✓ Active' : '⊘ Inactive'}</span>
                    {partner.logoUrl && (
                      <a
                        href={partner.logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => movePartner(partner.id, 'up')}
                  disabled={index === 0 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => movePartner(partner.id, 'down')}
                  disabled={index === partners.length - 1 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(partner)}
                  className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  disabled={loading}
                  className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
