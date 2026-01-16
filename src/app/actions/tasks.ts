"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Toggle task completion status
 */
export async function toggleTaskComplete(taskId: number, complete: boolean) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { complete },
    })

    // Revalidate pages that show tasks
    revalidatePath("/developments/[id]", "page")
    revalidatePath("/tasks", "page")

    return { success: true }
  } catch (error) {
    console.error("Failed to toggle task:", error)
    throw new Error("Failed to update task")
  }
}
