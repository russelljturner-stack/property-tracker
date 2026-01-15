"use client"

/**
 * PanelConfigurationCard Component
 *
 * Manages panel configurations (DevelopmentDetail records) for a development.
 * Unlike other stage cards that edit Development fields directly, this manages
 * a list of related records with add/edit/delete functionality.
 *
 * Features:
 * - View mode: Shows panel configurations with SVG placeholders
 * - Edit mode: Inline editing of each panel's fields
 * - Add new panels with "+ Add Panel" button
 * - Delete panels with confirmation
 */

import { useState, useCallback } from "react"
import { SelectField, EditField } from "./ExpandableCard"

// Types for panel detail data
export type PanelDetailData = {
  id: number
  panelTypeId?: number | null
  panelType?: { id: number; name: string } | null
  panelSizeId?: number | null
  panelSize?: { id: number; name: string } | null
  orientationId?: number | null
  orientation?: { id: number; name: string } | null
  structureTypeId?: number | null
  structureType?: { id: number; name: string } | null
  digital?: string | null
  illuminated?: string | null
  sides?: number | null
  quantity?: number | null
  height?: number | null
  width?: number | null
}

// Lookup options for dropdowns
export type PanelLookups = {
  panelTypes: Array<{ id: number; name: string }>
  panelSizes: Array<{ id: number; name: string }>
  orientations: Array<{ id: number; name: string }>
  structureTypes: Array<{ id: number; name: string }>
}

type PanelConfigurationCardProps = {
  developmentId: number
  details: PanelDetailData[]
  lookups: PanelLookups
  designUrl?: string | null
  designStatus?: string | null
  onUpdate?: () => void // Called after successful save to refresh data
}

// Yes/No options for digital and illuminated fields
const YES_NO_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "TBC", label: "TBC" },
]

/**
 * PanelConfigurationCard - Main component
 */
