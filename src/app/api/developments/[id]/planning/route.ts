/**
 * API Route: PATCH /api/developments/[id]/planning
 *
 * Updates the planning fields of a development.
 * Handles both Planning Application and Advertisement Application fields.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Fields that can be updated through this endpoint
const ALLOWED_FIELDS = [
  // Planning Application
  "planningAppStatusId",
  "planningScore",
  "planningApplicationDescription",
  "planningApplicationDetail",
  "planningClientApproval",
  "planningApplicationSubmitted",
  "planningAppRegistration",
  "planningAppRefLa",
  "planningAppDeterminDate",
  "planningConditions",
  "planningConditionsNumber",
  // Planning Appeal
  "planningAppealSubmitted",
  "planningAppealStart",
  "planningAppealRefLa",
  "planningAppealProcedure",
  // Advertisement Application
  "advertAppStatusId",
  "advertApplicationDescription",
  "advertApplicationDetail",
  "advertApplicationSubmitted",
  "advertApplicationRegistration",
  "advertAppRefLa",
  "advertAppDeterminationDate",
  "advertConditions",
  "advertConditionsNumber",
  // Advertisement Appeal
  "advertAppealSubmitted",
  "advertAppealStart",
  "advertAppealRefLa",
  "advertAppealProcedure",
]

// Date fields
const DATE_FIELDS = [
  "planningApplicationSubmitted",
  "planningAppRegistration",
  "planningAppDeterminDate",
  "planningAppealSubmitted",
  "planningAppealStart",
  "advertApplicationSubmitted",
  "advertApplicationRegistration",
  "advertAppDeterminationDate",
  "advertAppealSubmitted",
  "advertAppealStart",
]

// Integer fields
const INT_FIELDS = [
  "planningAppStatusId",
  "planningScore",
  "planningConditionsNumber",
  "advertAppStatusId",
  "advertConditionsNumber",
]

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get development ID
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

    // Filter and validate fields
    const updateData: Record<string, unknown> = {}
    const errors: Record<string, string> = {}

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) {
        continue
      }

      // Handle date fields
      if (DATE_FIELDS.includes(key)) {
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
      // Handle integer fields
      else if (INT_FIELDS.includes(key)) {
        if (value !== null && value !== undefined && value !== "") {
          const num = parseInt(value as string, 10)
          if (isNaN(num)) {
            errors[key] = "Must be a valid number"
            continue
          }
          // Validate planning score range
          if (key === "planningScore" && (num < 1 || num > 5)) {
            errors[key] = "Planning score must be between 1 and 5"
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

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    // Check we have something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    // Add timestamp
    updateData.updatedAt = new Date()

    // Perform update
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
    console.error("Error updating planning data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
