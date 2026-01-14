"use client"

/**
 * PlanningCard Component
 *
 * Expandable card for the Planning section of a Development.
 * Displays both Planning and Advertisement application details,
 * status, dates, and appeal information.
 */

import { useState, useCallback, useMemo } from "react"
import { ExpandableCard, ViewField, EditField, SelectField } from "./ExpandableCard"

export type PlanningData = {
  id: number
  // Planning Application
  planningAppStatusId?: number | null
  planningAppStatus?: { id: number; name: string } | null
  planningScore?: number | null
  planningApplicationDescription?: string | null
  planningApplicationDetail?: string | null
  planningClientApproval?: string | null
  planningApplicationSubmitted?: Date | null
  planningAppRegistration?: Date | null
  planningAppRefLa?: string | null
  planningAppDeterminDate?: Date | null
  planningConditions?: string | null
  planningConditionsNumber?: number | null
  // Planning Appeal
  planningAppealSubmitted?: Date | null
  planningAppealStart?: Date | null
  planningAppealRefLa?: string | null
  planningAppealProcedure?: string | null
  // Advertisement Application
  advertAppStatusId?: number | null
  advertAppStatus?: { id: number; name: string } | null
  advertApplicationDescription?: string | null
  advertApplicationSubmitted?: Date | null
  advertApplicationRegistration?: Date | null
  advertAppRefLa?: string | null
  advertAppDeterminationDate?: Date | null
  advertConditions?: string | null
  advertConditionsNumber?: number | null
  // Advertisement Appeal
  advertAppealSubmitted?: Date | null
  advertAppealStart?: Date | null
  advertAppealRefLa?: string | null
  advertAppealProcedure?: string | null
  // Case Officer
  caseOfficer?: {
    firstName?: string | null
    lastName?: string | null
    organisation?: { name: string } | null
  } | null
}

