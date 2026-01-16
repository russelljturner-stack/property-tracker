"use client"

/**
 * ExpandableCard Component
 *
 * A reusable card component that supports:
 * - Expand/collapse functionality (click header to toggle)
 * - View mode (read-only display of data)
 * - Edit mode (form inputs for editing)
 * - Save/Cancel with validation
 *
 * This is a "client component" because it uses React state (useState)
 * for tracking whether the card is expanded and whether we're in edit mode.
 */

import { useState, useCallback, ReactNode } from "react"

// Types for the component props
export type ExpandableCardProps = {
  /** Title shown in the header */
  title: string
  /** Icon shown before the title - can be emoji string or ReactNode (SVG) */
  icon: ReactNode
  /** Whether this is the current active stage */
  isActive?: boolean
  /** Whether this stage is complete */
  isComplete?: boolean
  /** Whether the card starts expanded */
  defaultExpanded?: boolean
  /** Summary content shown in collapsed state (and at top of expanded state) */
  summaryContent?: ReactNode
  /** Full content shown only when expanded (view mode) */
  viewContent?: ReactNode
  /** Form content shown when in edit mode */
  editContent?: ReactNode
  /** Called when save is clicked - should return true if save succeeded */
  onSave?: () => Promise<boolean>
  /** Called when cancel is clicked */
  onCancel?: () => void
  /** Whether save is in progress */
  isSaving?: boolean
  /** Whether there are validation errors */
  hasErrors?: boolean
  /** Whether there are unsaved changes */
  hasChanges?: boolean
  /** Custom className for the card */
  className?: string
}

/**
 * ExpandableCard - A card that can expand/collapse and switch between view/edit modes
 */
