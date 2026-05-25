# Visual CMS — Full Implementation Plan
**Heritage of Hope Foundation**
Branch: `feature/visual-cms`
Date: May 2026

---

## 1. What We Are Actually Building

The admin panel currently works like this:
- Admin opens `admin.domain.com/home`
- Edits text fields in a form panel
- Clicks Save
- Opens a new tab to check `domain.com` to see if it looks right
- Repeats

The Visual CMS replaces that feedback loop with this:
- Admin opens `admin.domain.com/home`
- The right half of the screen shows the **live public website in an iframe**
- As the admin types in a field on the left, the iframe **updates in real time**
- The admin sees exactly what the live site will look like before saving anything
- A language toggle lets them switch the preview between English and Bengali
- A device toggle lets them preview mobile vs desktop layout
- Save button works exactly as before — nothing changes about how data is stored

**What this is not:**
- It is not true inline editing (clicking directly on text in the page)
- It is not a new database system or content model
- It is not a rewrite of any existing page component
- It is not a separate preview server

**The core mechanism:**

```
Admin types in a field
    ↓
Admin panel holds a local "draft" copy of siteContent in React state
    ↓
useEffect fires → window.postMessage({ type: 'PREVIEW_UPDATE', payload: draft })
    ↓
iframe (packages/web running in preview mode) receives the message
    ↓
Preview mode intercepts the message and updates its local siteContent state
    ↓
Every component re-renders with the new value — same React tree, same CSS
    ↓
Admin sees the change instantly — without any API call or page reload
```

Save still goes through the existing PATCH API calls exactly as before.
The preview is purely a client-side state update. No new API routes needed.

---

## 2. Prerequisites — What Makes This Feasible Right Now

Reading the codebase confirms these existing properties that make the
Visual CMS a relatively contained addition:

### 2a. `siteContent` is already a single React context object

In `packages/web/src/App.jsx`, `siteContent` is fetched once and passed
via `useOutletContext()` to every page:

```jsx
// App.jsx (current)
const [siteContent, setSiteContent] = useState(null)

useEffect(() => {
  fetch(`${API_BASE}/api/content`)
    .then(r => r.json())
    .then(data => setSiteContent(data.data))
}, [])

return (
  <Routes>
    <Route element={<Layout siteContent={siteContent} language={language} ... />}>
      <Route path="/" element={<Home />} />
      ...
    </Route>
  </Routes>
)
```

Every page reads from this single object via `useOutletContext()`.
To inject preview content, we only need to override `setSiteContent` once —
in `App.jsx`. No page component needs to be touched.

### 2b. The `resolve(language, value)` pattern is consistent everywhere

Every bilingual string in every page goes through `resolve(language, { en, bn })`.
The language is passed as a prop, not a global. This means:
- Preview language toggle just changes the `language` prop passed to Layout
- No page component needs to know it's in preview mode

### 2c. Images use plain URL strings from siteContent

`hero.heroImage`, `member.image`, `program.image`, etc. are all plain URL strings
read from `siteContent`. A preview update that includes a new image URL will
immediately render it — even for images, the preview works without special handling.

### 2d. The admin already has typed data for every field

Every `BilingualField`, `MediaUploadField`, and other admin form components
already maintain local state in each editor page. The draft for a `postMessage`
is just that same local state, serialised and sent.

### 2e. `content-fallback.json` is the shape of `siteContent`