type PlanningCardProps = {
  developmentId: number
  data: PlanningData
  applicationStatuses: Array<{ id: number; name: string }>
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

export function PlanningCard({
  developmentId,
  data,
  applicationStatuses,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
}: PlanningCardProps) {
  const [formData, setFormData] = useState<Record<string, string | number | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'planning' | 'advert'>('planning')

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
    const value = data[name as keyof PlanningData]
    if (value instanceof Date) {
      return toDateInputValue(value)
    }
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like planningAppStatus
      if ('id' in value) return (value as { id: number }).id
      return undefined
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
        } else if (
          key.includes("Date") ||
          key.includes("Submitted") ||
          key.includes("Registration") ||
          key.includes("Start")
        ) {
          updateData[key] = value ? new Date(value as string) : null
        } else if (key.includes("StatusId") || key.includes("Number") || key === "planningScore") {
          updateData[key] = value ? parseInt(value as string, 10) : null
        } else {
          updateData[key] = value
        }
      }

      const response = await fetch(`/api/developments/${developmentId}/planning`, {
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

  // Get status name for display
  const getPlanningStatusName = () => data.planningAppStatus?.name || "Not Started"
  const getAdvertStatusName = () => data.advertAppStatus?.name || "Not Started"

  // Case officer name
  const caseOfficerName = data.caseOfficer
    ? `${data.caseOfficer.firstName || ''} ${data.caseOfficer.lastName || ''}`.trim()
    : undefined

  // Summary content
  const summaryContent = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ViewField label="Planning Status" value={getPlanningStatusName()} />
      <ViewField label="Advert Status" value={getAdvertStatusName()} />
      <ViewField label="Planning Score" value={data.planningScore ? `${data.planningScore}/5` : undefined} />
      <ViewField label="Case Officer" value={caseOfficerName} />
    </div>
  )

  // View content with tabs
  const viewContent = (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'planning'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Planning Application
        </button>
        <button
          onClick={() => setActiveTab('advert')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'advert'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Advertisement Application
        </button>
      </div>

      {/* Planning Application Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {/* Main Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <ViewField label="Status" value={getPlanningStatusName()} />
              <ViewField label="LA Reference" value={data.planningAppRefLa} />
              <ViewField label="Submitted" value={formatDate(data.planningApplicationSubmitted)} />
              <ViewField label="Registered" value={formatDate(data.planningAppRegistration)} />
              <ViewField label="Target Date" value={formatDate(data.planningAppDeterminDate)} />
              <ViewField label="Planning Score" value={data.planningScore ? `${data.planningScore}/5` : undefined} />
            </div>
            {data.planningApplicationDescription && (
              <div className="mt-4">
                <ViewField label="Description" value={data.planningApplicationDescription} />
              </div>
            )}
          </div>

          {/* Conditions */}
          {(data.planningConditions || data.planningConditionsNumber) && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Conditions</h4>
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Number of Conditions" value={data.planningConditionsNumber?.toString()} />
              </div>
              {data.planningConditions && (
                <div className="mt-4">
                  <ViewField label="Conditions Detail" value={data.planningConditions} />
                </div>
              )}
            </div>
          )}

          {/* Appeal */}
          {(data.planningAppealSubmitted || data.planningAppealRefLa) && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Appeal</h4>
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Appeal Submitted" value={formatDate(data.planningAppealSubmitted)} />
                <ViewField label="Appeal Reference" value={data.planningAppealRefLa} />
                <ViewField label="Appeal Start" value={formatDate(data.planningAppealStart)} />
                <ViewField label="Procedure" value={data.planningAppealProcedure} />
              </div>
            </div>
          )}

          {/* Case Officer */}
          {data.caseOfficer && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Case Officer</h4>
              <ViewField label="Name" value={caseOfficerName} />
              {data.caseOfficer.organisation && (
                <ViewField label="Organisation" value={data.caseOfficer.organisation.name} className="mt-2" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Advertisement Application Tab */}
      {activeTab === 'advert' && (
        <div className="space-y-6">
          {/* Main Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <ViewField label="Status" value={getAdvertStatusName()} />
              <ViewField label="LA Reference" value={data.advertAppRefLa} />
              <ViewField label="Submitted" value={formatDate(data.advertApplicationSubmitted)} />
              <ViewField label="Registered" value={formatDate(data.advertApplicationRegistration)} />
              <ViewField label="Target Date" value={formatDate(data.advertAppDeterminationDate)} />
            </div>
            {data.advertApplicationDescription && (
              <div className="mt-4">
                <ViewField label="Description" value={data.advertApplicationDescription} />
              </div>
            )}
          </div>

          {/* Conditions */}
          {(data.advertConditions || data.advertConditionsNumber) && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Conditions</h4>
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Number of Conditions" value={data.advertConditionsNumber?.toString()} />
              </div>
              {data.advertConditions && (
                <div className="mt-4">
                  <ViewField label="Conditions Detail" value={data.advertConditions} />
                </div>
              )}
            </div>
          )}

          {/* Appeal */}
          {(data.advertAppealSubmitted || data.advertAppealRefLa) && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Appeal</h4>
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Appeal Submitted" value={formatDate(data.advertAppealSubmitted)} />
                <ViewField label="Appeal Reference" value={data.advertAppealRefLa} />
                <ViewField label="Appeal Start" value={formatDate(data.advertAppealStart)} />
                <ViewField label="Procedure" value={data.advertAppealProcedure} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  // Edit content with tabs
  const editContent = (
    <div className="space-y-4">
      {errors._form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {errors._form}
        </div>
      )}

      {/* Tab buttons */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'planning'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Planning Application
        </button>
        <button
          onClick={() => setActiveTab('advert')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'advert'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Advertisement Application
        </button>
      </div>

      {/* Planning Application Edit Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Status"
                name="planningAppStatusId"
                value={getFieldValue("planningAppStatusId")}
                onChange={handleFieldChange}
                options={applicationStatuses.map(s => ({ value: s.id, label: s.name }))}
                error={errors.planningAppStatusId}
              />
              <EditField
                label="LA Reference"
                name="planningAppRefLa"
                type="text"
                value={getFieldValue("planningAppRefLa")}
                onChange={handleFieldChange}
                error={errors.planningAppRefLa}
              />
              <EditField
                label="Submitted Date"
                name="planningApplicationSubmitted"
                type="date"
                value={getFieldValue("planningApplicationSubmitted")}
                onChange={handleFieldChange}
                error={errors.planningApplicationSubmitted}
              />
              <EditField
                label="Registration Date"
                name="planningAppRegistration"
                type="date"
                value={getFieldValue("planningAppRegistration")}
                onChange={handleFieldChange}
                error={errors.planningAppRegistration}
              />
              <EditField
                label="Target Date"
                name="planningAppDeterminDate"
                type="date"
                value={getFieldValue("planningAppDeterminDate")}
                onChange={handleFieldChange}
                error={errors.planningAppDeterminDate}
              />
              <SelectField
                label="Planning Score"
                name="planningScore"
                value={getFieldValue("planningScore")}
                onChange={handleFieldChange}
                options={[
                  { value: 1, label: "1 - Very unlikely" },
                  { value: 2, label: "2 - Unlikely" },
                  { value: 3, label: "3 - Possible" },
                  { value: 4, label: "4 - Likely" },
                  { value: 5, label: "5 - Very likely" },
                ]}
                error={errors.planningScore}
              />
            </div>
            <div className="mt-4">
              <EditField
                label="Description"
                name="planningApplicationDescription"
                type="textarea"
                value={getFieldValue("planningApplicationDescription")}
                onChange={handleFieldChange}
                error={errors.planningApplicationDescription}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Conditions</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditField
                label="Number of Conditions"
                name="planningConditionsNumber"
                type="number"
                value={getFieldValue("planningConditionsNumber")}
                onChange={handleFieldChange}
                error={errors.planningConditionsNumber}
              />
            </div>
            <div className="mt-4">
              <EditField
                label="Conditions Detail"
                name="planningConditions"
                type="textarea"
                value={getFieldValue("planningConditions")}
                onChange={handleFieldChange}
                error={errors.planningConditions}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Appeal</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditField
                label="Appeal Submitted"
                name="planningAppealSubmitted"
                type="date"
                value={getFieldValue("planningAppealSubmitted")}
                onChange={handleFieldChange}
                error={errors.planningAppealSubmitted}
              />
              <EditField
                label="Appeal Reference"
                name="planningAppealRefLa"
                type="text"
                value={getFieldValue("planningAppealRefLa")}
                onChange={handleFieldChange}
                error={errors.planningAppealRefLa}
              />
              <EditField
                label="Appeal Start"
                name="planningAppealStart"
                type="date"
                value={getFieldValue("planningAppealStart")}
                onChange={handleFieldChange}
                error={errors.planningAppealStart}
              />
              <EditField
                label="Procedure"
                name="planningAppealProcedure"
                type="text"
                value={getFieldValue("planningAppealProcedure")}
                onChange={handleFieldChange}
                error={errors.planningAppealProcedure}
              />
            </div>
          </div>
        </div>
      )}

      {/* Advertisement Application Edit Tab */}
      {activeTab === 'advert' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Status"
                name="advertAppStatusId"
                value={getFieldValue("advertAppStatusId")}
                onChange={handleFieldChange}
                options={applicationStatuses.map(s => ({ value: s.id, label: s.name }))}
                error={errors.advertAppStatusId}
              />
              <EditField
                label="LA Reference"
                name="advertAppRefLa"
                type="text"
                value={getFieldValue("advertAppRefLa")}
                onChange={handleFieldChange}
                error={errors.advertAppRefLa}
              />
              <EditField
                label="Submitted Date"
                name="advertApplicationSubmitted"
                type="date"
                value={getFieldValue("advertApplicationSubmitted")}
                onChange={handleFieldChange}
                error={errors.advertApplicationSubmitted}
              />
              <EditField
                label="Registration Date"
                name="advertApplicationRegistration"
                type="date"
                value={getFieldValue("advertApplicationRegistration")}
                onChange={handleFieldChange}
                error={errors.advertApplicationRegistration}
              />
              <EditField
                label="Target Date"
                name="advertAppDeterminationDate"
                type="date"
                value={getFieldValue("advertAppDeterminationDate")}
                onChange={handleFieldChange}
                error={errors.advertAppDeterminationDate}
              />
            </div>
            <div className="mt-4">
              <EditField
                label="Description"
                name="advertApplicationDescription"
                type="textarea"
                value={getFieldValue("advertApplicationDescription")}
                onChange={handleFieldChange}
                error={errors.advertApplicationDescription}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Conditions</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditField
                label="Number of Conditions"
                name="advertConditionsNumber"
                type="number"
                value={getFieldValue("advertConditionsNumber")}
                onChange={handleFieldChange}
                error={errors.advertConditionsNumber}
              />
            </div>
            <div className="mt-4">
              <EditField
                label="Conditions Detail"
                name="advertConditions"
                type="textarea"
                value={getFieldValue("advertConditions")}
                onChange={handleFieldChange}
                error={errors.advertConditions}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Appeal</h4>
            <div className="grid grid-cols-2 gap-4">
              <EditField
                label="Appeal Submitted"
                name="advertAppealSubmitted"
                type="date"
                value={getFieldValue("advertAppealSubmitted")}
                onChange={handleFieldChange}
                error={errors.advertAppealSubmitted}
              />
              <EditField
                label="Appeal Reference"
                name="advertAppealRefLa"
                type="text"
                value={getFieldValue("advertAppealRefLa")}
                onChange={handleFieldChange}
                error={errors.advertAppealRefLa}
              />
              <EditField
                label="Appeal Start"
                name="advertAppealStart"
                type="date"
                value={getFieldValue("advertAppealStart")}
                onChange={handleFieldChange}
                error={errors.advertAppealStart}
              />
              <EditField
                label="Procedure"
                name="advertAppealProcedure"
                type="text"
                value={getFieldValue("advertAppealProcedure")}
                onChange={handleFieldChange}
                error={errors.advertAppealProcedure}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <ExpandableCard
      title="Planning"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#fa6e60' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
