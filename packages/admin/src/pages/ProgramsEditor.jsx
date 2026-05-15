import { useState, useEffect } from 'react'
import { request } from '../lib/api'
import BilingualField from '../components/BilingualField'
import ImageUploader from '../components/ImageUploader'
import { Trash2, Plus, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../components/SortableItem'

export default function ProgramsEditor() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    titleEn: '',
    titleBn: '',
    categoryEn: '',
    categoryBn: '',
    descriptionEn: '',
    descriptionBn: '',
    highlightEn: '',
    highlightBn: '',
    image: null,
    imageUrl: '',
  })
  const [message, setMessage] = useState('')
  const [reordering, setReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    try {
      setLoading(true)
      const res = await request('GET', '/api/admin/programs')
      setPrograms(res.items || [])
    } catch (err) {
      setMessage('Failed to fetch programs: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      slug: '',
      titleEn: '',
      titleBn: '',
      categoryEn: '',
      categoryBn: '',
      descriptionEn: '',
      descriptionBn: '',
      highlightEn: '',
      highlightBn: '',
      image: null,
      imageUrl: '',
    })
    setEditingId(null)
  }

  function editProgram(prog) {
    setFormData({
      slug: prog.slug,
      titleEn: prog.titleEn,
      titleBn: prog.titleBn,
      categoryEn: prog.categoryEn || '',
      categoryBn: prog.categoryBn || '',
      descriptionEn: prog.descriptionEn || '',
      descriptionBn: prog.descriptionBn || '',
      highlightEn: prog.highlightEn || '',
      highlightBn: prog.highlightBn || '',
      image: null,
      imageUrl: prog.imageUrl,
    })
    setEditingId(prog.id)
    setShowAddForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const formBody = new FormData()

      // Text fields
      formBody.append('slug', formData.slug)
      formBody.append('titleEn', formData.titleEn)
      formBody.append('titleBn', formData.titleBn)
      formBody.append('categoryEn', formData.categoryEn)
      formBody.append('categoryBn', formData.categoryBn)
      formBody.append('descriptionEn', formData.descriptionEn)
      formBody.append('descriptionBn', formData.descriptionBn)
      formBody.append('highlightEn', formData.highlightEn)
      formBody.append('highlightBn', formData.highlightBn)

      // Image
      if (formData.image) {
        formBody.append('image', formData.image)
      }

      let res
      if (editingId) {
        res = await request('PATCH', `/api/admin/programs/${editingId}`, formBody, { isFormData: true })
      } else {
        res = await request('POST', '/api/admin/programs', formBody, { isFormData: true })
      }

      if (res.success) {
        setMessage(editingId ? 'Program updated' : 'Program created')
        resetForm()
        await fetchPrograms()
        setShowAddForm(false)
      }
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProgram(id) {
    if (!confirm('Delete this program? This cannot be undone.')) return

    try {
      setLoading(true)
      const res = await request('DELETE', `/api/admin/programs/${id}`)
      if (res.success) {
        setMessage('Program deleted')
        await fetchPrograms()
      }
    } catch (err) {
      setMessage('Delete failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = programs.findIndex((p) => p.id === active.id)
    const newIndex = programs.findIndex((p) => p.id === over.id)
    const newList = arrayMove(programs, oldIndex, newIndex)

    setPrograms(newList)
    saveOrder(newList)
  }

  async function saveOrder(newList) {
    try {
      setReordering(true)
      const items = newList.map((prog, idx) => ({ id: prog.id, sortOrder: idx }))
      const res = await request('PATCH', '/api/admin/programs/reorder', { items })
      if (res.success) {
        setMessage('Order saved')
      }
    } catch (err) {
      setMessage('Order save failed: ' + err.message)
    } finally {
      setReordering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Featured Programs</h1>
        <button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Program
        </button>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg flex justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-lg">
            ✕
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Program' : 'New Program'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., education-initiative"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div></div>
            </div>

            {/* Bilingual title */}
            <BilingualField
              labelEn="Title (EN)"
              labelBn="Title (BN)"
              valueEn={formData.titleEn}
              valueBn={formData.titleBn}
              onChangeEn={(v) => setFormData({ ...formData, titleEn: v })}
              onChangeBn={(v) => setFormData({ ...formData, titleBn: v })}
              required={true}
            />

            {/* Bilingual category */}
            <BilingualField
              labelEn="Category (EN)"
              labelBn="Category (BN)"
              valueEn={formData.categoryEn}
              valueBn={formData.categoryBn}
              onChangeEn={(v) => setFormData({ ...formData, categoryEn: v })}
              onChangeBn={(v) => setFormData({ ...formData, categoryBn: v })}
            />

            {/* Bilingual description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <div className="grid grid-cols-2 gap-3">
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Description (EN)"
                  className="w-full px-3 py-2 border rounded text-sm"
                  rows={3}
                />
                <textarea
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="বর্ণনা (BN)"
                  className="w-full px-3 py-2 border rounded text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Bilingual highlight */}
            <BilingualField
              labelEn="Highlight (EN)"
              labelBn="Highlight (BN)"
              valueEn={formData.highlightEn}
              valueBn={formData.highlightBn}
              onChangeEn={(v) => setFormData({ ...formData, highlightEn: v })}
              onChangeBn={(v) => setFormData({ ...formData, highlightBn: v })}
              isTextArea={true}
            />

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Program Image</label>
              {formData.imageUrl && (
                <div className="mb-3 flex items-center gap-2">
                  <img src={formData.imageUrl} alt="preview" className="w-32 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '', image: null })}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
              <ImageUploader
                onSelect={(file) => setFormData({ ...formData, image: file })}
                accept="image/*"
                maxSizeMB={8}
              />
            </div>

            {/* Form actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs list */}
      {loading && !showAddForm ? (
        <div className="text-center py-10">Loading programs...</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No programs yet. Create your first one!</div>
      ) : (
        <>
          <p className="text-sm text-gray-600">Total: {programs.length} programs</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={programs.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {programs.map((prog) => (
                  <SortableItem key={prog.id} id={prog.id}>
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition">
                      <GripVertical size={18} className="text-gray-400" />
                      {prog.imageUrl && (
                        <img src={prog.imageUrl} alt={prog.titleEn} className="w-24 h-20 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{prog.titleEn}</p>
                        <p className="text-sm text-gray-600 truncate">{prog.titleBn}</p>
                        {prog.categoryEn && <p className="text-xs text-blue-600">{prog.categoryEn}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProgram(prog)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProgram(prog.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  )
}
