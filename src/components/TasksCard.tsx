"use client"

/**
 * TasksCard Component
 *
 * Expandable tasks card for the sidebar. Shows first 5 tasks by default,
 * with a "View all" button to expand and show all tasks.
 */

import { useState, useTransition } from "react"
import { toggleTaskComplete } from "@/app/actions/tasks"

type Task = {
  id: number
  description: string | null
  dueDate: Date | null
  complete: boolean
  priority: string | null
  taskType?: { name: string } | null
}

type TasksCardProps = {
  tasks: Task[]
}

export function TasksCard({ tasks: initialTasks }: TasksCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const openTaskCount = tasks.filter(t => !t.complete).length
  const hasMoreTasks = tasks.length > 3

  // Show all tasks when expanded, otherwise just first 3
  const displayedTasks = isExpanded ? tasks : tasks.slice(0, 3)

  // Handler for toggling task completion
  const handleToggleComplete = async (taskId: number, currentComplete: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, complete: !currentComplete } : t
    ))

    try {
      await toggleTaskComplete(taskId, !currentComplete)
    } catch (error) {
      // Revert on error
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, complete: currentComplete } : t
      ))
      console.error('Failed to update task:', error)
    }
  }

  return (
    <section id="tasks" className="bg-white shadow overflow-hidden" style={{ borderRadius: 0 }}>
      {/* Pulse animation for open tasks badge - contained within card */}
      <style>{`
        @keyframes task-pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .task-pulse-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .task-pulse-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          background-color: #fa6e60;
          animation: task-pulse 1.5s ease-out infinite;
        }
      `}</style>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Tasks</h3>
        {/* Wrapper for pulse animation - only animate if there are open tasks */}
        <div className={`${openTaskCount > 0 ? 'task-pulse-wrapper' : ''}`}>
          <span
            className="relative z-10 text-sm font-medium px-3 py-1 rounded-full inline-block"
            style={{
              backgroundColor: openTaskCount > 0 ? '#fa6e60' : '#10b981',
              color: '#ffffff'
            }}
          >
            {openTaskCount} open
          </span>
        </div>
      </div>

      {/* Task list */}
      <div className="divide-y divide-gray-100 bg-gray-50">
        {tasks.length === 0 ? (
          <div className="px-6 py-6 text-center text-gray-500">
            No tasks for this development.
          </div>
        ) : (
          displayedTasks.map((task) => (
            <TaskItemCompact
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
            />
          ))
        )}
      </div>

      {/* Footer with actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button className="text-sm hover:opacity-80" style={{ color: '#fa6e60' }}>
          + Add Task
        </button>
        {hasMoreTasks && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm hover:opacity-80"
            style={{ color: '#fa6e60' }}
          >
            {isExpanded ? `Show less` : `View all (${tasks.length})`}
          </button>
        )}
      </div>
    </section>
  )
}

/**
 * TaskItemCompact - Compact task display for sidebar with checkbox
 */
function TaskItemCompact({
  task,
  onToggleComplete
}: {
  task: Task
  onToggleComplete: (taskId: number, currentComplete: boolean) => void
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.complete

  return (
    <div className="px-6 py-3 flex gap-3">
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
        {/* Top row: Type badge and priority */}
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
        </div>
        {/* Task description */}
        <p
          className={`text-base leading-tight ${
            task.complete ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.description || "Task"}
        </p>
        {/* Due date */}
        {task.dueDate && (
          <p
            className={`text-sm mt-1 ${
              isOverdue
                ? "text-red-600 font-medium"
                : task.complete
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {isOverdue && !task.complete ? "Overdue: " : "Due: "}
            {new Date(task.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  )
}
