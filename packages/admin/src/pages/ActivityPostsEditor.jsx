import React, { useState, useEffect } from 'react';
import { Trash2, Upload, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import apiClient from '../lib/api';
import { Toast } from '../components/Toast';

export default function ActivityPostsEditor() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    titleEn: '',
    titleBn: '',
    bodyEn: '',
    bodyBn: '',
    isPublished: true,
    file: null
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/activity-posts');
      setPosts(response.data);
    } catch (error) {
      showToast('Failed to load activity posts', 'error');
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
    setFormData({
      date: new Date().toISOString().split('T')[0],
      titleEn: '',
      titleBn: '',
      bodyEn: '',
      bodyBn: '',
      isPublished: true,
      file: null
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.titleEn.trim()) {
      alert('Please enter date and English title');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('date', formData.date);
      data.append('titleEn', formData.titleEn);
      data.append('titleBn', formData.titleBn);
      data.append('bodyEn', formData.bodyEn);
      data.append('bodyBn', formData.bodyBn);
      data.append('isPublished', formData.isPublished);
      if (formData.file) {
        data.append('file', formData.file);
      }

      if (editingId) {
        await apiClient.patch(`/api/admin/activity-posts/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await apiClient.post('/api/admin/activity-posts', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      showToast(editingId ? 'Post updated' : 'Post created', 'success');
      await loadPosts();
    } catch (error) {
      showToast('Failed to save activity post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      date: post.date.split('T')[0],
      titleEn: post.titleEn,
      titleBn: post.titleBn || '',
      bodyEn: post.bodyEn || '',
      bodyBn: post.bodyBn || '',
      isPublished: post.isPublished,
      file: null
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity post? This cannot be undone.')) return;

    try {
      setLoading(true);
      await apiClient.delete(`/api/admin/activity-posts/${id}`);
      showToast('Post deleted', 'success');
      await loadPosts();
    } catch (error) {
      showToast('Failed to delete activity post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const movePost = async (id, direction) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === posts.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedPosts = [...posts];
    [updatedPosts[index], updatedPosts[newIndex]] = [updatedPosts[newIndex], updatedPosts[index]];

    try {
      setLoading(true);
      await apiClient.patch('/api/admin/activity-posts/reorder', {
        posts: updatedPosts.map((p, i) => ({
          id: p.id,
          sortOrder: i
        }))
      });
      setPosts(updatedPosts);
    } catch (error) {
      showToast('Failed to reorder posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Activity Posts</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Post' : 'Create New Post'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title (English) *</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                placeholder="e.g., Summer camp begins"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (Bengali)</label>
              <input
                type="text"
                name="titleBn"
                value={formData.titleBn}
                onChange={handleInputChange}
                placeholder="যেমন, গ্রীষ্মকালীন শিবির শুরু"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Body (English)</label>
              <textarea
                name="bodyEn"
                value={formData.bodyEn}
                onChange={handleInputChange}
                placeholder="Event details..."
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body (Bengali)</label>
              <textarea
                name="bodyBn"
                value={formData.bodyBn}
                onChange={handleInputChange}
                placeholder="ইভেন্ট বিবরণ..."
                rows="3"
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

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              id="isPublished"
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm font-medium">
              Published (visible on public site)
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
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

      {/* Posts List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity posts yet</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {post.photoUrl && (
                  <img
                    src={post.photoUrl}
                    alt={post.titleEn}
                    className="w-20 h-20 object-cover rounded bg-gray-100"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <h3 className="font-semibold text-lg">{post.titleEn}</h3>
                      {post.titleBn && (
                        <p className="text-sm text-gray-600">{post.titleBn}</p>
                      )}
                      {post.bodyEn && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {post.bodyEn}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {post.isPublished ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Eye size={14} /> Published
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <EyeOff size={14} /> Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => movePost(post.id, 'up')}
                  disabled={index === 0 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => movePost(post.id, 'down')}
                  disabled={index === posts.length - 1 || loading}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
