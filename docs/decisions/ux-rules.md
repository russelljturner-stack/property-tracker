# UX Rules and Business Logic

This document captures confirmed UX patterns and business rules for the Property Development Tracker.

---

## Editing Rules

| Rule | Description |
|------|-------------|
| **Who can edit** | Any logged-in user (role-based permissions to be added later) |
| **Save method** | Manual save - user clicks "Save" to commit changes |
| **Validation timing** | Validate on save, show errors inline next to fields |
| **Unsaved changes** | Prompt "You have unsaved changes" if user tries to navigate away |
| **Cancel behaviour** | Discard all changes and return to view mode |
| **Review before save** | User can review their changes before clicking Save |

---

## Saving Rules

| Rule | Description |
|------|-------------|
| **Confirmation method** | Server-confirmed - wait for database response before showing success |
| **Success feedback** | Brief "Saved" toast/message, then return to view mode |
| **Error handling** | Stay in edit mode, show error message, let user retry |
| **Concurrent edits** | "Last write wins" (no locking) - may revisit if issues arise |
| **Audit trail** | Record who changed what and when (`updatedAt` + `updatedBy` fields) |

---

## Deletion Rules

| What | Rule |
|------|------|
| **Sub-records** (docs, notes, tasks) | User can delete with confirmation dialog |
| **Development records** | **Requires manager approval** - not allowed without approval |
| **Confirmation** | Always require "Are you sure?" confirmation for any delete |
| **Delete type** | Hard delete (no recycle bin) - hence confirmation is critical |
| **Undo** | No undo available - deletion is permanent |

### Approval Workflow (for Development Deletion)

1. User requests deletion from "Danger Zone" settings area
2. Request goes to manager for approval
3. Manager approves or rejects
4. If approved, deletion proceeds
5. If rejected, user is notified with reason

---

## Card/Section Behaviour

### States

| State | What's Shown |
|-------|--------------|
| **Collapsed** | Header bar only (icon + title + status badge + expand chevron) |
| **Expanded (View)** | All fields in read-only mode, "Edit" button visible |
| **Expanded (Edit)** | All fields as form inputs, "Save" and "Cancel" buttons |

### Expand/Collapse Rules

| Device | Behaviour |
|--------|-----------|
| **Desktop** | Multiple sections can be open simultaneously |
| **Mobile** | Only one section open at a time (opening a new one closes the previous) |

---

## Required Fields

To be defined when building the "New Development" form. For editing existing records, required fields that already have values cannot be cleared.

---

## Audit Trail

All editable records should track:
- `updatedAt` - timestamp of last change
- `updatedBy` - user ID of who made the change

*Note: Schema update needed to add `updatedBy` field.*

---

## List Filtering and Navigation

### List Pages (Sites, Developments)

| Feature | Description |
|---------|-------------|
| **Sorting** | Click column headers to sort by that column |
| **Filtering** | Filter by key fields (status, owner, stage, etc.) |
| **Persist filters** | Filters stay in URL so they can be bookmarked/shared |

### Detail Page Navigation

When viewing a detail page after filtering a list:

| Feature | Description |
|---------|-------------|
| **Prev/Next arrows** | Navigate through filtered results without returning to list |
| **Position indicator** | Show "3 of 12" style indicator |
| **Back to list** | Return to list with filters preserved |

### Technical Approach

- Filters stored in URL query parameters (e.g., `/developments?status=active&owner=5`)
- Detail page receives filter context to know prev/next IDs
- Prev/next arrows pass filters through to maintain context

---

## Brand & Styling

This section defines the visual design system for the Property Development Tracker.

### Tailwind Configuration

The brand colours are defined in `tailwind.config.ts` and can be used throughout the app:

```ts
// Use these Tailwind classes:
// - text-teal, bg-teal, border-teal (and -light/-dark variants)
// - text-coral, bg-coral, border-coral (and -light/-dark variants)
// - bg-ocean, bg-electric
// - bg-brand-grey, bg-brand-offwhite, bg-brand-black
```

### Colour Palette

