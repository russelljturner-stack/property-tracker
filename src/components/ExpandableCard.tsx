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
  /** Icon shown before the title (emoji or component) */
  icon: string
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
        bg-white rounded-lg shadow overflow-hidden
        ${isActive ? "ring-2 ring-blue-500" : ""}
        ${className}
      `}
    >
      {/* Header - Always visible, clickable to expand/collapse */}
      <div
        className={`
          px-6 py-4 border-b border-gray-200 flex items-center justify-between
          cursor-pointer select-none
          ${isActive ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"}
          transition-all duration-150
          group
        `}
        onClick={toggleExpand}
      >
        {/* Left side: Icon, Title, Status badges */}
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

          {/* Status badges */}
          {isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Complete
            </span>
          )}
          {isActive && !isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Current
            </span>
          )}
          {isEditing && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Editing
            </span>
          )}
          {hasChanges && isEditing && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
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
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}

          {/* Expand/collapse text + chevron */}
          <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
            <span className="text-sm font-medium">
              {isExpanded ? "Hide details" : "Show details"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
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

              {/* Save/Cancel buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                {hasErrors && (
                  <span className="text-sm text-red-600 mr-auto">
                    Please fix the errors above before saving.
                  </span>
                )}
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || hasErrors}
                  className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
  // Light blue background indicates editable field
  const inputClasses = `
    mt-1 block w-full rounded-md shadow-sm text-sm
    px-3 py-2.5
    bg-blue-50
    ${error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:bg-white"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
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
  value: string | number | undefined
  onChange: (name: string, value: string) => void
  options: Array<{ value: string | number; label: string }>
  error?: string
  required?: boolean
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        className={`
          mt-1 block w-full rounded-md shadow-sm text-sm
          px-3 py-2.5
          bg-blue-50
          ${error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:bg-white"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:bg-white"
          }
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
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
