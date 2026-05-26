# Phase 1 — Inline Editing: Home Page (Proof of Concept)

**Goal:** Replace the existing HomeEditor form (left pane) + iframe preview (right pane) with a single rendered page where every editable element is click-to-edit — WordPress-style.

**Scope:** Home page only. All other editors (About, Contact, Programs, etc.) remain unchanged.

**Duration estimate:** 2–3 days dev, 1 day polish + testing.

---

## Architecture

### Before

```
HomeEditor.jsx
  ├── <SplitLayout>
  │   ├── <div.editor>      ← 22 BilingualField components, 6 MediaUploadField
  │   │                       components, raw inputs for stats/showcase
  │   ├── <div.handle>      ← draggable resize
  │   └── <div.preview>
  │       ├── <PreviewToolbar>   ← language toggle, device buttons
  │       └── <PreviewPane>      ← <iframe src="web/?preview=1">
  └── usePreviewSync(iframeRef, draft, 'home', fullContent)
                                 ← postMessage to iframe on every change
```

### After (Phase 1)

```
InlineHomeEditor.jsx        ← NEW — replaces HomeEditor entirely
  ├── <EditModeProvider>     ← NEW — context providing edit state, save queue
  │   ├── <EditToolbar>     ← NEW — Save, Preview toggle, EN/BN toggle, undo
  │   └── <HomePage>        ← RENDERS THE ACTUAL PAGE
  │       ├── <HeroSection>      ← shared component (extracted from web)
  │       ├── <ImpactMetrics>    ← shared component (extracted from web)
  │       ├── <FeaturedPrograms> ← shared component (extracted from web)
  │       ├── <FacebookShowcase> ← shared component (extracted from web)
  │       └── <DonationCTA>      ← shared component (extracted from web)

No iframe. No SplitLayout. No BilingualField. No postMessage glue.
```

---

## Package Structure

Create a new shared package `packages/ui/` containing rendering components used by both web and admin.

```
packages/ui/
  ├── package.json
  ├── index.js                  ← re-exports all components
  ├── components/
  │   ├── HomePage.jsx          ← the whole Home page layout
  │   ├── HeroSection.jsx       ← hero panel with editable text/images
  │   ├── ImpactMetricsSection.jsx
  │   ├── FeaturedProgramsSection.jsx
  │   ├── FacebookShowcaseSection.jsx
  │   ├── DonationCtaSection.jsx
  │   └── Editable.jsx          ← <Editable> wrapper component
  └── contexts/
      └── EditModeContext.jsx   ← provides isEditMode, fieldRegistry, saveQueue
```

**Key rule:** Every component in `packages/ui/` renders the same markup whether in read-only (web) or edit (admin) mode. The difference is:
- Read-only: `resolve(language, value)` → plain text
- Edit mode: click → `contentEditable` (text) or file picker overlay (images)

The `EditModeContext` is a no-op provider in web. In admin, it activates editing surfaces.

---

## Step-by-step Implementation

### Step 1 — Scaffold `packages/ui/`

- Create `packages/ui/package.json` with `name: "@heritageofhope/ui"`, React/ReactDOM as peer dependencies.
- Add `packages/ui` to root `package.json` workspaces.
- Create `packages/ui/index.js` that re-exports everything.
- Run `npm install` at root to register the workspace.

### Step 2 — Build `EditModeContext`

```jsx
// packages/ui/contexts/EditModeContext.jsx

const EditModeContext = createContext({
  isEditMode: false,
  language: 'en',
  setLanguage: () => {},
  registerField: (path, initialValue, type) => {},   // returns { currentValue, setValue }
  saveQueue: {},
  enqueueSave: (path, value) => {},
  flushSaves: async () => {},                         // calls all dirty PATCH requests
})
```

