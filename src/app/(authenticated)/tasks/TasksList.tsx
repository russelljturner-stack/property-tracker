"use client"

import { useState } from "react"
import Link from "next/link"
import { toggleTaskComplete } from "@/app/actions/tasks"

type Task = {
  id: number
  description: string | null
  dueDate: Date | null
  complete: boolean
  priority: string | null
  taskType: { name: string } | null
  development: {
    id: number
    name: string
  } | null
}

type TasksListProps = {
  openTasks: Task[]
  completedTasks: Task[]
}

export function TasksList({ openTasks: initialOpen, completedTasks: initialCompleted }: TasksListProps) {
  const [openTasks, setOpenTasks] = useState(initialOpen)
  const [completedTasks, setCompletedTasks] = useState(initialCompleted)
  const [showCompleted, setShowCompleted] = useState(false)

  const handleToggleComplete = async (taskId: number, currentComplete: boolean) => {
    // Find the task
    const task = currentComplete
      ? completedTasks.find(t => t.id === taskId)
      : openTasks.find(t => t.id === taskId)

    if (!task) return

    // Optimistic update - move between lists
    if (currentComplete) {
      // Moving from completed to open
      setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
      setOpenTasks(prev => [...prev, { ...task, complete: false }])
    } else {
      // Moving from open to completed
      setOpenTasks(prev => prev.filter(t => t.id !== taskId))
      setCompletedTasks(prev => [...prev, { ...task, complete: true }])
    }

    try {
      await toggleTaskComplete(taskId, !currentComplete)
    } catch (error) {
      // Revert on error
      if (currentComplete) {
        setOpenTasks(prev => prev.filter(t => t.id !== taskId))
        setCompletedTasks(prev => [...prev, task])
      } else {
        setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
        setOpenTasks(prev => [...prev, task])
      }
      console.error('Failed to update task:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Open Tasks */}
      <div className="bg-white shadow" style={{ borderRadius: 0 }}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Open Tasks</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {openTasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No open tasks - nice work!
            </div>
          ) : (
            openTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks (collapsible) */}
      {completedTasks.length > 0 && (
        <div className="bg-white shadow" style={{ borderRadius: 0 }}>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-semibold" style={{ color: '#1e434d' }}>
              Completed ({completedTasks.length})
            </h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showCompleted ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCompleted && (
            <div className="divide-y divide-gray-100">
              {completedTasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TaskRow({
  task,
  onToggleComplete,
}: {
  task: Task
  onToggleComplete: (taskId: number, currentComplete: boolean) => void
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.complete

  return (
    <div className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id, task.complete)}
        className={`
          flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center
          transition-colors cursor-pointer
          ${task.complete
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        title={task.complete ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.complete && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {task.taskType && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              {task.taskType.name}
            </span>
          )}
          {task.priority?.toLowerCase() === 'high' && !task.complete && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              HIGH
            </span>
          )}
          {isOverdue && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              OVERDUE
            </span>
          )}
        </div>
        <p
          className={`text-base ${
            task.complete ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.description || "Task"}
        </p>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          {task.dueDate && (
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              Due: {new Date(task.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {task.development && (
            <Link
              href={`/developments/${task.development.id}`}
              className="text-blue-600 hover:underline"
            >
              {task.development.name}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
