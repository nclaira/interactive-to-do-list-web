import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import TaskList from './TaskList';
import { Task, TaskFilters } from '../types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'' | 'High' | 'Medium' | 'Low'>('');
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = 
      filters.status === 'all' || 
      (filters.status === 'completed' ? task.completed : !task.completed);
    const matchesCategory = 
      filters.category === 'all' || task.category === filters.category;
    const matchesPriority = 
      filters.priority === 'all' || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      category: category || undefined,
      priority: priority || undefined,
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setCategory('');
    setPriority('');
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskText = (id: string, newText: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-sky-200'}`}>
      {/* Navbar */}
      <nav className="fixed z-50 flex w-full top-0 left-0 items-center justify-between gap-2 bg-sky-900 dark:bg-gray-800 shadow-md px-4 md:px-12 p-4 rounded-b-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            MP
          </div>
          <h1 className="text-xl font-bold text-white dark:text-green-300">My Planner</h1>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
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
                  onChange={(e) => setPriority(e.target.value as any)}
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
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
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

export default App;