**RegisterField** is the core abstraction. Every editable element calls `registerField(path, initialValue, type)` on mount. The `path` maps to a `PATCH` endpoint:
- Text: `path = "hero.headline"` → endpoint `PATCH /api/admin/content/home/hero/headline`
- Image: `path = "hero.heroImage"` → upload via `POST /api/admin/media/hero`
- Array item text: `path = "featuredPrograms[0].title"` → endpoint `PATCH /api/admin/content/home/featuredPrograms/0/title` (backend needs this route or we batch-save the whole array)

**SaveQueue** collects dirty fields. On "Save", `flushSaves()` iterates the queue and fires parallel `PATCH` requests matching the exact endpoint pattern `HomeEditor` currently uses.

### Step 3 — Extract Home Page HTML into `packages/ui/`

Take `packages/web/src/pages/Home.jsx` and move all JSX + logic into `packages/ui/components/HomePage.jsx`.

Add **`data-field-path`** attributes to every content-bearing element:

```jsx
// Before (current web code)
<h1>{resolve(language, hero.headline)}</h1>

// After (shared ui/ component)
<h1 data-field-path="hero.headline">
  <Editable path="hero.headline" type="text">
    {resolve(language, hero.headline)}
  </Editable>
</h1>
```

The `<Editable>` wrapper:
- In read-only mode: renders its children as-is
- In edit mode: renders a `contentEditable` span (text) / overlay (image) / widget (array)

**Every editable text node on the Home page** gets wrapped in `<Editable>` with the correct `data-field-path`. The full mapping:

| data-field-path | Type | Web line ref |
|---|---|---|
| `hero.eyebrow` | text | 21 |
| `hero.headline` | text | 22 |
| `hero.intro` | text | 23 |
| `hero.ctaPrimaryLabel` | text | 25 |
| `hero.ctaSecondaryLabel` | text | 27 |
| `hero.figcaption` | text | 37 |
| `hero.certCaption` | text | 42 |
| `hero.heroFootnote` | text | 46 |
| `hero.heroImage` | image | 32 |
| `hero.regCertThumb` | image | 41 |
| `page.statsLabel` | text | 58 |
| `page.statsHeading` | text | 60 |
| `impactMetrics[i].value` | text (number) | 65 |
| `impactMetrics[i].label` | text | 66 |
| `mission.heading` | text (rich) | 75 |
| `page.pillarLabel` | text | 74 |
| `featuredPrograms[i].category` | text | 82 |
| `featuredPrograms[i].title` | text | 83 |
| `featuredPrograms[i].description` | text (rich) | 84 |
| `featuredPrograms[i].image` | image | 81 |
| `page.activityLabel` | text | 95 |
| `page.activityHeading` | text | 96 |
| `facebookPosts[i].title` | text | 105 |
| `facebookPosts[i].excerpt` | text (rich) | 106 |
| `facebookPosts[i].image` | image | 103 |
| `showcaseImages[i].label` | text | 117 |
| `showcaseImages[i].image` | image | 116 |
| `page.donationLabel` | text | 131 |
| `cta.headline` | text | 132 |
| `cta.body` | text (rich) | 133 |
| `cta.buttonLabel` | text | 134 |

### Step 4 — Wire HomePage into Web Client

```jsx
// packages/web/src/pages/Home.jsx — simplified
import { HomePage } from '@heritageofhope/ui'
import { EditModeProvider } from '@heritageofhope/ui/contexts/EditModeContext'

export default function Home() {
  const { language, siteContent } = useOutletContext()

  return (
    <EditModeProvider isEditMode={false}>
      <HomePage
        content={siteContent.home}
        language={language}
        isPreview={false}
      />
    </EditModeProvider>
  )
}
```

Verify web renders identically — all existing behavior (data-reveal scroll, CountUp animations, responsive layout) preserved.

### Step 5 — Build Inline Editor for Admin

Create `packages/admin/src/pages/InlineHomeEditor.jsx`:

