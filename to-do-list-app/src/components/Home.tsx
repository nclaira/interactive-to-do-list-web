import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskList from './TaskList';
import { Task } from '../types';

export interface HomeProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  tasks: Task[];
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: (e: React.FormEvent) => void;
  category: string;
  setCategory: (value: string) => void;
  priority: '' | 'High' | 'Medium' | 'Low';
  setPriority: (value: '' | 'High' | 'Medium' | 'Low') => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskText: (id: string, text: string) => void;
  onDragEnd: (result: any) => void;
  filters: any;
  setFilters: (filters: any) => void;
  filteredTasks: Task[];
}

const Home: React.FC<HomeProps> = ({
  darkMode,
  toggleDarkMode,
  tasks,
  newTask,
  setNewTask,
  addTask,
  category,
  setCategory,
  priority,
  setPriority,
  toggleComplete,
  deleteTask,
  updateTaskText,
  onDragEnd,
  filters,
  setFilters,
  filteredTasks,
}) => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed z-50 flex w-full top-0 left-0 items-center justify-between gap-2 bg-sky-900 dark:bg-gray-800 shadow-md px-4 md:px-12 p-4 rounded-b-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            MP
          </div>
          <h1 className="text-xl font-bold text-white dark:text-green-300">My Planner</h1>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm dark:text-white"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>

      <header className="text-center pt-24 pb-12 px-4">
        <p className="text-teal-600 dark:text-teal-400 text-3xl md:text-4xl font-bold">
          Plan your day, own your goals
        </p>
      </header>

      <main className="bg-sky-800 dark:bg-gray-800 shadow-lg rounded-2xl p-4 md:p-6 w-full max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side - Add Task */}
          <aside className="bg-sky-600 dark:bg-gray-700 p-5 rounded-2xl md:col-span-1 space-y-4">
            <form onSubmit={addTask} className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a new task..."
                  className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Category (optional)</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>School</option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as '' | 'High' | 'Medium' | 'Low')}
                  className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Priority (optional)</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </form>
          </aside>

          {/* Right Side - Task List */}
          <section className="bg-sky-700 dark:bg-gray-700 p-4 md:p-6 rounded-2xl md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search tasks"
                className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
              />

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option>Work</option>
                <option>Personal</option>
                <option>School</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="border rounded-xl px-3 py-2 dark:bg-gray-600 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              {filteredTasks.length > 0 ? (
                <TaskList
                  tasks={filteredTasks}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                  onUpdateText={updateTaskText}
                />
              ) : (
                <div className="text-center py-8 text-gray-300">
                  No tasks found. Add a new task to get started!
                </div>
              )}
            </DragDropContext>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
