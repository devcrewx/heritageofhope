# Quick Integration Guide - Apply to Other Admin Pages

This guide shows how to apply the same validation, confirmation dialog, and error handling patterns to other admin pages.

## Step-by-Step Integration

### 1. Update Admin Page Imports
Add these 3 components to any admin page:

```jsx
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
```

### 2. Add State Variables
```jsx
const [error, setError] = useState(null)
const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null })
const [formErrors, setFormErrors] = useState({})
```

### 3. Implement Delete Confirmation
Replace:
```jsx
// OLD - Using browser confirm
const handleDelete = async (id) => {
  if (!confirm('Delete?')) return
  // ... delete code
}
```

With:
```jsx
// NEW - Using confirmation dialog
const confirmDelete = (itemId) => {
  setDeleteConfirm({ isOpen: true, itemId })
}

async function handleDelete() {
  const { itemId } = deleteConfirm
  if (!itemId) return
  // ... delete code
  setDeleteConfirm({ isOpen: false, itemId: null })
}

// In JSX:
<ConfirmDialog
  isOpen={deleteConfirm.isOpen}
  title="Delete Item?"
  message="This action cannot be undone."
  isDangerous
  isLoading={loading}
  onConfirm={handleDelete}
  onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
/>
```

### 4. Add Error Display
Add this near your form/content:
```jsx
{error && (
  <ErrorMessage 
    error={error} 
    onClose={() => setError(null)}
    className="mb-6"
  />
)}
```

### 5. Add Form Validation
Add a validation function:
```jsx
const validateForm = () => {
  const errors = {}
  if (!formData.itemName.trim()) {
    errors.itemName = 'Item name is required'
  }
  if (formData.itemName.length < 2) {
    errors.itemName = 'Name must be at least 2 characters'
  }
  return errors
}
```

In submit handler:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  const errors = validateForm()
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    showToast('Please fix validation errors', 'error')
    return
  }
  
  // ... API call
}
```

### 6. Show Field Validation Errors
On form inputs:
```jsx
<input
  name="itemName"
  value={formData.itemName}
  onChange={handleInputChange}
  className={`w-full px-3 py-2 border rounded-lg ${
    formErrors.itemName 
      ? 'border-red-500' 
      : 'border-gray-300'
  }`}
/>
{formErrors.itemName && (
  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    <AlertCircle size={14} /> {formErrors.itemName}
  </p>
)}
```

### 7. Use LoadingSpinner for Initial Loads
Replace text loading indicators:
```jsx
// OLD
if (loading) {
  return <div className="p-6"><p>Loading...</p></div>
}

// NEW
if (initialLoading) {
  return <LoadingSpinner fullPage text="Loading items..." />
}
```

### 8. Update API Routes with Validation
In the corresponding backend route, add express-validator:

```javascript
import { body, param } from 'express-validator'
import { handleValidationErrors } from '../../middleware/validation.js'

// Example: validating a GET endpoint
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('description').trim().isLength({ max: 500 }),
  ],
  handleValidationErrors,
  async (req, res) => {
    // ... endpoint logic
  }
)
```

## Pattern Applications

### PartnersEditor
```jsx
// Delete confirmation
const confirmDelete = (id) => setDeleteConfirm({ isOpen: true, itemId: id })

// Form validation
const validateForm = () => {
  const errors = {}
  if (!formData.name?.trim()) errors.name = 'Partner name required'
  return errors
}

// In JSX
<ConfirmDialog
  isOpen={deleteConfirm.isOpen}
  title="Delete Partner?"
  isDangerous
  onConfirm={handleDelete}
  onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
/>
```

### DocumentsEditor
```jsx
// Similar pattern for documents
// Validation for: title, description, file upload
// Delete confirmation dialog
```

### ActivityPostsEditor
```jsx
// Validation for: title, description, date, published flag
// Delete confirmation with message showing post title
// Loading spinner during upload
```

## Code Template

Here's a complete template to copy/paste as starting point:

```jsx
import React, { useState, useEffect } from 'react'
import apiClient from '../lib/api'
import { Toast } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function PageEditor() {
  const [items, setItems] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null })
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    // Add your form fields here
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await apiClient.get('/api/admin/items')
      setItems(response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to load items'
      setError(errorMsg)
    } finally {
      setInitialLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    // Add your validation logic here
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setToast({ message: 'Please fix validation errors', type: 'error' })
      return
    }

    try {
      setLoading(true)
      setError(null)
      // API call here
      const response = await apiClient.post('/api/admin/items', formData)
      setToast({ message: 'Item saved successfully', type: 'success' })
      await loadItems()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save item'
      setError(errorMsg)
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (itemId) => {
    setDeleteConfirm({ isOpen: true, itemId })
  }

  const handleDelete = async () => {
    const { itemId } = deleteConfirm
    if (!itemId) return

    try {
      setLoading(true)
      await apiClient.delete(`/api/admin/items/${itemId}`)
      setDeleteConfirm({ isOpen: false, itemId: null })
      setToast({ message: 'Item deleted successfully', type: 'success' })
      await loadItems()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete item'
      setError(errorMsg)
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner fullPage text="Loading items..." />
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Items</h1>

      {error && (
        <ErrorMessage 
          error={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Form here */}

      {/* Items list here */}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Item?"
        message="This action cannot be undone."
        confirmText="Delete"
        isDangerous
        isLoading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onDismiss={() => setToast(null)} 
        />
      )}
    </div>
  )
}
```

## Pages to Update (Priority Order)

1. ✅ **TeamEditor** - DONE
2. ✅ **GalleryManager** - DONE
3. **PartnersEditor** - NEXT (partner deletion)
4. **DocumentsEditor** - Document deletion
5. **ActivityPostsEditor** - Activity post deletion
6. **VolunteerRolesEditor** - Role deletion
7. **DonationTiersEditor** - Tier deletion
8. Other editors as needed

---

## Validation Rules by Content Type

### Team Member
```javascript
body('name').trim().isLength({ min: 2, max: 100 })
body('roleEn').if(body('roleEn').notEmpty()).trim().isLength({ max: 100 })
body('roleBn').if(body('roleBn').notEmpty()).trim().isLength({ max: 100 })
```

### Partner
```javascript
body('name').trim().isLength({ min: 2, max: 200 })
body('active').if(body('active').notEmpty()).isBoolean()
```

### Document
```javascript
body('title').trim().isLength({ min: 3, max: 200 })
body('description').if(body('description').notEmpty()).isLength({ max: 1000 })
body('date').if(body('date').notEmpty()).isISO8601()
```

### Activity Post
```javascript
body('titleEn').trim().isLength({ min: 3, max: 200 })
body('titleBn').if(body('titleBn').notEmpty()).isLength({ max: 200 })
body('published').if(body('published').notEmpty()).isBoolean()
```

---

## Testing the Implementation

For each page, test:
1. ✅ Form validation works
2. ✅ Error messages display correctly
3. ✅ Confirmation dialog appears for delete
4. ✅ Delete works after confirmation
5. ✅ Server errors display in error banner
6. ✅ Loading spinner appears during operations
7. ✅ Toast messages show for success/error
8. ✅ Form recovers after validation errors
