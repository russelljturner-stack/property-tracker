"use client"

/**
 * CommercialCard Component
 *
 * An expandable card for the Commercial section of a Development.
 * Supports view mode (read-only) and edit mode (form inputs).
 *
 * This component manages its own form state and handles saving to the server.
 */

import { useState, useCallback, useMemo } from "react"
import { ExpandableCard, ViewField, EditField, SelectField } from "./ExpandableCard"

// Decimal type from Prisma (or a number)
// Prisma returns Decimal objects for currency fields, which we need to handle
type DecimalLike = { toNumber(): number } | number | null | undefined

// Type for the commercial data we receive from the server
// Using a flexible type that accepts Prisma's Decimal type as well as numbers
export type CommercialData = {
  id: number
  // Deal summary
  offerAgreed?: Date | null
  leasePerAnnum?: DecimalLike
  contractSigned?: Date | null
  probability?: number | null
  estimateOrActual?: string | null
  // Cost
  purchasePrice?: DecimalLike
  // Revenue
  rentalValue?: DecimalLike
  leaseStartDate?: Date | null
  term?: number | null
  // Profit
  profitYear1?: DecimalLike
  profitThereafter?: DecimalLike
  feeProposal?: string | null
  // Consultancy
  rentalValueConsultancy?: DecimalLike
  consultancyFinancials?: string | null
  // Existing Lease
  currentRentPerAnnum?: DecimalLike
  currentLeaseStartDate?: Date | null
  currentLeaseEndDate?: Date | null
  currentLeaseTerm?: number | null
  currentLeaseUrl?: string | null
  // AFL
  aflSigned?: Date | null
  aflExpiryDate?: Date | null
  aflSignedComment?: string | null
  aflExpiryComment?: string | null
  // Contract Terms
  contractingEntity?: { id: number; name: string } | null
  matterNo?: string | null
  contractIssued?: Date | null
  leaseAssignable?: string | null
  rpiIncreases?: string | null
  rentCommencement?: string | null
  contractTerm?: string | null
  contractAnnualRent?: string | null
  contractUrl?: string | null
  // Legal
  lawyer?: { id: number; name: string } | null
  lawyerContact?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email?: string | null
    organisation?: { name: string } | null
  } | null
  // Documents
  contractDocs?: Array<{
    id: number
    description?: string | null
    documentUrl?: string | null
    documentType?: string | null
  }>
}

type CommercialCardProps = {
  /** The development ID */
  developmentId: number
  /** The commercial data */
  data: CommercialData
  /** Whether this is the current active stage */
  isActive?: boolean
  /** Whether this stage is complete */
  isComplete?: boolean
  /** Whether to start expanded */
  defaultExpanded?: boolean
  /** Lookup options for dropdowns */
  contractingEntities?: Array<{ id: number; name: string }>
  lawyers?: Array<{ id: number; name: string }>
}

// Helper functions
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(value: DecimalLike): string {
  if (value === null || value === undefined) return "—"
  // Handle Prisma Decimal objects which have a toNumber() method
  const num = typeof value === 'object' && 'toNumber' in value ? value.toNumber() : Number(value)
  return `£${num.toLocaleString()}`
}

function calculateEndDate(startDate: Date | null | undefined, termYears: number | null | undefined): string {
  if (!startDate || !termYears) return "—"
  const end = new Date(startDate)
  end.setFullYear(end.getFullYear() + termYears)
  return formatDate(end)
}

function toNumber(value: DecimalLike): number | null {
  if (value === null || value === undefined) return null
  return typeof value === 'object' && 'toNumber' in value ? value.toNumber() : Number(value)
}

function calculateTotalProfit(
  profitYear1: DecimalLike,
  profitThereafter: DecimalLike,
  termYears: number | null | undefined
): string {
  const p1 = toNumber(profitYear1)
  const pt = toNumber(profitThereafter)
  if (!p1 || !termYears) return "—"
  const thereafter = pt || 0
  const total = p1 + (thereafter * (termYears - 1))
  return formatCurrency(total)
}

