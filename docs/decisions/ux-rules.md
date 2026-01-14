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

## Brand & Styling (Wildstone)

### Colour Palette

| Colour | Hex | CSS Variable | Usage |
|--------|-----|--------------|-------|
| Dark Teal | `#1e434d` | `--color-primary` | Primary text, headings, icons on light backgrounds |
| Coral | `#fa6e60` | `--color-accent` | Accent colour, CTAs, icons on dark backgrounds, page headers |
| Ocean Blue | `#0078a0` | `--color-section-blue` | Sidebar backgrounds, secondary sections |
| Vibrant Blue | `#007aee` | `--color-section-electric` | High-emphasis elements (What's Next, Planning Score) |
| Grey | `#6b7280` | — | Site Context background, muted sections |
| Off-white | `#f8f8f8` | `--color-bg-light` | Page background |
| White | `#ffffff` | `--color-bg-white` | Cards, content blocks |
| Black | `#000000` | `--color-bg-dark` | Activity section, high contrast areas |

### Page Layout Patterns

| Element | Style |
|---------|-------|
| **Page header** | Coral background, white text, sticky at top (`sticky top-0 z-10`) |
| **Site Context section** | Grey background (`#6b7280`), white text, sits below header |
| **Main content** | 3/4 width left column on desktop |
| **Sidebar** | 1/4 width right column, ocean blue background |
| **Cards** | White background, no border-radius (`borderRadius: 0`), shadow |
| **Card headers** | Dark teal text, `text-lg` or `text-xl`, uppercase tracking for labels |

### Component Patterns

| Component | Style |
|-----------|-------|
| **Stage card icons** | Coral SVG line icons (stroke, not fill), `strokeWidth={2}` |
| **Navigation icons** | White on coral/dark backgrounds, dark teal on light |
| **Activity section** | Black background, coral icons, white text |
| **What's Next prompt** | Vibrant blue background, white text, coral icon for high priority |
| **Status badges** | Semi-transparent white (`bg-white/20`) on dark backgrounds |
| **Planning Score badge** | Vibrant blue pill with white text |

### Typography

| Element | Font | Weight | Colour |
|---------|------|--------|--------|
| Headings (h1-h6) | Montserrat | Bold | Dark teal |
| Body text | Roboto | Normal | Dark teal |
| Labels/captions | Roboto | Semibold | Grey or white/90 on dark |
| Section titles | Roboto | Semibold, uppercase, tracking-wider | Varies by background |

### Icon Style

- Use **SVG line icons** (stroke-based, not filled)
- `strokeWidth={2}` for consistency
- Colour: coral on dark backgrounds, dark teal on light backgrounds
- Size: `w-5 h-5` for inline, `w-6 h-6` for feature icons, `w-12 h-12` for large indicators

### Border Radius

- **Cards and sections**: No border radius (`borderRadius: 0`) - sharp edges
- **Badges and pills**: Full radius (`rounded-full` or `rounded`)
- **Buttons**: Rounded (`rounded` or `rounded-full` for pill buttons)

---

*Last updated: 14 January 2026*
