import React, { useState, useEffect } from 'react';
import { Trash2, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { apiClient } from '../api';

export default function TeamEditor() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roleEn: '',
    roleBn: '',
    file: null
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/team');
      setMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
      alert('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', roleEn: '', roleBn: '', file: null });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a member name');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('roleEn', formData.roleEn);
      data.append('roleBn', formData.roleBn);
      if (formData.file) {
        data.append('file', formData.file);
      }

      if (editingId) {
        await apiClient.patch(`/admin/team/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await apiClient.post('/admin/team', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      await loadMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Failed to save team member');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      roleEn: member.roleEn || '',
      roleBn: member.roleBn || '',
      file: null
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member? This cannot be undone.')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/admin/team/${id}`);
      await loadMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    } finally {
      setLoading(false);
    }
  };

  const moveMember = async (id, direction) => {
    const index = members.findIndex(m => m.id === id);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === members.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedMembers = [...members];
    [updatedMembers[index], updatedMembers[newIndex]] = [updatedMembers[newIndex], updatedMembers[index]];

    try {
      setLoading(true);
      await apiClient.patch('/admin/team/reorder', {
        members: updatedMembers.map((m, i) => ({
          id: m.id,
          sortOrder: i
        }))
      });
      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error reordering team members:', error);
      alert('Failed to reorder team members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Team Member' : 'Add Team Member'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Dr. Sharma"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role (English)</label>
              <input
                type="text"
                name="roleEn"
                value={formData.roleEn}
                onChange={handleInputChange}
                placeholder="e.g., Founder & Director"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role (Bengali)</label>
              <input
                type="text"
                name="roleBn"
                value={formData.roleBn}
                onChange={handleInputChange}
                placeholder="যেমন, প্রতিষ্ঠাতা ও পরিচালক"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
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
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current photo</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
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

      {/* Team List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">Team ({members.length})</h2>
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No team members yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center mb-4">
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover bg-gray-100 mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  {member.roleEn && (
                    <p className="text-sm text-gray-600">{member.roleEn}</p>
                  )}
                  {member.roleBn && (
                    <p className="text-sm text-gray-600">{member.roleBn}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => moveMember(member.id, 'up')}
                    disabled={index === 0 || loading}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveMember(member.id, 'down')}
                    disabled={index === members.length - 1 || loading}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={loading}
                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