export function PanelConfigurationCard({
  developmentId,
  details: initialDetails,
  lookups,
  designUrl,
  designStatus,
  onUpdate,
}: PanelConfigurationCardProps) {
  // State
  const [isEditing, setIsEditing] = useState(false)
  const [details, setDetails] = useState<PanelDetailData[]>(initialDetails)
  const [editingPanels, setEditingPanels] = useState<Record<number | string, Record<string, string | number | null>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set())
  const [newPanels, setNewPanels] = useState<Array<{ tempId: string; data: Record<string, string | number | null> }>>([])

  // Track if there are changes
  const hasChanges = Object.keys(editingPanels).length > 0 || newPanels.length > 0 || pendingDeletes.size > 0

  // Enter edit mode
  const handleEdit = useCallback(() => {
    setIsEditing(true)
    setEditingPanels({})
    setNewPanels([])
    setPendingDeletes(new Set())
    setErrors({})
  }, [])

  // Cancel editing
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      const confirmed = window.confirm("You have unsaved changes. Discard them?")
      if (!confirmed) return
    }
    setIsEditing(false)
    setEditingPanels({})
    setNewPanels([])
    setPendingDeletes(new Set())
    setErrors({})
    // Reset details to initial values
    setDetails(initialDetails)
  }, [hasChanges, initialDetails])

  // Handle field change for existing panel
  const handleFieldChange = useCallback((panelId: number, field: string, value: string | number | null) => {
    setEditingPanels(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        [field]: value,
      },
    }))
  }, [])

  // Handle field change for new panel
  const handleNewPanelFieldChange = useCallback((tempId: string, field: string, value: string | number | null) => {
    setNewPanels(prev =>
      prev.map(p =>
        p.tempId === tempId ? { ...p, data: { ...p.data, [field]: value } } : p
      )
    )
  }, [])

  // Add new panel
  const handleAddPanel = useCallback(() => {
    const tempId = `new-${Date.now()}`
    setNewPanels(prev => [...prev, { tempId, data: {} }])
  }, [])

  // Remove new panel before saving
  const handleRemoveNewPanel = useCallback((tempId: string) => {
    setNewPanels(prev => prev.filter(p => p.tempId !== tempId))
  }, [])

  // Mark existing panel for deletion
  const handleDeletePanel = useCallback((panelId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this panel?")
    if (!confirmed) return
    setPendingDeletes(prev => new Set([...prev, panelId]))
  }, [])

  // Undo pending delete
  const handleUndoDelete = useCallback((panelId: number) => {
    setPendingDeletes(prev => {
      const next = new Set(prev)
      next.delete(panelId)
      return next
    })
  }, [])

  // Save all changes
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setErrors({})

    try {
      // 1. Delete panels marked for deletion
      for (const panelId of pendingDeletes) {
        const response = await fetch(`/api/developments/${developmentId}/details?detailId=${panelId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          const data = await response.json()
          setErrors(prev => ({ ...prev, _form: data.message || "Failed to delete panel" }))
          setIsSaving(false)
          return
        }
      }

      // 2. Update existing panels
      for (const [panelIdStr, changes] of Object.entries(editingPanels)) {
        const panelId = parseInt(panelIdStr, 10)
        if (pendingDeletes.has(panelId)) continue // Skip deleted panels

        const response = await fetch(`/api/developments/${developmentId}/details`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ detailId: panelId, ...changes }),
        })
        if (!response.ok) {
          const data = await response.json()
          setErrors(prev => ({ ...prev, [panelIdStr]: data.message || "Failed to update panel" }))
          setIsSaving(false)
          return
        }
      }

      // 3. Create new panels
      for (const newPanel of newPanels) {
        const response = await fetch(`/api/developments/${developmentId}/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPanel.data),
        })
        if (!response.ok) {
          const data = await response.json()
          setErrors(prev => ({ ...prev, [newPanel.tempId]: data.message || "Failed to create panel" }))
          setIsSaving(false)
          return
        }
      }

      // 4. Refresh data - fetch updated details
      const response = await fetch(`/api/developments/${developmentId}/details`)
      if (response.ok) {
        const data = await response.json()
        setDetails(data.details)
      }

      // 5. Reset edit state
      setIsEditing(false)
      setEditingPanels({})
      setNewPanels([])
      setPendingDeletes(new Set())

      // 6. Notify parent to refresh if needed
      onUpdate?.()

    } catch (error) {
      console.error("Save error:", error)
      setErrors(prev => ({ ...prev, _form: "An unexpected error occurred" }))
    } finally {
      setIsSaving(false)
    }
  }, [developmentId, editingPanels, newPanels, pendingDeletes, onUpdate])

  // Get current value for a field (edited value or original)
  const getFieldValue = (panel: PanelDetailData, field: string): string | number | null => {
    const changes = editingPanels[panel.id]
    if (changes && field in changes) {
      return changes[field]
    }
    // Handle nested relations
    if (field === "panelTypeId") return panel.panelType?.id ?? null
    if (field === "panelSizeId") return panel.panelSize?.id ?? null
    if (field === "orientationId") return panel.orientation?.id ?? null
    if (field === "structureTypeId") return panel.structureType?.id ?? null
    // Handle direct fields
    return panel[field as keyof PanelDetailData] as string | number | null
  }

  return (
    <section className="shadow" style={{ backgroundColor: '#007aee', borderRadius: 0 }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
        <h2 className="text-lg font-semibold" style={{ color: '#ffffff' }}>Panel Configuration</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="text-sm hover:opacity-80 px-3 py-1 rounded-full border border-white/50"
            style={{ color: '#ffffff' }}
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="text-sm px-3 py-1 rounded-full border border-white/50 hover:bg-white/10 disabled:opacity-50"
              style={{ color: '#ffffff' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="text-sm px-3 py-1 rounded-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ color: '#007aee' }}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error message */}
        {errors._form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
            {errors._form}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left column - Panel details (2/3 width) */}
          <div className="lg:col-span-2">
            {details.length === 0 && newPanels.length === 0 ? (
              <div className="text-white/70 text-center py-8">
                No panel configuration defined yet.
                {isEditing && (
                  <div className="mt-4">
                    <button
                      onClick={handleAddPanel}
                      className="px-4 py-2 border border-dashed border-white/50 text-white hover:bg-white/10 rounded-lg"
                    >
                      + Add Panel
                    </button>
                  </div>
                )}
              </div>
            ) : isEditing ? (
              /* Edit mode - show form for each panel */
              <div className="space-y-4">
                {/* Existing panels */}
                {details.map((panel, index) => {
                  const isDeleted = pendingDeletes.has(panel.id)
                  return (
                    <PanelEditForm
                      key={panel.id}
                      index={index}
                      panel={panel}
                      lookups={lookups}
                      isDeleted={isDeleted}
                      getFieldValue={getFieldValue}
                      onFieldChange={(field, value) => handleFieldChange(panel.id, field, value)}
                      onDelete={() => handleDeletePanel(panel.id)}
                      onUndoDelete={() => handleUndoDelete(panel.id)}
                      error={errors[panel.id.toString()]}
                    />
                  )
                })}

                {/* New panels */}
                {newPanels.map((newPanel, i) => (
                  <PanelNewForm
                    key={newPanel.tempId}
                    index={details.length + i}
                    tempId={newPanel.tempId}
                    data={newPanel.data}
                    lookups={lookups}
                    onFieldChange={(field, value) => handleNewPanelFieldChange(newPanel.tempId, field, value)}
                    onRemove={() => handleRemoveNewPanel(newPanel.tempId)}
                    error={errors[newPanel.tempId]}
                  />
                ))}

                {/* Add panel button */}
                <button
                  onClick={handleAddPanel}
                  className="w-full py-3 border border-dashed border-white/50 text-white hover:bg-white/10 rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Panel
                </button>
              </div>
            ) : (
              /* View mode - show panel details */
              <PanelViewDisplay details={details} />
            )}
          </div>

          {/* Right column - Design/Holding image (1/3 width) */}
          <div className="lg:col-span-1">
            <PanelImageDisplay
              designUrl={designUrl}
              designStatus={designStatus}
              panelSize={details[0]?.panelSize?.name}
              panelType={details[0]?.panelType?.name}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * PanelEditForm - Form for editing an existing panel
 */
function PanelEditForm({
  index,
  panel,
  lookups,
  isDeleted,
  getFieldValue,
  onFieldChange,
  onDelete,
  onUndoDelete,
  error,
}: {
  index: number
  panel: PanelDetailData
  lookups: PanelLookups
  isDeleted: boolean
  getFieldValue: (panel: PanelDetailData, field: string) => string | number | null
  onFieldChange: (field: string, value: string | number | null) => void
  onDelete: () => void
  onUndoDelete: () => void
  error?: string
}) {
  return (
    <div className={`bg-white/10 rounded-lg p-4 ${isDeleted ? "opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-white">
          Panel {index + 1}
          {isDeleted && <span className="text-red-300 ml-2">(Will be deleted)</span>}
        </h4>
        {isDeleted ? (
          <button
            onClick={onUndoDelete}
            className="text-sm text-white hover:text-green-300"
          >
            Undo Delete
          </button>
        ) : (
          <button
            onClick={onDelete}
            className="text-sm text-white/70 hover:text-red-300"
          >
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 rounded text-red-800 text-sm">{error}</div>
      )}

      {!isDeleted && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SelectField
            label="Panel Type"
            name="panelTypeId"
            value={getFieldValue(panel, "panelTypeId") ?? ""}
            onChange={(_, v) => onFieldChange("panelTypeId", v ? parseInt(v, 10) : null)}
            options={lookups.panelTypes.map(t => ({ value: t.id, label: t.name }))}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <SelectField
            label="Size"
            name="panelSizeId"
            value={getFieldValue(panel, "panelSizeId") ?? ""}
            onChange={(_, v) => onFieldChange("panelSizeId", v ? parseInt(v, 10) : null)}
            options={lookups.panelSizes.map(t => ({ value: t.id, label: t.name }))}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <SelectField
            label="Orientation"
            name="orientationId"
            value={getFieldValue(panel, "orientationId") ?? ""}
            onChange={(_, v) => onFieldChange("orientationId", v ? parseInt(v, 10) : null)}
            options={lookups.orientations.map(t => ({ value: t.id, label: t.name }))}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <SelectField
            label="Structure"
            name="structureTypeId"
            value={getFieldValue(panel, "structureTypeId") ?? ""}
            onChange={(_, v) => onFieldChange("structureTypeId", v ? parseInt(v, 10) : null)}
            options={lookups.structureTypes.map(t => ({ value: t.id, label: t.name }))}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <SelectField
            label="Digital"
            name="digital"
            value={getFieldValue(panel, "digital") ?? ""}
            onChange={(_, v) => onFieldChange("digital", v || null)}
            options={YES_NO_OPTIONS}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <SelectField
            label="Illuminated"
            name="illuminated"
            value={getFieldValue(panel, "illuminated") ?? ""}
            onChange={(_, v) => onFieldChange("illuminated", v || null)}
            options={YES_NO_OPTIONS}
            className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
          />
          <EditField
            label="Sides"
            name="sides"
            type="number"
            value={getFieldValue(panel, "sides") ?? ""}
            onChange={(_, v) => onFieldChange("sides", v ? parseInt(v, 10) : null)}
            className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
          />
          <EditField
            label="Quantity"
            name="quantity"
            type="number"
            value={getFieldValue(panel, "quantity") ?? ""}
            onChange={(_, v) => onFieldChange("quantity", v ? parseInt(v, 10) : null)}
            className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
          />
          <EditField
            label="Height (m)"
            name="height"
            type="number"
            value={getFieldValue(panel, "height") ?? ""}
            onChange={(_, v) => onFieldChange("height", v ? parseFloat(v) : null)}
            className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
          />
          <EditField
            label="Width (m)"
            name="width"
            type="number"
            value={getFieldValue(panel, "width") ?? ""}
            onChange={(_, v) => onFieldChange("width", v ? parseFloat(v) : null)}
            className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
          />
        </div>
      )}
    </div>
  )
}

/**
 * PanelNewForm - Form for creating a new panel
 */
function PanelNewForm({
  index,
  tempId,
  data,
  lookups,
  onFieldChange,
  onRemove,
  error,
}: {
  index: number
  tempId: string
  data: Record<string, string | number | null>
  lookups: PanelLookups
  onFieldChange: (field: string, value: string | number | null) => void
  onRemove: () => void
  error?: string
}) {
  return (
    <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-white/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-white">
          New Panel {index + 1}
          <span className="text-green-300 ml-2">(New)</span>
        </h4>
        <button
          onClick={onRemove}
          className="text-sm text-white/70 hover:text-red-300"
        >
          Remove
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 rounded text-red-800 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SelectField
          label="Panel Type"
          name="panelTypeId"
          value={data.panelTypeId ?? ""}
          onChange={(_, v) => onFieldChange("panelTypeId", v ? parseInt(v, 10) : null)}
          options={lookups.panelTypes.map(t => ({ value: t.id, label: t.name }))}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <SelectField
          label="Size"
          name="panelSizeId"
          value={data.panelSizeId ?? ""}
          onChange={(_, v) => onFieldChange("panelSizeId", v ? parseInt(v, 10) : null)}
          options={lookups.panelSizes.map(t => ({ value: t.id, label: t.name }))}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <SelectField
          label="Orientation"
          name="orientationId"
          value={data.orientationId ?? ""}
          onChange={(_, v) => onFieldChange("orientationId", v ? parseInt(v, 10) : null)}
          options={lookups.orientations.map(t => ({ value: t.id, label: t.name }))}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <SelectField
          label="Structure"
          name="structureTypeId"
          value={data.structureTypeId ?? ""}
          onChange={(_, v) => onFieldChange("structureTypeId", v ? parseInt(v, 10) : null)}
          options={lookups.structureTypes.map(t => ({ value: t.id, label: t.name }))}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <SelectField
          label="Digital"
          name="digital"
          value={data.digital ?? ""}
          onChange={(_, v) => onFieldChange("digital", v || null)}
          options={YES_NO_OPTIONS}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <SelectField
          label="Illuminated"
          name="illuminated"
          value={data.illuminated ?? ""}
          onChange={(_, v) => onFieldChange("illuminated", v || null)}
          options={YES_NO_OPTIONS}
          className="[&_label]:text-white/70 [&_select]:bg-white/20 [&_select]:border-white/30 [&_select]:text-white [&_option]:text-gray-900"
        />
        <EditField
          label="Sides"
          name="sides"
          type="number"
          value={data.sides ?? ""}
          onChange={(_, v) => onFieldChange("sides", v ? parseInt(v, 10) : null)}
          className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
        />
        <EditField
          label="Quantity"
          name="quantity"
          type="number"
          value={data.quantity ?? ""}
          onChange={(_, v) => onFieldChange("quantity", v ? parseInt(v, 10) : null)}
          className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
        />
        <EditField
          label="Height (m)"
          name="height"
          type="number"
          value={data.height ?? ""}
          onChange={(_, v) => onFieldChange("height", v ? parseFloat(v) : null)}
          className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
        />
        <EditField
          label="Width (m)"
          name="width"
          type="number"
          value={data.width ?? ""}
          onChange={(_, v) => onFieldChange("width", v ? parseFloat(v) : null)}
          className="[&_label]:text-white/70 [&_input]:bg-white/20 [&_input]:border-white/30 [&_input]:text-white"
        />
      </div>
    </div>
  )
}

/**
 * PanelViewDisplay - View mode display for panels
 */
function PanelViewDisplay({ details }: { details: PanelDetailData[] }) {
  // Single panel = expanded view
  if (details.length === 1) {
    return <PanelDetailExpanded detail={details[0]} index={0} />
  }

  // Multiple panels = list view
  return (
    <div className="space-y-3">
      {details.map((detail, index) => (
        <PanelDetailRow key={detail.id} detail={detail} index={index} />
      ))}
    </div>
  )
}

/**
 * PanelDetailExpanded - Full expanded view of a single panel
 * White background, square corners, more prominent information
 */
function PanelDetailExpanded({
  detail,
  index,
}: {
  detail: PanelDetailData
  index: number
}) {
  return (
    <div className="bg-white p-6">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900">
          {detail.panelType?.name || 'Panel'} {index + 1}
          {detail.quantity && detail.quantity > 1 && (
            <span className="font-normal text-gray-500"> x {detail.quantity}</span>
          )}
        </h4>
      </div>

      {/* Fields grid - 5 columns to fit all info on 2 lines */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-4">
        <PanelField label="Panel Type" value={detail.panelType?.name} />
        <PanelField label="Size" value={detail.panelSize?.name} />
        <PanelField label="Orientation" value={detail.orientation?.name} />
        <PanelField label="Structure" value={detail.structureType?.name} />
        <PanelField label="Sides" value={detail.sides?.toString()} />
        <PanelField label="Quantity" value={detail.quantity?.toString()} />
        <PanelField label="Digital" value={detail.digital} />
        <PanelField label="Illuminated" value={detail.illuminated} />
        <PanelField
          label="Dimensions"
          value={detail.height && detail.width ? `${detail.height}m x ${detail.width}m` : null}
        />
      </div>
    </div>
  )
}

/**
 * PanelDetailRow - Compact row view for multiple panels
 * White background, square corners
 */
function PanelDetailRow({
  detail,
  index,
}: {
  detail: PanelDetailData
  index: number
}) {
  return (
    <div className="bg-white overflow-hidden">
      {/* Summary header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#007aee] flex items-center justify-center text-xs font-bold text-white">
            {index + 1}
          </span>
          <div>
            <span className="font-semibold text-gray-900">
              {detail.panelType?.name || 'Panel'}
            </span>
            <span className="text-gray-600 ml-2">
              {[detail.panelSize?.name, detail.orientation?.name].filter(Boolean).join(' - ')}
            </span>
            {detail.quantity && detail.quantity > 1 && (
              <span className="text-gray-500 ml-2">x {detail.quantity}</span>
            )}
          </div>
        </div>
      </div>
      {/* Additional details row */}
      <div className="px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
        {detail.structureType?.name && <span>Structure: {detail.structureType.name}</span>}
        {detail.sides && <span>Sides: {detail.sides}</span>}
        {detail.digital && <span>Digital: {detail.digital}</span>}
        {detail.illuminated && <span>Illuminated: {detail.illuminated}</span>}
        {detail.height && detail.width && <span>Size: {detail.height}m x {detail.width}m</span>}
      </div>
    </div>
  )
}

/**
 * PanelField - Label/value pair for view mode
 * Now styled for white background
 */
function PanelField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</dt>
      <dd className="text-base text-gray-900 font-medium mt-1">{value || '—'}</dd>
    </div>
  )
}

/**
 * PanelImageDisplay - Design image or SVG placeholder
 * Square corners on image container, annotation below showing design status
 */
function PanelImageDisplay({
  designUrl,
  designStatus,
  panelSize,
  panelType,
}: {
  designUrl?: string | null
  designStatus?: string | null
  panelSize?: string | null
  panelType?: string | null
}) {
  // Determine annotation text based on design status
  const getAnnotation = () => {
    if (!designUrl) return 'Holding image'
    if (designStatus === 'Final') return 'Design Final'
    if (designStatus === 'Draft') return 'Design Draft'
    return 'Design Proposed'
  }

  // If we have a design image, show it
  if (designUrl) {
    return (
      <div className="space-y-2">
        {/* Image container - square corners */}
        <div className="aspect-[4/3] bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={designUrl}
            alt="Panel design"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Annotation below image */}
        <p className="text-sm text-white/70 text-center italic">{getAnnotation()}</p>
        <a
          href={designUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white hover:text-white/80 flex items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View full size
        </a>
      </div>
    )
  }

  // No design image - show SVG placeholder
  return (
    <div className="space-y-2">
      {/* Image container - square corners */}
      <div className="bg-white/10 overflow-hidden">
        <PanelSizeSVG size={panelSize} type={panelType} />
      </div>
      {/* Annotation below image */}
      <p className="text-sm text-white/70 text-center italic">{getAnnotation()}</p>
      <button
        className="w-full text-sm py-2 border border-dashed border-white/30 text-white/70 hover:border-white hover:text-white transition-colors"
      >
        + Upload Design
      </button>
    </div>
  )
}

/**
 * PanelSizeSVG - SVG placeholder graphic for panel
 */
function PanelSizeSVG({
  size,
  type,
}: {
  size?: string | null
  type?: string | null
}) {
  const sizeName = size?.toLowerCase() || ''
  const typeName = type?.toLowerCase() || ''
  const isDigital = typeName.includes('digital')

  // Determine panel aspect ratio and style - reduced heights for more compact display
  const getPanelConfig = () => {
    if (sizeName.includes('6 sheet') || sizeName === 'mega 6') {
      return { width: 50, height: 60, label: size || '6 Sheet', isPortrait: true }
    }
    if (sizeName.includes('48') || sizeName === 'mega 48') {
      return { width: 80, height: 35, label: size || '48 Sheet', isPortrait: false }
    }
    if (sizeName.includes('96') || sizeName === 'mega 96') {
      return { width: 90, height: 22, label: size || '96 Sheet', isPortrait: false }
    }
    if (sizeName.includes('p10') || sizeName.includes('mini')) {
      return { width: 65, height: 40, label: size || 'P10', isPortrait: false }
    }
    if (sizeName.includes('p250')) {
      return { width: 70, height: 35, label: 'P250', isPortrait: false }
    }
    if (sizeName.includes('tfl') || sizeName.includes('cip')) {
      return { width: 55, height: 35, label: 'TFL CIPs', isPortrait: false }
    }
    return { width: 65, height: 35, label: size || 'TBC', isPortrait: false }
  }

  const config = getPanelConfig()
  const padding = 12
  const viewWidth = config.width + padding * 2
  const viewHeight = config.height + padding * 2 + 18

  const panelX = padding
  const panelY = padding
  const legY = panelY + config.height

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="w-full"
      style={{ backgroundColor: '#1a5276' }}
    >
      {/* Gradients */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a5276" />
          <stop offset="100%" stopColor="#0e3a5c" />
        </linearGradient>
        <linearGradient id="panelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDigital ? '#1a1a2e' : '#ffffff'} />
          <stop offset="100%" stopColor={isDigital ? '#16213e' : '#f0f0f0'} />
        </linearGradient>
        {isDigital && (
          <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3498db" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#9b59b6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e74c3c" stopOpacity="0.3" />
          </linearGradient>
        )}
      </defs>

      {/* Sky background */}
      <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="url(#skyGradient)" />

      {/* Ground line */}
      <line x1="0" y1={viewHeight - 6} x2={viewWidth} y2={viewHeight - 6} stroke="#0a2840" strokeWidth="2" />

      {/* Support legs */}
      <rect x={panelX + config.width * 0.25 - 2} y={legY} width="4" height={viewHeight - legY - 6} fill="#2c3e50" />
      <rect x={panelX + config.width * 0.75 - 2} y={legY} width="4" height={viewHeight - legY - 6} fill="#2c3e50" />

      {/* Panel frame */}
      <rect x={panelX - 2} y={panelY - 2} width={config.width + 4} height={config.height + 4} fill="#34495e" rx="2" />

      {/* Panel surface */}
      <rect x={panelX} y={panelY} width={config.width} height={config.height} fill="url(#panelGradient)" rx="1" />

      {/* Digital screen effect */}
      {isDigital && (
        <>
          <rect x={panelX} y={panelY} width={config.width} height={config.height} fill="url(#screenGlow)" rx="1" />
          <pattern id="ledPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="#ffffff" opacity="0.1" />
          </pattern>
          <rect x={panelX} y={panelY} width={config.width} height={config.height} fill="url(#ledPattern)" rx="1" />
        </>
      )}

      {/* Panel size label */}
      <text
        x={panelX + config.width / 2}
        y={panelY + config.height / 2 - 2}
        textAnchor="middle"
        fill={isDigital ? '#ffffff' : '#2c3e50'}
        fontSize={config.isPortrait ? '8' : '9'}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {config.label}
      </text>

      {/* Panel type label */}
      <text
        x={panelX + config.width / 2}
        y={panelY + config.height / 2 + 8}
        textAnchor="middle"
        fill={isDigital ? '#94a3b8' : '#64748b'}
        fontSize="6"
        fontFamily="system-ui, sans-serif"
      >
        {type || 'Poster'}
      </text>
    </svg>
  )
}
