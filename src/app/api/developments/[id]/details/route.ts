/**
 * API Route: /api/developments/[id]/details
 *
 * Manages DevelopmentDetail records (panel configurations) for a development.
 *
 * Methods:
 * - GET: Fetch all panel details for a development
 * - POST: Create a new panel detail
 * - PATCH: Update an existing panel detail
 * - DELETE: Remove a panel detail
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type RouteParams = {
  params: Promise<{ id: string }>
}

// Fields that can be updated through this endpoint
const ALLOWED_FIELDS = [
  "panelTypeId",
  "panelSizeId",
  "orientationId",
  "structureTypeId",
  "digital",
  "illuminated",
  "sides",
  "quantity",
  "height",
  "width",
]

/**
 * GET /api/developments/[id]/details
 * Fetch all panel details for a development
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const developmentId = parseInt(id, 10)

    if (isNaN(developmentId)) {
      return NextResponse.json({ message: "Invalid development ID" }, { status: 400 })
    }

    const details = await db.developmentDetail.findMany({
      where: { developmentId },
      include: {
        panelType: { select: { id: true, name: true } },
        panelSize: { select: { id: true, name: true } },
        orientation: { select: { id: true, name: true } },
        structureType: { select: { id: true, name: true } },
      },
      orderBy: { id: "asc" },
    })

    return NextResponse.json({ details })
  } catch (error) {
    console.error("Error fetching panel details:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/developments/[id]/details
 * Create a new panel detail for a development
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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

    const body = await request.json()
    const createData: Record<string, unknown> = { developmentId }

    // Process allowed fields
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) continue

      if (key.endsWith("Id")) {
        // Foreign key - convert to number or null
        createData[key] = value ? parseInt(String(value), 10) : null
      } else if (key === "sides" || key === "quantity") {
        // Integer fields
        createData[key] = value ? parseInt(String(value), 10) : null
      } else if (key === "height" || key === "width") {
        // Decimal fields
        createData[key] = value ? parseFloat(String(value)) : null
      } else {
        // String fields (digital, illuminated)
        createData[key] = value === "" ? null : value
      }
    }

    const created = await db.developmentDetail.create({
      data: createData,
      include: {
        panelType: { select: { id: true, name: true } },
        panelSize: { select: { id: true, name: true } },
        orientation: { select: { id: true, name: true } },
        structureType: { select: { id: true, name: true } },
      },
    })

    // Also update development's updatedAt timestamp
    await db.development.update({
      where: { id: developmentId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: "Panel detail created",
      detail: created,
    })
  } catch (error) {
    console.error("Error creating panel detail:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/developments/[id]/details
 * Update an existing panel detail
 * Requires detailId in the request body
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const developmentId = parseInt(id, 10)

    if (isNaN(developmentId)) {
      return NextResponse.json({ message: "Invalid development ID" }, { status: 400 })
    }

    const body = await request.json()
    const { detailId, ...fields } = body

    if (!detailId) {
      return NextResponse.json({ message: "detailId is required" }, { status: 400 })
    }

    // Verify the detail belongs to this development
    const existing = await db.developmentDetail.findFirst({
      where: {
        id: parseInt(String(detailId), 10),
        developmentId,
      },
    })

    if (!existing) {
      return NextResponse.json({ message: "Panel detail not found" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    // Process allowed fields
    for (const [key, value] of Object.entries(fields)) {
      if (!ALLOWED_FIELDS.includes(key)) continue

      if (key.endsWith("Id")) {
        // Foreign key - convert to number or null
        updateData[key] = value ? parseInt(String(value), 10) : null
      } else if (key === "sides" || key === "quantity") {
        // Integer fields
        updateData[key] = value ? parseInt(String(value), 10) : null
      } else if (key === "height" || key === "width") {
        // Decimal fields
        updateData[key] = value ? parseFloat(String(value)) : null
      } else {
        // String fields (digital, illuminated)
        updateData[key] = value === "" ? null : value
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    const updated = await db.developmentDetail.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        panelType: { select: { id: true, name: true } },
        panelSize: { select: { id: true, name: true } },
        orientation: { select: { id: true, name: true } },
        structureType: { select: { id: true, name: true } },
      },
    })

    // Also update development's updatedAt timestamp
    await db.development.update({
      where: { id: developmentId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: "Panel detail updated",
      detail: updated,
    })
  } catch (error) {
    console.error("Error updating panel detail:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/developments/[id]/details
 * Remove a panel detail
 * Requires detailId in query params or body
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const developmentId = parseInt(id, 10)

    if (isNaN(developmentId)) {
      return NextResponse.json({ message: "Invalid development ID" }, { status: 400 })
    }

    // Get detailId from query params or body
    const url = new URL(request.url)
    let detailId = url.searchParams.get("detailId")

    if (!detailId) {
      try {
        const body = await request.json()
        detailId = body.detailId
      } catch {
        // No body provided
      }
    }

    if (!detailId) {
      return NextResponse.json({ message: "detailId is required" }, { status: 400 })
    }

    // Verify the detail belongs to this development
    const existing = await db.developmentDetail.findFirst({
      where: {
        id: parseInt(String(detailId), 10),
        developmentId,
      },
    })

    if (!existing) {
      return NextResponse.json({ message: "Panel detail not found" }, { status: 404 })
    }

    await db.developmentDetail.delete({
      where: { id: existing.id },
    })

    // Also update development's updatedAt timestamp
    await db.development.update({
      where: { id: developmentId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: "Panel detail deleted",
      deletedId: existing.id,
    })
  } catch (error) {
    console.error("Error deleting panel detail:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