| Colour | Hex | Tailwind Class | Usage |
|--------|-----|----------------|-------|
| Dark Teal | `#1e434d` | `text-teal`, `bg-teal` | Primary text, headings, page titles, primary buttons |
| Coral | `#fa6e60` | `text-coral`, `bg-coral` | Accent colour, CTAs, icons, links, hover states, page headers |
| Ocean Blue | `#0078a0` | `bg-ocean` | Sidebar backgrounds, secondary sections |
| Electric Blue | `#007aee` | `bg-electric` | High-emphasis elements (What's Next, Planning Score) |
| Grey | `#6b7280` | `bg-brand-grey` | Site Context background, muted sections |
| Off-white | `#f8f8f8` | `bg-brand-offwhite` | Page background |
| White | `#ffffff` | `bg-white` | Cards, content blocks |
| Black | `#000000` | `bg-brand-black` | Activity section, high contrast areas |

### Page Titles and Headings

| Element | Classes |
|---------|---------|
| **h1 (Page title)** | `text-2xl font-bold text-teal` |
| **h2 (Section header)** | `text-lg font-semibold text-teal` |
| **h3 (Card header)** | `text-lg font-semibold text-teal` |
| **Headings on dark backgrounds** | `text-lg font-semibold text-white` |

### Button Styles

| Type | Classes |
|------|---------|
| **Primary button** | `px-4 py-2 bg-teal text-white rounded-full hover:bg-coral transition-colors` |
| **Secondary link** | `text-coral hover:text-coral-dark` |
| **Edit button** | `px-3 py-1.5 text-sm text-teal hover:text-white hover:bg-coral rounded-full` |
| **Cancel button** | `px-4 py-2 text-sm text-teal hover:bg-gray-100 rounded-full` |
| **Save button** | `px-4 py-2 text-sm bg-teal text-white hover:bg-coral rounded-full` |

### Card Styles

**Standard Card (white header / grey content):**

Used for sidebar cards (Key Contacts, Internal Team, Quick Info, etc.)

```jsx
<section className="bg-white shadow" style={{ borderRadius: 0 }}>
  {/* White header with border */}
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Card Title</h3>
  </div>
  {/* Grey content area */}
  <div className="px-6 py-4 bg-gray-50">
    {/* Content */}
  </div>
</section>
```

**Stage Cards (expandable):**

Used for workflow stages (Commercial, Design, Planning, etc.)

```jsx
<section className="bg-white shadow" style={{ borderRadius: 0 }}>
  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <h2 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Stage Title</h2>
    <button>Edit</button>
  </div>
  <div className="p-6">
    {/* Expanded content */}
  </div>
</section>
```

**Blue Feature Cards:**

Used for high-emphasis sections (Panel Configuration)

```jsx
<section className="shadow" style={{ backgroundColor: '#007aee', borderRadius: 0 }}>
  <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
    <h2 className="text-lg font-semibold text-white">Card Title</h2>
  </div>
  <div className="p-6">
    {/* Content with white/70 labels, white values */}
  </div>
</section>
```

### Summary/Stat Cards

```jsx
<div className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
  <p className="text-sm text-gray-500">Label</p>
  <p className="text-2xl font-bold text-teal">42</p>
</div>
```

### Page Layout Patterns

| Element | Style |
|---------|-------|
| **Development page header** | Coral background, white text, sticky at top (`sticky top-0 z-10 -mt-4 sm:-mt-6 lg:-mt-8`) |
| **Site Context section** | Grey background (`#6b7280`), white text, sits below header |
| **Two-column layout** | `grid-cols-1 lg:grid-cols-4`, main content 3/4 width, sidebar 1/4 width |
| **Sidebar (development detail)** | Ocean blue background, white cards inside |
| **Cards** | White background, no border-radius (`borderRadius: 0`), shadow |

### Badges and Pills

**Count Badge (e.g., Tasks "3 open"):**

```jsx
<span
  className="text-sm font-medium px-3 py-1 rounded-full"
  style={{
    backgroundColor: count > 0 ? '#fa6e60' : '#10b981',  // Coral if active, green if zero
    color: '#ffffff'
  }}
>
  {count} open
</span>
```

**Status Badge (on dark backgrounds):**

```jsx
<span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
  Status Text
</span>
```

**Priority Badge:**

```jsx
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
  HIGH
</span>
```

**Type/Category Badge:**

```jsx
<span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
  Category
</span>
```

### Expandable Components

**Tasks Card (client component with expand/collapse):**

- Shows first 5 items by default
- "View all (X)" button expands to show all items
- "Show less" button collapses back to 5 items
- Header shows count in prominent pill badge

```jsx
// Header with count badge
<div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
  <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Tasks</h3>
  <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#fa6e60', color: '#fff' }}>
    3 open
  </span>
</div>

// Footer with expand button
<div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
  <button className="text-sm" style={{ color: '#fa6e60' }}>+ Add Task</button>
  <button onClick={toggle} className="text-sm" style={{ color: '#fa6e60' }}>
    {isExpanded ? 'Show less' : `View all (${count})`}
  </button>
</div>
```

### Image Containers

**Panel/Design Images:**

- Square corners (no border-radius)
- Annotation text below showing status
- Top-aligned with adjacent content using `items-start` on parent grid

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
  {/* Content column */}
  <div className="lg:col-span-2">...</div>

  {/* Image column - aligned to top */}
  <div className="lg:col-span-1">
    <div className="aspect-[4/3] bg-white overflow-hidden">
      <img src={url} className="w-full h-full object-contain" />
    </div>
    <p className="text-sm text-white/70 text-center italic">Design Final</p>
  </div>
</div>
```

### Component Patterns

| Component | Style |
|-----------|-------|
| **Stage card icons** | Coral SVG line icons (stroke, not fill), `strokeWidth={2}` |
| **Navigation icons** | White on coral/dark backgrounds, dark teal on light |
| **Activity section** | Black background, coral icons, white text |
| **What's Next prompt** | Electric blue background, white text, coral icon for high priority |
| **Status badges** | Semi-transparent white (`bg-white/20`) on dark backgrounds |
| **Planning Score badge** | Electric blue pill with white text |
| **View all links** | `text-sm text-coral hover:text-coral-dark` |

### Typography

| Element | Font | Weight | Colour |
|---------|------|--------|--------|
| Headings (h1-h6) | Montserrat | Bold | Dark teal (`text-teal`) |
| Body text | Roboto | Normal | Dark teal |
| Labels/captions | Roboto | Semibold | Grey or white on dark |
| Card header titles | — | Semibold, tracking-tight | Dark teal (`text-teal`) |

### Icon Style

- Use **SVG line icons** (stroke-based, not filled)
- `strokeWidth={2}` for consistency
- Colour: coral on dark backgrounds, dark teal on light backgrounds
- Size: `w-5 h-5` for inline, `w-6 h-6` for feature/nav icons, `w-12 h-12` for large indicators

### Border Radius

- **Cards and sections**: No border radius (`borderRadius: 0`) - sharp edges
- **Badges and pills**: Full radius (`rounded-full`)
- **Buttons**: Pill shape (`rounded-full`)
- **Form inputs**: No border radius, use `style={{ borderRadius: 0 }}`

### Form Input Style

```jsx
<input
  className="w-full px-3 py-2.5 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
  style={{ borderRadius: 0, backgroundColor: '#f8f8f8' }}
/>
```

---

*Last updated: 15 January 2026*