The fallback JSON at `packages/web/public/content-fallback.json` is exactly
the shape of the full `siteContent` object. This is the shape the preview
iframe will receive via `postMessage`.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  packages/admin  (admin.heritageofhopefoundation.org)               │
│                                                                     │
│  ┌─────────────┐   ┌──────────────────────────────────────────┐   │
│  │  Sidebar    │   │  Split pane (new)                        │   │
│  │  nav        │   │                                          │   │
│  │             │   │  ┌─────────────────┐  ┌──────────────┐  │   │
│  │  Home  ●    │   │  │  Edit panel     │  │  Preview     │  │   │
│  │  About      │   │  │                 │  │  pane        │  │   │
│  │  Gallery    │   │  │  [BilingualField]│  │              │  │   │
│  │  ...        │   │  │  [MediaUpload]  │  │  <iframe     │  │   │
│  │             │   │  │                 │  │   src="web/  │  │   │
│  │             │   │  │  [Save] ────────┼──┼─→ ?preview=1 │  │   │
│  │             │   │  │                 │  │   #/home">   │  │   │
│  │             │   │  │  onChange       │  │              │  │   │
│  │             │   │  │  → postMessage ─┼──┼─→ updates    │  │   │
│  │             │   │  │    (draft)      │  │   instantly  │  │   │
│  └─────────────┘   │  └─────────────────┘  └──────────────┘  │   │
│                   │                                            │   │
│                   │  Toolbar: [EN|BN] [Desktop|Mobile] [↗ Open]   │
│                   └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                      │ postMessage
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│  packages/web  (heritageofhopefoundation.org?preview=1)             │
│                                                                     │
│  App.jsx detects ?preview=1 → enters preview mode                  │
│  - Skips the /api/content fetch                                     │
│  - Loads content-fallback.json as initial state instead             │
│  - Registers window.addEventListener('message', handlePreview)      │
│  - handlePreview: validates origin, calls setSiteContent(payload)   │
│  - Every component re-renders with new data — normal React flow     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. New Files Required

```
packages/
├── admin/
│   └── src/
│       ├── components/
│       │   ├── PreviewPane.jsx          ← NEW: iframe wrapper + toolbar
│       │   ├── SplitLayout.jsx          ← NEW: resizable split panel shell
│       │   └── PreviewToolbar.jsx       ← NEW: EN/BN toggle, device toggle, open button
│       └── hooks/
│           └── usePreviewSync.js        ← NEW: postMessage sender hook
│
└── web/
    └── src/
        └── hooks/
            └── usePreviewMode.js        ← NEW: postMessage receiver in web App.jsx
```

Plus modifications to:
```
packages/admin/src/App.jsx               ← wrap editor routes in SplitLayout
packages/admin/src/pages/HomeEditor.jsx  ← add usePreviewSync hook call
packages/admin/src/pages/AboutEditor.jsx ← same
packages/admin/src/pages/...Editor.jsx   ← same for all editors
packages/web/src/App.jsx                 ← add usePreviewMode hook call
packages/web/src/index.css               ← no changes needed
```

---

## 5. Implementation — File by File

### 5.1 `packages/web/src/hooks/usePreviewMode.js`

This is the receiver. It runs inside the public web app when `?preview=1`
is in the URL. It listens for `postMessage` events from the admin iframe parent
and calls `setSiteContent` with the incoming payload.

```js
// packages/web/src/hooks/usePreviewMode.js

import { useEffect } from 'react'

/**
 * usePreviewMode
 *
 * Registers a postMessage listener when the app is loaded in preview mode
 * (i.e., inside the admin's PreviewPane iframe, URL has ?preview=1).
 *
 * When the admin panel sends a PREVIEW_UPDATE message, this hook calls
 * setSiteContent() with the new draft payload, causing all page components
 * to re-render with the updated content instantly.
 *
 * Security: only accepts messages from the admin panel origin, defined in
 * VITE_ADMIN_ORIGIN env var. Falls back to same-origin in development.
 *
 * @param {Function} setSiteContent - the setSiteContent state setter from App.jsx
 * @param {Function} setLanguage    - the setLanguage state setter from App.jsx
 * @returns {boolean} isPreviewMode - whether the app is currently in preview mode
 */
export function usePreviewMode(setSiteContent, setLanguage) {
  const isPreviewMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('preview')

  useEffect(() => {
    if (!isPreviewMode) return

    const ADMIN_ORIGIN = import.meta.env.VITE_ADMIN_ORIGIN || window.location.origin

    function handleMessage(event) {
      // Security: reject messages from unexpected origins
      if (event.origin !== ADMIN_ORIGIN) return

      const { type, payload } = event.data || {}

      if (type === 'PREVIEW_UPDATE' && payload) {
        setSiteContent(payload)
      }

      if (type === 'PREVIEW_LANGUAGE' && payload?.language) {
        setLanguage(payload.language)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isPreviewMode, setSiteContent, setLanguage])

  return isPreviewMode
}
```

