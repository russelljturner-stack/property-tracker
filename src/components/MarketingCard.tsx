"use client"

/**
 * MarketingCard Component
 *
 * Expandable card for the Marketing section of a Development.
 * Displays media owner information and tender offers.
 *
 * Note: The FileMaker system had tender workflow fields that are not yet
 * in the Prisma schema - these will be added in a future schema update.
 */

import { useState, useCallback, useMemo } from "react"
import { ExpandableCard, ViewField, SelectField } from "./ExpandableCard"

// Type for Decimal values from Prisma
type DecimalLike = { toNumber(): number } | number | null | undefined

export type MarketingData = {
  id: number
  mediaOwnerId?: number | null
  mediaOwner?: { id: number; name: string } | null
  mediaOwnerAgentId?: number | null
  mediaOwnerAgent?: { id: number; name: string } | null
  tenderOffers?: Array<{
    id: number
    offerAmount?: DecimalLike
    offerDate?: Date | null
    offerFrom?: string | null
  }>
}

type MarketingCardProps = {
  developmentId: number
  data: MarketingData
  mediaOwners: Array<{ id: number; name: string }>
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

function formatCurrency(value: DecimalLike): string {
  if (value === null || value === undefined) return "—"
  const num = typeof value === 'object' && 'toNumber' in value ? value.toNumber() : value
  return `£${Number(num).toLocaleString()}`
}

export function MarketingCard({
  developmentId,
  data,
  mediaOwners,
  isActive = false,
  isComplete = false,
  defaultExpanded = false,
}: MarketingCardProps) {
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
    const value = data[name as keyof MarketingData]
    if (typeof value === 'object' && value !== null && 'id' in value) {
      return (value as { id: number }).id
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
        } else if (key.includes("Id")) {
          updateData[key] = value ? parseInt(value as string, 10) : null
        } else {
          updateData[key] = value
        }
      }

      const response = await fetch(`/api/developments/${developmentId}/marketing`, {
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

  // Calculate best offer
  const bestOffer = useMemo(() => {
    if (!data.tenderOffers || data.tenderOffers.length === 0) return null
    return data.tenderOffers.reduce((best, offer) => {
      const bestAmount = best?.offerAmount
        ? (typeof best.offerAmount === 'object' && 'toNumber' in best.offerAmount
            ? best.offerAmount.toNumber()
            : Number(best.offerAmount))
        : 0
      const offerAmount = offer.offerAmount
        ? (typeof offer.offerAmount === 'object' && 'toNumber' in offer.offerAmount
            ? offer.offerAmount.toNumber()
            : Number(offer.offerAmount))
        : 0
      return offerAmount > bestAmount ? offer : best
    }, data.tenderOffers[0])
  }, [data.tenderOffers])

  // Summary content
  const summaryContent = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ViewField label="Media Owner" value={data.mediaOwner?.name} />
      <ViewField label="Media Owner Agent" value={data.mediaOwnerAgent?.name} />
      <ViewField label="Offers Received" value={data.tenderOffers?.length?.toString() || "0"} />
      <ViewField label="Best Offer" value={bestOffer ? formatCurrency(bestOffer.offerAmount) : undefined} />
    </div>
  )

  // View content
  const viewContent = (
    <div className="space-y-6">
      {/* Media Owner Details */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Media Owner</h4>
        <div className="grid grid-cols-2 gap-4">
          <ViewField label="Media Owner" value={data.mediaOwner?.name} />
          <ViewField label="Media Owner Agent" value={data.mediaOwnerAgent?.name} />
        </div>
      </div>

      {/* Tender Offers */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Tender Offers</h4>
        {data.tenderOffers && data.tenderOffers.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600">Total Offers Received</span>
              <span className="font-semibold text-gray-900">{data.tenderOffers.length}</span>
            </div>
            {/* Offer list */}
            <div className="space-y-2">
              {data.tenderOffers.map((offer, index) => {
                const isBest = bestOffer && offer.id === bestOffer.id
                return (
                  <div
                    key={offer.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isBest ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div>
                      <span className={`text-sm font-medium ${isBest ? 'text-green-800' : 'text-gray-900'}`}>
                        {offer.offerFrom || 'Unknown bidder'}
                      </span>
                      {offer.offerDate && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(offer.offerDate)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${isBest ? 'text-green-700' : 'text-gray-700'}`}>
                        {formatCurrency(offer.offerAmount)}
                      </span>
                      {isBest && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">Best Offer</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tender offers yet</p>
        )}
      </div>

      {/* Note about missing fields */}
      <div className="pt-4 border-t border-gray-200">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> Additional tender workflow fields (tender sent date, deadline,
            number invited, etc.) will be added in a future update.
          </p>
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

      {/* Media Owner Selection */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Media Owner</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Media Owner"
            name="mediaOwnerId"
            value={getFieldValue("mediaOwnerId")}
            onChange={handleFieldChange}
            options={mediaOwners.map(m => ({ value: m.id, label: m.name }))}
            error={errors.mediaOwnerId}
          />
          <SelectField
            label="Media Owner Agent"
            name="mediaOwnerAgentId"
            value={getFieldValue("mediaOwnerAgentId")}
            onChange={handleFieldChange}
            options={mediaOwners.map(m => ({ value: m.id, label: m.name }))}
            error={errors.mediaOwnerAgentId}
          />
        </div>
      </div>

      {/* Tender Offers - Read-only in this context, managed separately */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Tender Offers</h4>
        <p className="text-sm text-gray-500">
          Tender offers are managed through the tender management system.
          {data.tenderOffers && data.tenderOffers.length > 0 && (
            <span className="ml-1">Currently {data.tenderOffers.length} offer(s) on record.</span>
          )}
        </p>
      </div>
    </div>
  )

  return (
    <ExpandableCard
      title="Marketing"
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#1e434d' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
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