```jsx
// NEW file — replaces HomeEditor.jsx route

export default function InlineHomeEditor() {
  const iframeRef = useRef(null)
  const [language, setLanguage] = useState('en')
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch content using same API pattern as current HomeEditor
  useEffect(() => {
    const fetchHome = async () => {
      const res = await apiClient.get('/api/admin/content/home')
      setContent(res.data.sections)
      setLoading(false)
    }
    fetchHome()
  }, [])

  // Save handler: calls flushSaves() on the context
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await flushSaves()    // from EditModeContext
      showToast('Saved')
    } catch (err) {
      showToast('Save failed')
    }
    setIsSaving(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="inline-editor">
      <EditToolbar
        language={language}
        setLanguage={setLanguage}
        onSave={handleSave}
        isSaving={isSaving}
        pageTitle="Home Page"
      />

      <EditModeProvider isEditMode={true} onFlush={onFlush} apiPrefix="/api/admin/content/home">
        <HomePage
          content={content}
          language={language}
          isPreview={false}
        />
      </EditModeProvider>
    </div>
  )
}
```

Key elements of `EditToolbar`:
- **"Edit Page"** toggle (always ON in this phase — editor starts in edit mode)
- **EN / বাংলা** toggle — switches `language` state; re-renders all text through `resolve()`
- **"Save Changes"** button (with loading spinner) — triggers batch PATCH save
- **Last saved timestamp** display

### Step 6 — Wire the Editable component

```jsx
// packages/ui/components/Editable.jsx

export default function Editable({ path, type, children, content }) {
  const { isEditMode, registerField, enqueueSave, language } = useEditMode()
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)

  // Register this field with the context on mount
  const { currentValue, setCurrentValue } = registerField(path, content)

  if (!isEditMode) {
    // Read-only: render children unchanged (web mode)
    return children
  }

  // ── Edit mode ──

  if (type === 'image') {
    return <EditableImage path={path} src={content} />
  }

  if (type === 'richtext') {
    return <EditableRichText path={path} content={content} />
  }

  // Default: single-line text
  if (editing) {
    return (
      <input
        ref={inputRef}
        className="inline-editable-input"
        defaultValue={currentValue?.[language] || ''}
        onBlur={(e) => {
          const newVal = { ...currentValue, [language]: e.target.value }
          setCurrentValue(newVal)
          enqueueSave(path, newVal)
          setEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur()
          if (e.key === 'Escape') setEditing(false)
        }}
        autoFocus
      />
    )
  }

  return (
    <span
      className="inline-editable"
      data-field-path={path}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {children}
      <span className="edit-pencil-icon">✎</span>
    </span>
  )
}
```

### Step 7 — Override Admin Route

In `packages/admin/src/App.jsx`, replace the HomeEditor route:

```jsx
// Before:
<Route path="home" element={<HomeEditor />} />

// After:
<Route path="home" element={<InlineHomeEditor />} />
```

Keep `HomeEditor.jsx` in the codebase — it can be removed in Phase 2 after all pages are converted.

### Step 8 — Image Editing (click to replace)

Create `EditableImage.jsx`:

- **Read-only**: renders `<img>` normally
- **Edit mode**: wraps image in a container. On hover, shows a semi-transparent overlay with "Replace" and "Remove" buttons.
- **Replace**: opens file picker → uploads via `POST /api/admin/media/upload` → updates state
- **Remove**: confirms → calls DELETE endpoint → clears image URL
- For `hero.heroImage`, use the special `POST /api/admin/media/hero` endpoint (existing)

### Step 9 — Array Editing (impact metrics, programs, showcase, facebook posts)

Arrays are the hardest part. Three approaches ranked by complexity:

**Option A (recommended for Phase 1): Inline add/delete only, no reorder**
- Each array item gets a small "×" button in the top-right corner to delete
- At the bottom of each array section, an "Add {item}" button
- Clicking "Add" opens a mini modal (or inline form) with fields for the new item
- Reordering uses the existing DragHandle DnD in a separate panel below (or defers to Phase 2)

**Option B: Modal-based CRUD**
- Each array item shows its rendered content. Clicking it opens a modal with the full form
- Add also opens the modal with empty fields
- Simpler to implement but more modal-heavy UX

**Recommended: Use a bottom-drawer section list for arrays**