export function ExpandableCard({
  title,
  icon,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
  summaryContent,
  viewContent,
  editContent,
  onSave,
  onCancel,
  isSaving = false,
  hasErrors = false,
  hasChanges = false,
  className = "",
}: ExpandableCardProps) {
  // State: is the card expanded?
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // State: are we in edit mode?
  const [isEditing, setIsEditing] = useState(false)

  // Toggle expand/collapse
  const toggleExpand = useCallback(() => {
    // Don't collapse if we're editing with unsaved changes
    if (isEditing && hasChanges) {
      // Could show a warning here - for now just prevent collapse
      return
    }
    setIsExpanded(prev => !prev)
  }, [isEditing, hasChanges])

  // Enter edit mode
  const handleEdit = useCallback(() => {
    setIsEditing(true)
    // Ensure card is expanded when editing
    setIsExpanded(true)
  }, [])

  // Cancel editing
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      // Confirm before discarding changes
      const confirmed = window.confirm("You have unsaved changes. Discard them?")
      if (!confirmed) return
    }
    setIsEditing(false)
    onCancel?.()
  }, [hasChanges, onCancel])

  // Save changes
  const handleSave = useCallback(async () => {
    if (onSave) {
      const success = await onSave()
      if (success) {
        setIsEditing(false)
      }
      // If save failed, stay in edit mode so user can fix issues
    }
  }, [onSave])

  return (
    <section
      className={`
        bg-white shadow-sm overflow-hidden
        ${isActive ? "ring-2 ring-[#fa6e60]" : ""}
        ${className}
      `}
      style={{ borderRadius: 0 }}
    >
      {/* Header - Always visible, clickable to expand/collapse */}
      <div
        className={`
          px-6 py-4 border-b border-gray-200 flex items-center justify-between
          cursor-pointer select-none
          ${isActive ? "bg-[#f8f8f8] hover:bg-gray-100" : "hover:bg-gray-50"}
          transition-all duration-150
          group
        `}
        onClick={toggleExpand}
      >
        {/* Left side: Icon, Title, Status badges */}
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0">{icon}</span>
          <h3 className="text-xl font-semibold tracking-tight" style={{ color: '#1e434d' }}>{title}</h3>

          {/* Status badges - rounded for tactile feel */}
          {isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Complete
            </span>
          )}
          {isActive && !isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#fa6e60]/10 text-[#fa6e60]">
              Current
            </span>
          )}
          {isEditing && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Editing
            </span>
          )}
          {hasChanges && isEditing && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#fa6e60]/20 text-[#fa6e60]">
              Unsaved
            </span>
          )}
        </div>

        {/* Right side: Edit button, expand text, and chevron */}
        <div className="flex items-center gap-3">
          {/* Edit button - only show when expanded and not already editing */}
          {isExpanded && !isEditing && editContent && (
            <button
              onClick={(e) => {
                e.stopPropagation() // Don't toggle expand when clicking edit
                handleEdit()
              }}
              className="px-3 py-1.5 text-sm text-[#1e434d] hover:text-white hover:bg-[#fa6e60] rounded-full transition-colors"
            >
              Edit
            </button>
          )}

          {/* Expand/collapse circular button with animated plus/cross */}
          <div
            className="w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ease-in-out group-hover:shadow-lg"
            style={{ backgroundColor: '#fa6e60' }}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                isExpanded ? "rotate-45" : "rotate-0"
              }`}
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              {/* Plus icon - rotates 45deg to become X */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary content - Always visible (collapsed shows just this) */}
      {summaryContent && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          {summaryContent}
        </div>
      )}

      {/* Expandable content - Only visible when expanded */}
      {isExpanded && (
        <div className="p-6">
          {/* Show edit form or view content based on mode */}
          {isEditing ? (
            <div className="space-y-6">
              {/* Edit form content */}
              {editContent}

              {/* Save/Cancel buttons - rounded corners on buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                {hasErrors && (
                  <span className="text-sm text-red-600 mr-auto">
                    Please fix the errors above before saving.
                  </span>
                )}
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm text-[#1e434d] hover:text-[#1e434d] hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || hasErrors}
                  className="px-4 py-2 text-sm bg-[#1e434d] text-white hover:bg-[#fa6e60] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          ) : (
            // View mode content
            viewContent
          )}
        </div>
      )}
    </section>
  )
}

/**
 * Helper component for displaying a label/value pair in view mode
 */
export function ViewField({
  label,
  value,
  className = "",
}: {
  label: string
  value?: string | number | null
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="text-sm text-gray-900 mt-0.5">{value ?? "—"}</dd>
    </div>
  )
}

/**
 * Helper component for form fields in edit mode
 */
export function EditField({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  required = false,
  placeholder,
  className = "",
}: {
  label: string
  name: string
  value: string | number | undefined
  onChange: (name: string, value: string) => void
  type?: "text" | "number" | "date" | "email" | "tel" | "textarea"
  error?: string
  required?: boolean
  placeholder?: string
  className?: string
}) {
  // Taller inputs with more padding for better usability
  // Light background indicates editable field
  const inputClasses = `
    mt-1 block w-full rounded-md shadow-sm text-sm
    px-3 py-2.5
    bg-[#f8f8f8]
    ${error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:bg-white"
      : "border-gray-300 focus:border-[#1e434d] focus:ring-[#1e434d] focus:bg-white"
    }
  `

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${inputClasses} min-h-[80px]`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}

/**
 * Helper component for select dropdowns in edit mode
 * Note: All values are converted to strings for consistent comparison
 */
export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select...",
  className = "",
}: {
  label: string
  name: string
  value: string | number | undefined | null
  onChange: (name: string, value: string) => void
  options: Array<{ value: string | number; label: string }>
  error?: string
  required?: boolean
  placeholder?: string
  className?: string
}) {
  // Convert value to string for consistent comparison with option values
  const stringValue = value != null ? String(value) : ""

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={stringValue}
        onChange={(e) => onChange(name, e.target.value)}
        className={`
          mt-1 block w-full rounded-md shadow-sm text-sm
          px-3 py-2.5
          bg-[#f8f8f8]
          ${error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:bg-white"
            : "border-gray-300 focus:border-[#1e434d] focus:ring-[#1e434d] focus:bg-white"
          }
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