### 5.2 Modification to `packages/web/src/App.jsx`

Three small changes:
1. Import `usePreviewMode`
2. Call it after state declarations
3. When in preview mode, skip the API fetch and load fallback JSON instead
   (so the iframe loads instantly without a network round-trip)

```jsx
// packages/web/src/App.jsx — diff-style — add these lines

import { usePreviewMode } from './hooks/usePreviewMode'   // ADD

function App() {
  const [siteContent, setSiteContent] = useState(null)
  const [language, setLanguage] = useState('en')

  // ADD — must be called before the fetch useEffect
  const isPreviewMode = usePreviewMode(setSiteContent, setLanguage)

  useEffect(() => {
    // MODIFY — skip normal fetch in preview mode; load fallback instead
    if (isPreviewMode) {
      fetch('/content-fallback.json')
        .then(r => r.json())
        .then(data => setSiteContent(data.data ?? data))
        .catch(() => setSiteContent({}))
      return
    }

    // Existing fetch logic unchanged below this line
    const controller = new AbortController()
    // ... rest of existing fetch code
  }, [isPreviewMode])

  // Rest of App.jsx unchanged
}
```

Why load `content-fallback.json` instead of waiting for the first postMessage?
Because the iframe needs to render something immediately — otherwise the admin
sees a blank white pane for 1–2 seconds before the first draft is sent.
The fallback JSON contains the current live content, so the preview starts
showing the real site, then live-updates as the admin types.

### 5.3 `packages/admin/src/hooks/usePreviewSync.js`

This is the sender. Every editor page calls this hook. It receives the current
local draft state and sends it to the iframe whenever it changes.

```js
// packages/admin/src/hooks/usePreviewSync.js

import { useEffect, useRef, useCallback } from 'react'

/**
 * usePreviewSync
 *
 * Sends the current draft content to the preview iframe via postMessage
 * whenever the draft changes. Debounced to 150ms to avoid sending on every
 * keystroke.
 *
 * @param {React.RefObject} iframeRef - ref pointing to the preview <iframe>
 * @param {object} draft             - the current local editor state
 *                                     (shaped like a partial siteContent object)
 * @param {string} page              - which page this editor controls
 *                                     ('home', 'about', 'gallery', etc.)
 * @param {object} fullContent       - the full siteContent object from the API,
 *                                     used as the base that draft is merged into
 */
export function usePreviewSync(iframeRef, draft, page, fullContent) {
  const debounceRef = useRef(null)

  const sendUpdate = useCallback(() => {
    const iframe = iframeRef?.current
    if (!iframe || !fullContent) return

    // Merge draft into the full content object under the correct page key
    // This means partial edits (e.g., only home.hero.headline) still show
    // the rest of the page correctly
    const merged = {
      ...fullContent,
      [page]: {
        ...fullContent[page],
        ...draft,
      },
    }

    iframe.contentWindow?.postMessage(
      { type: 'PREVIEW_UPDATE', payload: merged },
      import.meta.env.VITE_WEB_ORIGIN || window.location.origin,
    )
  }, [iframeRef, draft, page, fullContent])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(sendUpdate, 150)
    return () => clearTimeout(debounceRef.current)
  }, [sendUpdate])
}
```

### 5.4 `packages/admin/src/components/PreviewPane.jsx`

The iframe wrapper. Handles loading state, responsive sizing, and exposes
the ref needed by `usePreviewSync`.

