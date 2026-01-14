"use client"

/**
 * DesignCard Component
 *
 * Expandable card for the Design section of a Development.
 * Displays design visuals, status progression, and sign-off information.
 */

import { useState, useCallback, useMemo } from "react"
import { ExpandableCard, ViewField, EditField, SelectField } from "./ExpandableCard"

export type DesignData = {
  id: number
  designUrl?: string | null
  designFinalOrDraft?: string | null
  designSignedOff?: string | null
  designSignedOffDate?: Date | null
  designSignedOffBy?: string | null
}

type DesignCardProps = {
  developmentId: number
  data: DesignData
  isActive?: boolean
  isComplete?: boolean
  defaultExpanded?: boolean
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// Convert date to YYYY-MM-DD for input fields
function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return ""
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}

export function DesignCard({
  developmentId,
  data,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
}: DesignCardProps) {
  const [formData, setFormData] = useState<Record<string, string | number | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const hasChanges = useMemo(() => Object.keys(formData).length > 0, [formData])

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const getFieldValue = useCallback((name: string): string | number | undefined => {
    if (name in formData) {
      return formData[name] ?? undefined
    }
    const value = data[name as keyof DesignData]
    if (value instanceof Date) {
      return toDateInputValue(value)
    }
    return value as string | number | undefined
  }, [formData, data])

  const handleCancel = useCallback(() => {
    setFormData({})
    setErrors({})
  }, [])

  const handleSave = useCallback(async (): Promise<boolean> => {
    setIsSaving(true)
    setErrors({})

    try {
      const updateData: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(formData)) {
        if (value === "") {
          updateData[key] = null
        } else if (key === "designSignedOffDate") {
          updateData[key] = value ? new Date(value as string) : null
        } else {
          updateData[key] = value
        }
      }

      const response = await fetch(`/api/developments/${developmentId}/design`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.errors) {
          setErrors(errorData.errors)
        } else {
          setErrors({ _form: errorData.message || "Failed to save changes" })
        }
        return false
      }

      setFormData({})
      return true
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ _form: "An unexpected error occurred" })
      return false
    } finally {
      setIsSaving(false)
    }
  }, [formData, developmentId])

  // Calculate current design stage index
  const getCurrentStageIndex = () => {
    switch (data.designFinalOrDraft?.toLowerCase()) {
      case 'final': return 3
      case 'draft': return 2
      case 'proposed': return 1
      default: return 0
    }
  }

  // Summary content
  const summaryContent = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ViewField label="Status" value={data.designFinalOrDraft || "Stock"} />
      <ViewField label="Signed Off" value={data.designSignedOff} />
      <ViewField label="Sign-off Date" value={formatDate(data.designSignedOffDate)} />
      <ViewField label="Signed Off By" value={data.designSignedOffBy} />
    </div>
  )

  // View content
  const viewContent = (
    <div className="space-y-6">
      {/* Design Visual */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Design Visual</h4>
        <div className="relative rounded-lg overflow-hidden bg-gray-900 max-w-md">
          {data.designUrl ? (
            <div className="aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.designUrl}
                alt="Proposed development visual"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">No design visual</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Design Status Progression */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Status Progression</h4>
        <div className="flex items-center justify-between text-xs">
          {['Stock', 'Proposed', 'Draft', 'Final'].map((stage, index) => {
            const currentIndex = getCurrentStageIndex()
            const isComplete = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <div key={stage} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                  isComplete ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isComplete ? '✓' : index + 1}
                </div>
                <span className={isCurrent || isComplete ? 'font-medium text-gray-900' : 'text-gray-400'}>{stage}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sign-off Status */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Sign-off</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Internal Sign-off</span>
            {data.designSignedOff === 'Yes' || data.designSignedOffDate ? (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Approved
              </span>
            ) : (
              <span className="text-sm text-gray-400">Pending</span>
            )}
          </div>
          {data.designSignedOffDate && (
            <p className="text-xs text-gray-500">
              {formatDate(data.designSignedOffDate)}
              {data.designSignedOffBy && ` by ${data.designSignedOffBy}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  // Edit content
  const editContent = (
    <div className="space-y-6">
      {errors._form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {errors._form}
        </div>
      )}

      {/* Design Visual URL */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Design Visual</h4>
        <EditField
          label="Design Image URL"
          name="designUrl"
          type="text"
          value={getFieldValue("designUrl")}
          onChange={handleFieldChange}
          error={errors.designUrl}
          placeholder="https://..."
        />
      </div>

      {/* Design Status */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Design Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Design Stage"
            name="designFinalOrDraft"
            value={getFieldValue("designFinalOrDraft")}
            onChange={handleFieldChange}
            options={[
              { value: "Stock", label: "Stock" },
              { value: "Proposed", label: "Proposed" },
              { value: "Draft", label: "Draft" },
              { value: "Final", label: "Final" },
            ]}
            error={errors.designFinalOrDraft}
          />
          <SelectField
            label="Signed Off"
            name="designSignedOff"
            value={getFieldValue("designSignedOff")}
            onChange={handleFieldChange}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            error={errors.designSignedOff}
          />
        </div>
      </div>

      {/* Sign-off Details */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Sign-off Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <EditField
            label="Sign-off Date"
            name="designSignedOffDate"
            type="date"
            value={getFieldValue("designSignedOffDate")}
            onChange={handleFieldChange}
            error={errors.designSignedOffDate}
          />
          <EditField
            label="Signed Off By"
            name="designSignedOffBy"
            type="text"
            value={getFieldValue("designSignedOffBy")}
            onChange={handleFieldChange}
            error={errors.designSignedOffBy}
          />
        </div>
      </div>
    </div>
  )

  return (
    <ExpandableCard
      title="Design"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      }
      isActive={isActive}
      isComplete={isComplete}
      defaultExpanded={defaultExpanded}
      summaryContent={summaryContent}
      viewContent={viewContent}
      editContent={editContent}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      hasErrors={Object.keys(errors).length > 0}
      hasChanges={hasChanges}
    />
  )
}