At the bottom of the rendered page in edit mode, each array section (Impact Metrics, Featured Programs, Facebook Posts, Showcase) has a collapsible **"Manage {section}"** panel that shows a simple list with text inputs and reorder via drag handle. This keeps the inline UX clean while providing full CRUD.

### Step 10 — Rich Text Editing (intro, description, body fields)

For multi-line content (`hero.intro`, `mission.heading`, `cta.body`, program descriptions, facebook excerpts):

- Click → expand into a `<textarea>` with a simple formatting toolbar (bold, italic, link)
- Or use a lightweight rich text editor like **TipTap** (headless, ~15KB gzipped) for the richest experience
- **Recommendation:** Start with `<textarea>` in Phase 1. Upgrade to TipTap in Phase 2 if the UX is insufficient.
- Rich text fields are: `hero.intro`, `mission.heading`, `featuredPrograms[i].description`, `cta.body`, `facebookPosts[i].excerpt`

### Step 11 — Save Mechanism

The `EditModeContext` maintains a `saveQueue` (a `Map<string, any>`):

```js
saveQueue: {
  'hero.headline': { en: 'New Headline', bn: 'নতুন শিরোনাম' },
  'hero.intro': { en: '...', bn: '...' },
  'hero.heroImage': 'https://...new-image.jpg',
}
```

On `flushSaves()`:

```js
async function flushSaves() {
  const promises = []
  for (const [path, value] of saveQueue.entries()) {
    if (path.includes('.image') || path.includes('.heroImage') || path.includes('.regCertThumb')) {
      // Image changes handled via upload endpoints already called at edit time
      continue
    }
    // Map path like "hero.headline" to endpoint components
    const [section, ...rest] = path.split('.')
    const fieldKey = rest.join('.')
    promises.push(
      apiClient.patch(`/api/admin/content/home/${section}/${fieldKey}`, {
        valueEn: value.en,
        valueBn: value.bn,
      })
    )
  }
  await Promise.all(promises)
  saveQueue.clear()
}
```

This reuses the **exact same PATCH endpoints** that HomeEditor.jsx currently calls. No backend changes needed.

### Step 12 — Unsaved Changes Warning

Before navigating away from `InlineHomeEditor`, check if `saveQueue` is non-empty and prompt with `beforeunload` + React Router's `useBlocker`:

```jsx
useBlocker(
  ({ currentLocation, nextLocation }) =>
    saveQueue.size > 0 && currentLocation.pathname !== nextLocation.pathname
)
```

### Step 13 — Styling

Add admin-specific CSS for edit mode indicators:
- Editable element: dashed border on hover (`1px dashed #3b82f6`)
- Active editing: solid blue border, white background
- Pencil icon (✎) appears on hover
- Save button: prominent blue in the toolbar
- Image overlay: dark semi-transparent with white buttons
- Rich text: expanded textarea with min-height

---

## Files Changed (Complete List)

### New files
| File | Purpose |
|---|---|
| `packages/ui/package.json` | Shared UI package workspace |
| `packages/ui/index.js` | Re-exports |
| `packages/ui/contexts/EditModeContext.jsx` | Edit mode state + save queue |
| `packages/ui/components/HomePage.jsx` | Extracted Home page layout |
| `packages/ui/components/HeroSection.jsx` | Hero section with Editable wrappers |
| `packages/ui/components/ImpactMetricsSection.jsx` | Metrics section |
| `packages/ui/components/FeaturedProgramsSection.jsx` | Programs section |
| `packages/ui/components/FacebookShowcaseSection.jsx` | Facebook + showcase section |
| `packages/ui/components/DonationCtaSection.jsx` | CTA section |
| `packages/ui/components/Editable.jsx` | Inline edit wrapper |
| `packages/ui/components/EditableImage.jsx` | Image replace/delete |
| `packages/ui/components/EditToolbar.jsx` | Save, language, preview toggle |
| `packages/admin/src/pages/InlineHomeEditor.jsx` | New admin editor page |