```jsx
// packages/admin/src/components/PreviewPane.jsx

import { useState, forwardRef } from 'react'

const PREVIEW_ORIGIN = import.meta.env.VITE_WEB_ORIGIN || 'http://localhost:5173'

const DEVICE_SIZES = {
  desktop: { width: '100%',  label: 'Desktop' },
  tablet:  { width: '768px', label: 'Tablet'  },
  mobile:  { width: '390px', label: 'Mobile'  },
}

/**
 * PreviewPane
 * Renders the public website in an iframe for live preview.
 * Exposed as a forwardRef so the parent can get the iframe DOM ref.
 *
 * Props:
 *   page     — the route path to open in the preview ('/', '/about', etc.)
 *   device   — 'desktop' | 'tablet' | 'mobile'
 *   language — 'en' | 'bn' (sent via postMessage to switch language)
 */
const PreviewPane = forwardRef(function PreviewPane(
  { page = '/', device = 'desktop', language = 'en', iframeRef },
  _ref,
) {
  const [loaded, setLoaded] = useState(false)
  const deviceSize = DEVICE_SIZES[device] || DEVICE_SIZES.desktop

  // Build the preview URL — adds ?preview=1 so web App.jsx enters preview mode
  const previewUrl = `${PREVIEW_ORIGIN}${page}?preview=1`

  return (
    <div className="preview-pane">
      <div className="preview-pane-inner" style={{ maxWidth: deviceSize.width }}>
        {!loaded && (
          <div className="preview-loading">
            <div className="preview-loading-spinner" />
            <p>Loading preview...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={previewUrl}
          title={`Preview — ${page}`}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
          // sandbox allows scripts and same-origin but blocks popups/forms
          // Do NOT add allow-forms — forms in preview should not submit
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
})

export default PreviewPane
```

### 5.5 `packages/admin/src/components/PreviewToolbar.jsx`

The toolbar that sits above the preview pane. Controls device size, language,
and provides an "open in new tab" button.

