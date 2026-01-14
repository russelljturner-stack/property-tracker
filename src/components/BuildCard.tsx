"use client"

/**
 * BuildCard Component
 *
 * Expandable card for the Build section of a Development.
 * Displays build dates, contractor, and notes.
 */

import { useState, useCallback, useMemo } from "react"
import { ExpandableCard, ViewField, EditField } from "./ExpandableCard"

export type BuildData = {
  id: number
  buildStartDate?: Date | null
  buildCompletionDate?: Date | null
  buildLiveDate?: Date | null
  buildContractor?: string | null
  buildNotes?: string | null
}

type BuildCardProps = {
  developmentId: number
  data: BuildData
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

export function BuildCard({
  developmentId,
  data,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
}: BuildCardProps) {
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
    const value = data[name as keyof BuildData]
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
        } else if (key.includes("Date")) {
          updateData[key] = value ? new Date(value as string) : null
        } else {
          updateData[key] = value
        }
      }

      const response = await fetch(`/api/developments/${developmentId}/build`, {
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

  // Calculate build progress
  const getBuildStatus = () => {
    if (data.buildLiveDate) return { status: 'Live', color: 'green' }
    if (data.buildCompletionDate) return { status: 'Complete', color: 'blue' }
    if (data.buildStartDate) return { status: 'In Progress', color: 'amber' }
    return { status: 'Not Started', color: 'gray' }
  }

  const buildStatus = getBuildStatus()

  // Summary content
  const summaryContent = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <dt className="text-xs text-gray-500 uppercase tracking-wider">Status</dt>
        <dd className="mt-0.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${buildStatus.color}-100 text-${buildStatus.color}-800`}>
            {buildStatus.status}
          </span>
        </dd>
      </div>
      <ViewField label="Start Date" value={formatDate(data.buildStartDate)} />
      <ViewField label="Completion" value={formatDate(data.buildCompletionDate)} />
      <ViewField label="Contractor" value={data.buildContractor} />
    </div>
  )

  // View content
  const viewContent = (
    <div className="space-y-6">
      {/* Build Progress */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Build Progress</h4>
        <div className="flex items-center justify-between mb-4">
          {['Not Started', 'In Progress', 'Complete', 'Live'].map((stage, index) => {
            const currentIndex = (() => {
              if (data.buildLiveDate) return 3
              if (data.buildCompletionDate) return 2
              if (data.buildStartDate) return 1
              return 0
            })()
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
                <span className={`text-xs ${isCurrent || isComplete ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                  {stage}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Dates */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Key Dates</h4>
        <div className="grid grid-cols-3 gap-4">
          <ViewField label="Start Date" value={formatDate(data.buildStartDate)} />
          <ViewField label="Completion Date" value={formatDate(data.buildCompletionDate)} />
          <ViewField label="Live Date" value={formatDate(data.buildLiveDate)} />
        </div>
      </div>

      {/* Contractor */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contractor</h4>
        <ViewField label="Contractor" value={data.buildContractor} />
      </div>

      {/* Notes */}
      {data.buildNotes && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Notes</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.buildNotes}</p>
        </div>
      )}
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

      {/* Key Dates */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Key Dates</h4>
        <div className="grid grid-cols-3 gap-4">
          <EditField
            label="Start Date"
            name="buildStartDate"
            type="date"
            value={getFieldValue("buildStartDate")}
            onChange={handleFieldChange}
            error={errors.buildStartDate}
          />
          <EditField
            label="Completion Date"
            name="buildCompletionDate"
            type="date"
            value={getFieldValue("buildCompletionDate")}
            onChange={handleFieldChange}
            error={errors.buildCompletionDate}
          />
          <EditField
            label="Live Date"
            name="buildLiveDate"
            type="date"
            value={getFieldValue("buildLiveDate")}
            onChange={handleFieldChange}
            error={errors.buildLiveDate}
          />
        </div>
      </div>

      {/* Contractor */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contractor</h4>
        <EditField
          label="Contractor"
          name="buildContractor"
          type="text"
          value={getFieldValue("buildContractor")}
          onChange={handleFieldChange}
          error={errors.buildContractor}
        />
      </div>

      {/* Notes */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Notes</h4>
        <EditField
          label="Build Notes"
          name="buildNotes"
          type="textarea"
          value={getFieldValue("buildNotes")}
          onChange={handleFieldChange}
          error={errors.buildNotes}
        />
      </div>
    </div>
  )

  return (
    <ExpandableCard
      title="Build"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M4 21V10l4-4m12 15V10l-4-4M8 6l4-4 4 4M12 2v8M8 21v-6h8v6" />
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