function isExpiringSoon(date: Date | string | null | undefined): boolean {
  if (!date) return false
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
  const dateObj = new Date(date)
  return dateObj <= sixMonthsFromNow && dateObj > new Date()
}

// Convert date to YYYY-MM-DD for input fields
function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return ""
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}

/**
 * CommercialCard - Expandable card for Commercial section
 */
export function CommercialCard({
  developmentId,
  data,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
  contractingEntities = [],
  lawyers = [],
}: CommercialCardProps) {
  // Form state - copy of data that we modify during editing
  const [formData, setFormData] = useState<Record<string, string | number | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Check if consultancy section has data
  const hasConsultancyData = data.consultancyFinancials || data.rentalValueConsultancy
  // Check if existing lease has data
  const hasExistingLeaseData = data.currentRentPerAnnum || data.currentLeaseEndDate
  // Check if AFL has data
  const hasAflData = data.aflSigned || data.aflExpiryDate
  // Check if contract docs exist
  const hasContractDocs = data.contractDocs && data.contractDocs.length > 0

  // Expiry warnings
  const existingLeaseExpiringSoon = isExpiringSoon(data.currentLeaseEndDate)
  const aflExpiringSoon = isExpiringSoon(data.aflExpiryDate)

  // Track if form has changes
  const hasChanges = useMemo(() => {
    return Object.keys(formData).length > 0
  }, [formData])

  // Handle field change in edit mode
  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  // Get form value (use form state if changed, otherwise use original data)
  const getFieldValue = useCallback((name: string): string | number | undefined => {
    if (name in formData) {
      return formData[name] ?? undefined
    }
    // Handle nested properties and date conversions
    const keys = name.split(".")
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let value: any = data
    /* eslint-enable @typescript-eslint/no-explicit-any */
    for (const key of keys) {
      value = value?.[key]
    }
    // Convert dates for input fields
    if (value instanceof Date) {
      return toDateInputValue(value)
    }
    return value ?? undefined
  }, [formData, data])

  // Handle cancel - reset form state
  const handleCancel = useCallback(() => {
    setFormData({})
    setErrors({})
  }, [])

  // Handle save
  const handleSave = useCallback(async (): Promise<boolean> => {
    setIsSaving(true)
    setErrors({})

    try {
      // Prepare the data to send
      const updateData: Record<string, unknown> = {}

      // Only include fields that have changed
      for (const [key, value] of Object.entries(formData)) {
        // Convert empty strings to null
        if (value === "") {
          updateData[key] = null
        }
        // Convert date strings to Date objects
        else if (key.includes("Date") || key === "offerAgreed" || key === "contractSigned" || key === "contractIssued" || key === "aflSigned") {
          updateData[key] = value ? new Date(value as string) : null
        }
        // Convert numeric fields
        else if (["leasePerAnnum", "probability", "purchasePrice", "rentalValue", "term", "profitYear1", "profitThereafter", "rentalValueConsultancy", "currentRentPerAnnum", "currentLeaseTerm"].includes(key)) {
          updateData[key] = value ? Number(value) : null
        }
        // Handle entity IDs
        else if (key === "contractingEntityId" || key === "lawyerId") {
          updateData[key] = value ? Number(value) : null
        }
        else {
          updateData[key] = value
        }
      }

      // Make API call to save
      const response = await fetch(`/api/developments/${developmentId}/commercial`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Success - clear form state
      setFormData({})
      // Could show a toast notification here
      return true
    } catch (error) {
      console.error("Save error:", error)
      setErrors({ _form: "An unexpected error occurred" })
      return false
    } finally {
      setIsSaving(false)
    }
  }, [formData, developmentId])

  // Summary content - always visible
  const summaryContent = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ViewField label="Offer Agreed" value={formatDate(data.offerAgreed)} />
      <ViewField label="Lease Per Annum" value={formatCurrency(data.leasePerAnnum)} />
      <ViewField label="Contract Signed" value={formatDate(data.contractSigned)} />
      <ViewField label="Probability" value={data.probability ? `${data.probability}%` : undefined} />
    </div>
  )

  // View content - shown when expanded in view mode
  const viewContent = (
    <div className="space-y-6">
      {/* Deal Financials */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Deal Financials</h4>

        {/* Estimate or Actual toggle display */}
        <div className="mb-4">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Estimate or Actual?</span>
          <div className="mt-1 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              data.estimateOrActual === "Estimate"
                ? "bg-blue-100 text-blue-800 font-medium"
                : "bg-gray-100 text-gray-500"
            }`}>
              Estimate
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              data.estimateOrActual === "Actual"
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-gray-100 text-gray-500"
            }`}>
              Actual
            </span>
          </div>
        </div>

        {/* Three column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cost */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Cost</h5>
            <ViewField label="Rent Per Annum" value={formatCurrency(data.leasePerAnnum)} />
            <ViewField label="Purchase Price" value={formatCurrency(data.purchasePrice)} />
          </div>

          {/* Revenue */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Revenue</h5>
            <ViewField label="Rental Value" value={formatCurrency(data.rentalValue)} />
            <ViewField label="Start Date" value={formatDate(data.leaseStartDate)} />
            <ViewField label="Term (Years)" value={data.term?.toString()} />
            <ViewField label="End Date" value={calculateEndDate(data.leaseStartDate, data.term)} />
          </div>

          {/* Profit */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Profit</h5>
            <ViewField label="Profit Year 1" value={formatCurrency(data.profitYear1)} />
            <ViewField label="Profit Subsequent Years" value={formatCurrency(data.profitThereafter)} />
            <ViewField label="Total Profit" value={calculateTotalProfit(data.profitYear1, data.profitThereafter, data.term)} />
          </div>
        </div>

        {/* Fee Proposal */}
        {data.feeProposal && (
          <div className="mt-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Fee Proposal</span>
            <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded p-3">{data.feeProposal}</p>
          </div>
        )}
      </div>

      {/* Consultancy Financials - conditional */}
      {hasConsultancyData && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Consultancy Financials</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <ViewField label="Rental Value (Consultancy)" value={formatCurrency(data.rentalValueConsultancy)} />
          </div>
          {data.consultancyFinancials && (
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Description</span>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded p-3">{data.consultancyFinancials}</p>
            </div>
          )}
        </div>
      )}

      {/* Existing Lease - conditional */}
      {hasExistingLeaseData && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Existing Lease
            {existingLeaseExpiringSoon && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                Expiring Soon
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ViewField label="Current Rent Per Annum" value={formatCurrency(data.currentRentPerAnnum)} />
            <ViewField label="Lease Start Date" value={formatDate(data.currentLeaseStartDate)} />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wider">Lease End Date</dt>
              <dd className={`text-sm mt-0.5 ${existingLeaseExpiringSoon ? "text-amber-600 font-semibold" : "text-gray-900"}`}>
                {formatDate(data.currentLeaseEndDate)}
                {existingLeaseExpiringSoon && " ⚠️"}
              </dd>
            </div>
            <ViewField label="Term" value={data.currentLeaseTerm ? `${data.currentLeaseTerm} years` : undefined} />
          </div>
          {data.currentLeaseUrl && (
            <div className="mt-3">
              <a
                href={data.currentLeaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Current Lease Document
              </a>
            </div>
          )}
        </div>
      )}

      {/* AFL - conditional */}
      {hasAflData && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
            AFL (Agreement for Lease)
            {aflExpiringSoon && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                Expiring Soon
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ViewField label="AFL Signed" value={formatDate(data.aflSigned)} />
            <div>
              <dt className="text-xs text-gray-500 uppercase tracking-wider">AFL Expiry Date</dt>
              <dd className={`text-sm mt-0.5 ${aflExpiringSoon ? "text-amber-600 font-semibold" : "text-gray-900"}`}>
                {formatDate(data.aflExpiryDate)}
                {aflExpiringSoon && " ⚠️"}
              </dd>
            </div>
          </div>
          {(data.aflSignedComment || data.aflExpiryComment) && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.aflSignedComment && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">AFL Signed Comments</span>
                  <p className="mt-1 text-sm text-gray-900">{data.aflSignedComment}</p>
                </div>
              )}
              {data.aflExpiryComment && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">AFL Expiry Comments</span>
                  <p className="mt-1 text-sm text-gray-900">{data.aflExpiryComment}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contract Terms */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contract Terms</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ViewField label="Contracting Entity" value={data.contractingEntity?.name} />
          <ViewField label="Matter No" value={data.matterNo} />
          <ViewField label="Contract Issued" value={formatDate(data.contractIssued)} />
          <ViewField label="Contract Signed" value={formatDate(data.contractSigned)} />
          <ViewField label="Lease Assignable" value={data.leaseAssignable} />
          <ViewField label="RPI Increases" value={data.rpiIncreases} />
          <ViewField label="Rent Commencement" value={data.rentCommencement} />
          <ViewField label="Contract Term" value={data.contractTerm} />
          <ViewField label="Contract Annual Rent" value={data.contractAnnualRent} />
        </div>
        {data.contractUrl && (
          <div className="mt-3">
            <a
              href={data.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Contract Document
            </a>
          </div>
        )}
      </div>

      {/* Contract Documents - conditional */}
      {hasContractDocs && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contract Documents</h4>
          <div className="space-y-2">
            {data.contractDocs?.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.description || "Document"}</p>
                  {doc.documentType && (
                    <p className="text-xs text-gray-500">{doc.documentType}</p>
                  )}
                </div>
                {doc.documentUrl && (
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal */}
      {(data.lawyer || data.lawyerContact) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Legal</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.lawyer && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Law Firm</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{data.lawyer.name}</p>
              </div>
            )}
            {data.lawyerContact && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Lawyer Contact</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {`${data.lawyerContact.firstName || ""} ${data.lawyerContact.lastName || ""}`.trim() || "—"}
                </p>
                {data.lawyerContact.organisation && (
                  <p className="text-xs text-gray-500">{data.lawyerContact.organisation.name}</p>
                )}
                <div className="flex gap-3 mt-2">
                  {data.lawyerContact.phone && (
                    <a href={`tel:${data.lawyerContact.phone}`} className="text-xs text-blue-600 hover:text-blue-800">
                      {data.lawyerContact.phone}
                    </a>
                  )}
                  {data.lawyerContact.email && (
                    <a href={`mailto:${data.lawyerContact.email}`} className="text-xs text-blue-600 hover:text-blue-800">
                      {data.lawyerContact.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  // Edit content - form inputs
  const editContent = (
    <div className="space-y-6">
      {/* Form-level error */}
      {errors._form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {errors._form}
        </div>
      )}

      {/* Deal Summary */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Deal Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EditField
            label="Offer Agreed"
            name="offerAgreed"
            type="date"
            value={getFieldValue("offerAgreed")}
            onChange={handleFieldChange}
            error={errors.offerAgreed}
          />
          <EditField
            label="Lease Per Annum (£)"
            name="leasePerAnnum"
            type="number"
            value={getFieldValue("leasePerAnnum")}
            onChange={handleFieldChange}
            error={errors.leasePerAnnum}
          />
          <EditField
            label="Contract Signed"
            name="contractSigned"
            type="date"
            value={getFieldValue("contractSigned")}
            onChange={handleFieldChange}
            error={errors.contractSigned}
          />
          <EditField
            label="Probability (%)"
            name="probability"
            type="number"
            value={getFieldValue("probability")}
            onChange={handleFieldChange}
            error={errors.probability}
          />
        </div>
      </div>

      {/* Deal Financials */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Deal Financials</h4>

        {/* Estimate or Actual */}
        <div className="mb-4">
          <SelectField
            label="Estimate or Actual?"
            name="estimateOrActual"
            value={getFieldValue("estimateOrActual")}
            onChange={handleFieldChange}
            options={[
              { value: "Estimate", label: "Estimate" },
              { value: "Actual", label: "Actual" },
            ]}
            error={errors.estimateOrActual}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cost */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Cost</h5>
            <EditField
              label="Purchase Price (£)"
              name="purchasePrice"
              type="number"
              value={getFieldValue("purchasePrice")}
              onChange={handleFieldChange}
              error={errors.purchasePrice}
            />
          </div>

          {/* Revenue */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Revenue</h5>
            <EditField
              label="Rental Value (£)"
              name="rentalValue"
              type="number"
              value={getFieldValue("rentalValue")}
              onChange={handleFieldChange}
              error={errors.rentalValue}
            />
            <EditField
              label="Start Date"
              name="leaseStartDate"
              type="date"
              value={getFieldValue("leaseStartDate")}
              onChange={handleFieldChange}
              error={errors.leaseStartDate}
            />
            <EditField
              label="Term (Years)"
              name="term"
              type="number"
              value={getFieldValue("term")}
              onChange={handleFieldChange}
              error={errors.term}
            />
          </div>

          {/* Profit */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Profit</h5>
            <EditField
              label="Profit Year 1 (£)"
              name="profitYear1"
              type="number"
              value={getFieldValue("profitYear1")}
              onChange={handleFieldChange}
              error={errors.profitYear1}
            />
            <EditField
              label="Profit Subsequent Years (£)"
              name="profitThereafter"
              type="number"
              value={getFieldValue("profitThereafter")}
              onChange={handleFieldChange}
              error={errors.profitThereafter}
            />
          </div>
        </div>

        <div className="mt-4">
          <EditField
            label="Fee Proposal"
            name="feeProposal"
            type="textarea"
            value={getFieldValue("feeProposal")}
            onChange={handleFieldChange}
            error={errors.feeProposal}
          />
        </div>
      </div>

      {/* Consultancy Financials */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Consultancy Financials</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <EditField
            label="Rental Value Consultancy (£)"
            name="rentalValueConsultancy"
            type="number"
            value={getFieldValue("rentalValueConsultancy")}
            onChange={handleFieldChange}
            error={errors.rentalValueConsultancy}
          />
        </div>
        <EditField
          label="Consultancy Financials Description"
          name="consultancyFinancials"
          type="textarea"
          value={getFieldValue("consultancyFinancials")}
          onChange={handleFieldChange}
          error={errors.consultancyFinancials}
        />
      </div>

      {/* Existing Lease */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Existing Lease</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EditField
            label="Current Rent Per Annum (£)"
            name="currentRentPerAnnum"
            type="number"
            value={getFieldValue("currentRentPerAnnum")}
            onChange={handleFieldChange}
            error={errors.currentRentPerAnnum}
          />
          <EditField
            label="Lease Start Date"
            name="currentLeaseStartDate"
            type="date"
            value={getFieldValue("currentLeaseStartDate")}
            onChange={handleFieldChange}
            error={errors.currentLeaseStartDate}
          />
          <EditField
            label="Lease End Date"
            name="currentLeaseEndDate"
            type="date"
            value={getFieldValue("currentLeaseEndDate")}
            onChange={handleFieldChange}
            error={errors.currentLeaseEndDate}
          />
          <EditField
            label="Term (Years)"
            name="currentLeaseTerm"
            type="number"
            value={getFieldValue("currentLeaseTerm")}
            onChange={handleFieldChange}
            error={errors.currentLeaseTerm}
          />
        </div>
        <div className="mt-4">
          <EditField
            label="Current Lease Document URL"
            name="currentLeaseUrl"
            type="text"
            value={getFieldValue("currentLeaseUrl")}
            onChange={handleFieldChange}
            error={errors.currentLeaseUrl}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* AFL */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">AFL (Agreement for Lease)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EditField
            label="AFL Signed"
            name="aflSigned"
            type="date"
            value={getFieldValue("aflSigned")}
            onChange={handleFieldChange}
            error={errors.aflSigned}
          />
          <EditField
            label="AFL Expiry Date"
            name="aflExpiryDate"
            type="date"
            value={getFieldValue("aflExpiryDate")}
            onChange={handleFieldChange}
            error={errors.aflExpiryDate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <EditField
            label="AFL Signed Comments"
            name="aflSignedComment"
            type="textarea"
            value={getFieldValue("aflSignedComment")}
            onChange={handleFieldChange}
            error={errors.aflSignedComment}
          />
          <EditField
            label="AFL Expiry Comments"
            name="aflExpiryComment"
            type="textarea"
            value={getFieldValue("aflExpiryComment")}
            onChange={handleFieldChange}
            error={errors.aflExpiryComment}
          />
        </div>
      </div>

      {/* Contract Terms */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contract Terms</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SelectField
            label="Contracting Entity"
            name="contractingEntityId"
            value={getFieldValue("contractingEntityId") ?? data.contractingEntity?.id}
            onChange={handleFieldChange}
            options={contractingEntities.map(e => ({ value: e.id, label: e.name }))}
            error={errors.contractingEntityId}
          />
          <EditField
            label="Matter No"
            name="matterNo"
            type="text"
            value={getFieldValue("matterNo")}
            onChange={handleFieldChange}
            error={errors.matterNo}
          />
          <EditField
            label="Contract Issued"
            name="contractIssued"
            type="date"
            value={getFieldValue("contractIssued")}
            onChange={handleFieldChange}
            error={errors.contractIssued}
          />
          <SelectField
            label="Lease Assignable"
            name="leaseAssignable"
            value={getFieldValue("leaseAssignable")}
            onChange={handleFieldChange}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            error={errors.leaseAssignable}
          />
          <SelectField
            label="RPI Increases"
            name="rpiIncreases"
            value={getFieldValue("rpiIncreases")}
            onChange={handleFieldChange}
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            error={errors.rpiIncreases}
          />
          <EditField
            label="Rent Commencement"
            name="rentCommencement"
            type="text"
            value={getFieldValue("rentCommencement")}
            onChange={handleFieldChange}
            error={errors.rentCommencement}
          />
          <EditField
            label="Contract Term"
            name="contractTerm"
            type="text"
            value={getFieldValue("contractTerm")}
            onChange={handleFieldChange}
            error={errors.contractTerm}
          />
          <EditField
            label="Contract Annual Rent"
            name="contractAnnualRent"
            type="text"
            value={getFieldValue("contractAnnualRent")}
            onChange={handleFieldChange}
            error={errors.contractAnnualRent}
          />
        </div>
        <div className="mt-4">
          <EditField
            label="Contract Document URL"
            name="contractUrl"
            type="text"
            value={getFieldValue("contractUrl")}
            onChange={handleFieldChange}
            error={errors.contractUrl}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Legal */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Legal</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Law Firm"
            name="lawyerId"
            value={getFieldValue("lawyerId") ?? data.lawyer?.id}
            onChange={handleFieldChange}
            options={lawyers.map(l => ({ value: l.id, label: l.name }))}
            error={errors.lawyerId}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Note: Lawyer contact is managed separately in the Contacts section.
        </p>
      </div>
    </div>
  )

  return (
    <ExpandableCard
      title="Commercial"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