```jsx
// packages/admin/src/components/PreviewToolbar.jsx

export default function PreviewToolbar({
  device, setDevice,
  language, setLanguage,
  previewPage,
  iframeRef,
}) {
  const WEB_ORIGIN = import.meta.env.VITE_WEB_ORIGIN || 'http://localhost:5173'

  function sendLanguage(lang) {
    setLanguage(lang)
    iframeRef?.current?.contentWindow?.postMessage(
      { type: 'PREVIEW_LANGUAGE', payload: { language: lang } },
      WEB_ORIGIN,
    )
  }

  return (
    <div className="preview-toolbar">
      {/* Language toggle */}
      <div className="preview-toolbar-group">
        <button
          className={`preview-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => sendLanguage('en')}
        >EN</button>
        <button
          className={`preview-btn ${language === 'bn' ? 'active' : ''}`}
          onClick={() => sendLanguage('bn')}
        >বাংলা</button>
      </div>

      {/* Device toggle */}
      <div className="preview-toolbar-group">
        {['desktop', 'tablet', 'mobile'].map((d) => (
          <button
            key={d}
            className={`preview-btn ${device === d ? 'active' : ''}`}
            onClick={() => setDevice(d)}
          >
            {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📲'}
            {' '}{d}
          </button>
        ))}
      </div>

      {/* Open in new tab */}
      <a
        className="preview-btn preview-btn-open"
        href={`${WEB_ORIGIN}${previewPage}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        ↗ Open live site
      </a>
    </div>
  )
}
```

### 5.6 `packages/admin/src/components/SplitLayout.jsx`

The split pane shell. Left side: editor form. Right side: preview.
Includes a drag handle for resizing and a collapse toggle.

```jsx
// packages/admin/src/components/SplitLayout.jsx

import { useState, useRef, useCallback, useEffect } from 'react'
import PreviewPane from './PreviewPane'
import PreviewToolbar from './PreviewToolbar'

/**
 * SplitLayout
 * Wraps an editor page with a resizable split panel.
 * Left: children (the editor form).
 * Right: PreviewPane (live iframe).
 *
 * Props:
 *   children     — the editor form content (left side)
 *   previewPage  — URL path for the preview iframe ('/', '/about', etc.)
 *   iframeRef    — React ref passed down to PreviewPane → iframe element
 *   previewOpen  — boolean, can be controlled from outside to collapse preview
 */
export default function SplitLayout({ children, previewPage, iframeRef }) {
  const [splitPct, setSplitPct] = useState(48)   // left panel as % of total width
  const [previewOpen, setPreviewOpen] = useState(true)
  const [device, setDevice] = useState('desktop')
  const [language, setLanguage] = useState('en')
  const containerRef = useRef(null)
  const dragging = useRef(false)

  // Drag-to-resize logic
  const onMouseDown = useCallback(() => { dragging.current = true }, [])
  const onMouseUp   = useCallback(() => { dragging.current = false }, [])
  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPct(Math.min(Math.max(pct, 25), 75))   // clamp 25%–75%
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [onMouseUp, onMouseMove])

  return (
    <div className="split-layout" ref={containerRef}>
      {/* Left — editor panel */}
      <div
        className="split-editor"
        style={{ width: previewOpen ? `${splitPct}%` : '100%' }}
      >
        <div className="split-editor-inner">
          {children}
        </div>
      </div>

      {/* Drag handle */}
      {previewOpen && (
        <div className="split-handle" onMouseDown={onMouseDown} title="Drag to resize" />
      )}

      {/* Right — preview panel */}
      {previewOpen && (
        <div className="split-preview" style={{ width: `${100 - splitPct}%` }}>
          <PreviewToolbar
            device={device}
            setDevice={setDevice}
            language={language}
            setLanguage={setLanguage}
            previewPage={previewPage}
            iframeRef={iframeRef}
          />
          <PreviewPane
            page={previewPage}
            device={device}
            language={language}
            iframeRef={iframeRef}
          />
        </div>
      )}

      {/* Collapse/expand toggle button */}
      <button
        className="split-toggle"
        onClick={() => setPreviewOpen(v => !v)}
        title={previewOpen ? 'Hide preview' : 'Show preview'}
      >
        {previewOpen ? '⟩' : '⟨ Preview'}
      </button>
    </div>
  )
}
```

### 5.7 How Each Editor Page Gets Wired — HomeEditor.jsx Example

The pattern for every editor page is the same. Using `HomeEditor.jsx` as the
concrete example since it's the most complex:

```jsx
// packages/admin/src/pages/HomeEditor.jsx — additions only

import { useRef } from 'react'                              // ADD
import SplitLayout from '../components/SplitLayout'        // ADD
import { usePreviewSync } from '../hooks/usePreviewSync'   // ADD

export default function HomeEditor() {
  const iframeRef = useRef(null)                           // ADD

  // existing state declarations...
  const [heroData, setHeroData] = useState({})
  const [pageContent, setPageContent] = useState({})
  // ... etc

  // Compose the draft that mirrors the siteContent.home shape
  // This is what gets sent to the preview iframe
  const draft = {                                          // ADD
    hero: heroData,
    pageContent: pageContent,
    impactMetrics: metrics,
    featuredPrograms: programs,
    facebookPosts: posts,
    showcaseImages: showcaseImages,
    mission: { heading: missionHeading },
    cta: ctaData,
    trustBadges: trustBadges,
  }

  // Wire the preview sync — fires on every draft change, debounced 150ms
  const fullContent = /* read from context or refetch once */ {}
  usePreviewSync(iframeRef, draft, 'home', fullContent)   // ADD

  // Wrap the entire return in SplitLayout
  return (
    <SplitLayout previewPage="/" iframeRef={iframeRef}>   {/* ADD wrapper */}
      {/* All existing editor form JSX goes here, completely unchanged */}
      <div className="editor-page">
        <h1>Home Page Editor</h1>
        {/* Hero section, Stats section, CTA section, etc. */}
        {/* Nothing inside here changes */}
      </div>
    </SplitLayout>                                         {/* ADD close */}
  )
}
```

The same pattern applies to every editor:

| Editor file | `previewPage` value | Draft shape key |
|---|---|---|
| `HomeEditor.jsx` | `"/"` | `home` |
| `AboutEditor.jsx` | `"/about"` | `about` |
| `OurWorkEditor.jsx` | `"/our-work"` | `ourWork` |
| `ImpactEditor.jsx` | `"/impact"` | `impact` |
| `GalleryManager.jsx` | `"/gallery"` | `gallery` |
| `GetInvolvedEditor.jsx` | `"/get-involved"` | `getInvolved` |
| `ContactEditor.jsx` | `"/contact"` | `contact` |
| `ActivityPostsEditor.jsx` | `"/"` | `home` (posts appear on home) |
| `ProgramsEditor.jsx` | `"/our-work"` | `ourWork` |
| `TeamEditor.jsx` | `"/about"` | `about` |
| `DocumentsEditor.jsx` | `"/about"` | `about` |
| `PartnersEditor.jsx` | `"/about"` | `about` |
| `Settings.jsx` | `"/"` | `siteMeta` |
| `ThankYouEditor.jsx` | `"/thank-you"` | `thankYou` |
| `NotFoundEditor.jsx` | `"/404"` | `notFound` |

---

## 6. The `fullContent` Problem — How the Editor Knows the Full siteContent Shape

`usePreviewSync` merges the draft into `fullContent` before sending.
But where does `fullContent` come from in the admin?

**Option A (recommended): Fetch it once from the public API on admin load**

In `packages/admin/src/App.jsx`, add a single fetch of `GET /api/content`
that stores the full siteContent object in React context. Every editor page
can then access it via `useContext(SiteContentContext)`.

```jsx
// packages/admin/src/App.jsx — additions

const SiteContentContext = createContext(null)

function AdminApp() {
  const [fullSiteContent, setFullSiteContent] = useState(null)

  useEffect(() => {
    // Fetch from the public web API — no auth needed
    fetch(`${import.meta.env.VITE_API_BASE}/api/content`)
      .then(r => r.json())
      .then(d => setFullSiteContent(d.data))
      .catch(() => {
        // Fallback: try to load the static fallback
        fetch('/content-fallback.json').then(r => r.json()).then(setFullSiteContent)
      })
  }, [])

  return (
    <SiteContentContext.Provider value={fullSiteContent}>
      {/* existing admin router */}
    </SiteContentContext.Provider>
  )
}

export { SiteContentContext }
```

Then in `usePreviewSync`:
```js
const fullContent = useContext(SiteContentContext)
```

When the admin saves a field, call `invalidateCache` (already happens via
the existing admin API). After a successful save, refetch `fullSiteContent`
to keep it in sync. This fetch is cheap — the response is cached in the API
for 60 seconds.

---

## 7. CSS for the Split Layout

These classes need to be added to `packages/admin/src/index.css`.
They do not touch any existing classes.

```css
/* ── Split Layout ─────────────────────────────────────────────── */

.split-layout {
  display: flex;
  height: calc(100vh - 60px); /* subtract AdminLayout header height */
  overflow: hidden;
  position: relative;
}

.split-editor {
  overflow-y: auto;
  flex-shrink: 0;
  transition: width 0.1s;
  border-right: 1px solid var(--border);
}

.split-editor-inner {
  padding: 1.5rem 2rem;
  min-height: 100%;
}

.split-handle {
  width: 6px;
  cursor: col-resize;
  background: var(--border);
  flex-shrink: 0;
  transition: background 0.15s;
  user-select: none;
}
.split-handle:hover {
  background: var(--accent, #1a4f8a);
}

.split-preview {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  background: #f0f0f0;
}

.split-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 6px 0 0 6px;
  padding: 0.5rem 0.4rem;
  cursor: pointer;
  font-size: 12px;
  writing-mode: vertical-rl;
  z-index: 10;
}

/* ── Preview Toolbar ──────────────────────────────────────────── */

.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface, #fff);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.preview-toolbar-group {
  display: flex;
  gap: 2px;
  background: var(--bg, #f5f5f5);
  border-radius: 6px;
  padding: 2px;
}

.preview-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  white-space: nowrap;
}
.preview-btn.active {
  background: var(--surface, #fff);
  color: var(--text-primary);
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.preview-btn-open {
  margin-left: auto;
  text-decoration: none;
  color: var(--accent, #1a4f8a);
}

/* ── Preview Pane ─────────────────────────────────────────────── */

.preview-pane {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  background: #e8e8e8;
  padding: 1rem;
}

.preview-pane-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  overflow: hidden;
  transition: max-width 0.25s ease;
}

.preview-pane-inner iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.preview-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #fff;
  z-index: 1;
}

.preview-loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent, #1a4f8a);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg) } }
```

---

## 8. Environment Variables to Add

```bash
# packages/admin/.env.production
VITE_WEB_ORIGIN=https://heritageofhopefoundation.org

# packages/admin/.env.development
VITE_WEB_ORIGIN=http://localhost:5173

# packages/web/.env.production
VITE_ADMIN_ORIGIN=https://admin.heritageofhopefoundation.org

# packages/web/.env.development (already exists for API_BASE)
VITE_ADMIN_ORIGIN=http://localhost:5174
```

---

## 9. Security Considerations

### postMessage origin validation (critical)

Both sides must validate the `event.origin` in the `message` event handler.
The web app rejects any postMessage not from `VITE_ADMIN_ORIGIN`.
The admin rejects any response message not from `VITE_WEB_ORIGIN`.
This is already included in `usePreviewMode.js` above.

### iframe sandbox

The `sandbox="allow-scripts allow-same-origin"` attribute on the preview iframe:
- Allows JavaScript to run (needed for React to work)
- Allows same-origin API calls
- Blocks form submissions (prevents the preview from accidentally sending contact forms)
- Blocks navigation away from the preview URL
- Blocks popups

### No admin data leaks into public

The postMessage only sends the `siteContent` payload — the same data that
`GET /api/content` returns publicly. It never contains JWT tokens, admin
credentials, or any data not already public.

### Preview mode does not affect production users

The `?preview=1` query param triggers preview mode. Normal visitors never
have this param in their URL, so `usePreviewMode` returns `false` for them
and the normal API fetch runs as always. Zero impact on public site performance.

---

## 10. Scroll Synchronisation (Optional Enhancement)

After the core feature is working, a scroll sync can be added:
when the admin scrolls to the Stats section in the editor, the preview
automatically scrolls to show the Stats section.

Implementation:
```js
// In each editor section's scroll handler or IntersectionObserver:
iframeRef.current?.contentWindow?.postMessage({
  type: 'PREVIEW_SCROLL',
  payload: { section: 'stats' }  // or a CSS selector
}, WEB_ORIGIN)

// In usePreviewMode:
if (type === 'PREVIEW_SCROLL') {
  document.querySelector(payload.section)?.scrollIntoView({ behavior: 'smooth' })
}
```

This is not in scope for the initial implementation but the message channel
infrastructure supports it at zero extra cost.

---

## 11. Build Phases

### Phase 1 — Foundation (do first, verify before proceeding)

- [ ] Create `feature/visual-cms` branch from `main`
- [ ] Add `VITE_WEB_ORIGIN` to admin `.env.development` and `.env.production`
- [ ] Add `VITE_ADMIN_ORIGIN` to web `.env.development` and `.env.production`
- [ ] Create `packages/web/src/hooks/usePreviewMode.js`
- [ ] Modify `packages/web/src/App.jsx` to call `usePreviewMode`
- [ ] Test: open `http://localhost:5173/?preview=1` in browser, open browser console,
      run `window.postMessage({ type: 'PREVIEW_UPDATE', payload: {...} }, '*')`,
      verify the page re-renders with the new content
- [ ] Create `packages/admin/src/hooks/usePreviewSync.js`
- [ ] Add `SiteContentContext` to `packages/admin/src/App.jsx`

### Phase 2 — UI Shell

- [ ] Create `packages/admin/src/components/PreviewPane.jsx`
- [ ] Create `packages/admin/src/components/PreviewToolbar.jsx`
- [ ] Create `packages/admin/src/components/SplitLayout.jsx`
- [ ] Add split layout CSS to `packages/admin/src/index.css`
- [ ] Test: wrap `HomeEditor.jsx` in `SplitLayout`, verify iframe loads the public site
- [ ] Test: verify the toolbar language toggle sends `PREVIEW_LANGUAGE` message and
      the iframe switches language
- [ ] Test: verify device size toggle changes the iframe max-width

### Phase 3 — Wire One Editor (HomeEditor.jsx first)

- [ ] Add `iframeRef` to `HomeEditor.jsx`
- [ ] Add `usePreviewSync` call with the correct `draft` shape for `home`
- [ ] Test: type in the Hero Headline field → verify iframe updates within 150ms
- [ ] Test: change a hero image → verify new image appears in preview
- [ ] Test: save → verify live site reflects the change (existing behaviour)
- [ ] Test: open on mobile screen → verify split layout collapses gracefully

### Phase 4 — Wire All Remaining Editors

Apply the same pattern to each editor in this order (by client usage frequency):

- [ ] `AboutEditor.jsx`
- [ ] `ActivityPostsEditor.jsx`
- [ ] `GetInvolvedEditor.jsx`
- [ ] `GalleryManager.jsx`
- [ ] `ImpactEditor.jsx`
- [ ] `OurWorkEditor.jsx`
- [ ] `ContactEditor.jsx`
- [ ] `ProgramsEditor.jsx`
- [ ] `TeamEditor.jsx`
- [ ] `DocumentsEditor.jsx`
- [ ] `PartnersEditor.jsx`
- [ ] `Settings.jsx`
- [ ] `ThankYouEditor.jsx`
- [ ] `NotFoundEditor.jsx`

### Phase 5 — Polish and Edge Cases

- [ ] Handle iframe load failure gracefully (show error state with link to open site directly)
- [ ] Add "Preview is live — changes not yet saved" banner in preview toolbar
      when draft differs from saved state
- [ ] Handle the case where the public site is down (preview shows error, editor still works)
- [ ] Mobile/tablet admin: on screens < 1024px, hide preview by default
      (split layout defaults to `previewOpen = false` on small screens)
- [ ] Add `aria-label` and focus management so keyboard users can switch between panes
- [ ] Test in Chrome, Firefox, Safari

### Phase 6 — Deploy

- [ ] Verify `VITE_WEB_ORIGIN` is set correctly in Vercel admin project env vars
- [ ] Verify `VITE_ADMIN_ORIGIN` is set correctly in Vercel web project env vars
- [ ] Deploy admin to Vercel — verify iframe loads public site correctly in production
- [ ] Test postMessage across actual deployed origins (not just localhost)
- [ ] Run existing e2e test suite — verify no regressions
- [ ] Merge `feature/visual-cms` → `main`

---

## 12. What Explicitly Does NOT Change

- The database schema — zero changes
- Any Prisma model — zero changes
- Any API route — zero new routes, zero modifications
- Any public web page component (Home.jsx, About.jsx, etc.) — zero changes
- Any admin form field or save logic — zero changes
- The `resolve(language, value)` pattern — unchanged
- The `content-fallback.json` generation workflow — unchanged
- The Sentry integration — unchanged
- Deployment configuration — unchanged except two new env vars

The Visual CMS is purely additive. It adds a new way to view the result of edits
that were already possible. If the feature branch is deleted tomorrow, every
admin editor works exactly as it did before.

---

## 13. Estimated Effort

| Phase | Files changed | Estimated time |
|---|---|---|
| Phase 1 — Foundation | 2 files | 2–3 hours |
| Phase 2 — UI Shell | 4 new files + 1 CSS file | 3–4 hours |
| Phase 3 — Wire HomeEditor | 1 file | 1–2 hours |
| Phase 4 — Wire all remaining editors | 14 files | 4–6 hours |
| Phase 5 — Polish | Various | 2–3 hours |
| Phase 6 — Deploy and test | Config + e2e | 1–2 hours |
| **Total** | **~25 files touched** | **~14–20 hours** |

The majority of that time is Phase 4 — which is highly repetitive and mechanical.
The pattern is established in Phase 3; Phase 4 is applying it 14 times.