### Modified files
| File | Change |
|---|---|
| `package.json` (root) | Add `packages/ui` to workspaces |
| `packages/web/src/pages/Home.jsx` | Delegate to `@heritageofhope/ui/HomePage` |
| `packages/admin/src/App.jsx` | Route `/admin/home` → `InlineHomeEditor` |
| `packages/admin/src/index.css` (or styles) | Edit mode CSS classes |

### Unchanged files
| File | Why |
|---|---|
| `packages/api/src/routes/admin/content.js` | No backend changes needed — same PATCH endpoints |
| `packages/api/src/routes/admin/media.js` | No changes |
| `packages/admin/src/hooks/usePreviewSync.js` | Still used by other editors |
| `packages/admin/src/components/PreviewPane.jsx` | Still used by other editors |
| `packages/admin/src/components/SplitLayout.jsx` | Still used by other editors |
| `packages/web/src/hooks/usePreviewMode.js` | Still used by other pages in preview mode |
| `packages/admin/src/pages/HomeEditor.jsx` | Kept (not deleted) — fallback if needed |

---

## Potential Pitfalls

1. **`data-reveal` scroll animations** — The extracted `HomePage` component must be able to disable scroll-triggered reveal animations in admin (where scroll behavior is different). Pass a `disableAnimations` prop.

2. **CountUp component** — The impact metrics use `CountUp` for animated number display. In admin edit mode, this should be disabled (show raw numbers) so the user can edit them. Wrap in an `if (isEditMode) return <span>{metric.value}</span>` guard.

3. **Bilingual editing UX** — When user clicks a text element in edit mode, should it show both EN/BN? Or just the currently selected language? **Recommendation:** Show only the active language input. Add a small EN/BN indicator badge next to the field. User toggles language via the toolbar to switch which language they're editing. This keeps the UI clean.

4. **Trust badges** — These are not currently editable in the HomeEditor form (hardcoded or managed elsewhere). Keep them non-editable in Phase 1. They'll get coverage in a later phase.

5. **Facebook posts** — The current HomeEditor does not have Facebook post editing. The web Home page renders `facebookPosts` from the API but there's no editor for it in the admin. This is a pre-existing gap. Either: (a) keep them read-only in the inline editor, (b) add basic text editing for title/excerpt per post, (c) skip them in Phase 1. **Recommendation:** Make title/excerpt editable; mark image as "coming soon" since the upload endpoint may not exist.

6. **Performance** — The current `usePreviewSync` sends the entire content tree on every keystroke. The new approach only saves on explicit "Save" click. This is actually **better** — fewer API calls, no debounce complexity. But it means unsaved changes are lost on navigation unless we add the blocker.

7. **Concurrent editing** — If two admins open the same editor, the last save wins. This is the same behavior as the current system. No optimistic locking.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| contentEditable behaves differently across browsers | Medium | Medium | Test in Chrome + Firefox before shipping. Fall back to `<textarea>` per field if contentEditable is buggy. |
| Save queue grows large and PATCH storm overwhelms API | Low | Medium | All parallel — same pattern as current HomeEditor. API handles it fine. |
| Rich text fields (TipTap) add bundle size | Medium | Low | TipTap is 15KB gzipped. If using textarea instead, zero cost. |
| Array CRUD is too complex for Phase 1 | Medium | Medium | Defer full array inline editing. Use a simple modal or collapsible panel at the bottom. |
| Extracting HomePage causes visual regressions in web | Low | High | Compare screenshots before/after. Run existing a11y tests against web Home. |

---

## Acceptance Criteria

1. Admin can navigate to Home editor and see the Home page rendered directly (no iframe, no split layout)
2. Every text field is clickable → editable → saves correctly via existing PATCH endpoints
3. Every image shows replace/remove overlay on hover
4. EN/BN toggle switches all visible text between languages
5. Save button persists all dirty fields, shows success/failure toast
6. Unsaved changes warning on navigation
7. Web client Home page renders identically to before (no regression)
8. Existing a11y tests still pass
9. Other admin editors (About, Contact, etc.) continue to work unchanged
