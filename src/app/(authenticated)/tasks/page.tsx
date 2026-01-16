import { prisma } from "@/lib/prisma"
import { TasksList } from "./TasksList"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  // Fetch all tasks with related development info
  const tasks = await prisma.task.findMany({
    include: {
      development: {
        include: {
          site: {
            include: {
              address: true,
            },
          },
        },
      },
      taskType: true,
    },
    orderBy: [
      { complete: "asc" },      // Incomplete first
      { dueDate: "asc" },       // Then by due date
      { createdAt: "desc" },    // Then by creation date
    ],
  })

  // Separate open and completed tasks
  const openTasks = tasks.filter(t => !t.complete)
  const completedTasks = tasks.filter(t => t.complete)

  // Count overdue tasks
  const overdueTasks = openTasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date()
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1e434d' }}>Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {openTasks.length} open{overdueTasks.length > 0 && `, ${overdueTasks.length} overdue`}
          </p>
        </div>
        <button
          className="px-4 py-2 text-sm font-medium text-white rounded-full hover:opacity-90 transition-colors"
          style={{ backgroundColor: '#fa6e60' }}
        >
          + Add Task
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
          <div className="text-3xl font-bold" style={{ color: '#1e434d' }}>{openTasks.length}</div>
          <div className="text-sm text-gray-500">Open Tasks</div>
        </div>
        <div className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
          <div className="text-3xl font-bold" style={{ color: overdueTasks.length > 0 ? '#fa6e60' : '#1e434d' }}>
            {overdueTasks.length}
          </div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
        <div className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
          <div className="text-3xl font-bold" style={{ color: '#10b981' }}>{completedTasks.length}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
      </div>

      {/* Tasks List */}
      <TasksList
        openTasks={openTasks.map(t => ({
          id: t.id,
          description: t.description,
          dueDate: t.dueDate,
          complete: t.complete,
          priority: t.priority,
          taskType: t.taskType,
          development: t.development ? {
            id: t.development.id,
            name: t.development.site?.address?.street1 || `Development #${t.development.id}`,
          } : null,
        }))}
        completedTasks={completedTasks.map(t => ({
          id: t.id,
          description: t.description,
          dueDate: t.dueDate,
          complete: t.complete,
          priority: t.priority,
          taskType: t.taskType,
          development: t.development ? {
            id: t.development.id,
            name: t.development.site?.address?.street1 || `Development #${t.development.id}`,
          } : null,
        }))}
      />
    </div>
  )
}
