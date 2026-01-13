/**
 * API Route: PATCH /api/developments/[id]/commercial
 *
 * Updates the commercial fields of a development.
 * This handles partial updates - only fields included in the request body are updated.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Fields that can be updated through this endpoint
const ALLOWED_FIELDS = [
  // Deal summary
  "offerAgreed",
  "leasePerAnnum",
  "contractSigned",
  "probability",
  "estimateOrActual",
  // Cost
  "purchasePrice",
  // Revenue
  "rentalValue",
  "leaseStartDate",
  "term",
  // Profit
  "profitYear1",
  "profitThereafter",
  "feeProposal",
  // Consultancy
  "rentalValueConsultancy",
  "consultancyFinancials",
  // Existing Lease
  "currentRentPerAnnum",
  "currentLeaseStartDate",
  "currentLeaseEndDate",
  "currentLeaseTerm",
  "currentLeaseUrl",
  // AFL
  "aflSigned",
  "aflExpiryDate",
  "aflSignedComment",
  "aflExpiryComment",
  // Contract Terms
  "contractingEntityId",
  "matterNo",
  "contractIssued",
  "leaseAssignable",
  "rpiIncreases",
  "rentCommencement",
  "contractTerm",
  "contractAnnualRent",
  "contractUrl",
  // Legal
  "lawyerId",
]

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication using NextAuth v5's auth() function
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get development ID from URL params
    const { id } = await params
    const developmentId = parseInt(id, 10)

    if (isNaN(developmentId)) {
      return NextResponse.json({ message: "Invalid development ID" }, { status: 400 })
    }

    // Check development exists
    const development = await db.development.findUnique({
      where: { id: developmentId },
      select: { id: true },
    })

    if (!development) {
      return NextResponse.json({ message: "Development not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Filter to only allowed fields
    const updateData: Record<string, unknown> = {}
    const errors: Record<string, string> = {}

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) {
        continue // Skip unknown fields
      }

      // Validate and transform values
      if (key === "probability") {
        if (value !== null && value !== undefined) {
          const num = Number(value)
          if (isNaN(num) || num < 0 || num > 100) {
            errors[key] = "Probability must be between 0 and 100"
            continue
          }
          updateData[key] = num
        } else {
          updateData[key] = null
        }
      }
      // Handle numeric fields
      else if (
        [
          "leasePerAnnum",
          "purchasePrice",
          "rentalValue",
          "term",
          "profitYear1",
          "profitThereafter",
          "rentalValueConsultancy",
          "currentRentPerAnnum",
          "currentLeaseTerm",
        ].includes(key)
      ) {
        if (value !== null && value !== undefined && value !== "") {
          const num = Number(value)
          if (isNaN(num)) {
            errors[key] = "Must be a valid number"
            continue
          }
          updateData[key] = num
        } else {
          updateData[key] = null
        }
      }
      // Handle date fields
      else if (
        [
          "offerAgreed",
          "contractSigned",
          "leaseStartDate",
          "currentLeaseStartDate",
          "currentLeaseEndDate",
          "aflSigned",
          "aflExpiryDate",
          "contractIssued",
        ].includes(key)
      ) {
        if (value !== null && value !== undefined && value !== "") {
          const date = new Date(value as string)
          if (isNaN(date.getTime())) {
            errors[key] = "Must be a valid date"
            continue
          }
          updateData[key] = date
        } else {
          updateData[key] = null
        }
      }
      // Handle foreign key IDs
      else if (["contractingEntityId", "lawyerId"].includes(key)) {
        if (value !== null && value !== undefined && value !== "") {
          const num = Number(value)
          if (isNaN(num)) {
            errors[key] = "Must be a valid ID"
            continue
          }
          updateData[key] = num
        } else {
          updateData[key] = null
        }
      }
      // Handle string fields
      else {
        updateData[key] = value === "" ? null : value
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    // If no valid fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    // Add updated timestamp
    updateData.updatedAt = new Date()
    // TODO: Add updatedBy when we have that field in schema

    // Perform the update
    const updated = await db.development.update({
      where: { id: developmentId },
      data: updateData,
      select: {
        id: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "Updated successfully",
      id: updated.id,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error("Error updating commercial data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
