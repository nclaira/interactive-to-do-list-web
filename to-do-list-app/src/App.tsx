import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, TaskFilters } from './types';
import Home from './components/Home';

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
    // If dropped outside a valid drop target
    if (!result.destination) {
      return;
    }

    // If the item was dropped in the same position
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    // Create a new array from the current tasks
    const newTasks = Array.from(tasks);
    
    // Remove the dragged task from its original position
    const [movedTask] = newTasks.splice(result.source.index, 1);
    
    // Insert it at the new position
    newTasks.splice(result.destination.index, 0, movedTask);

    // Update the state with the new task order
    setTasks(newTasks);
    
    // Also update localStorage to persist the new order
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-sky-200'}`}>
        <Home
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          tasks={tasks}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          category={category}
          setCategory={setCategory}
          priority={priority}
          setPriority={setPriority}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          updateTaskText={updateTaskText}
          filters={filters}
          setFilters={setFilters}
          filteredTasks={filteredTasks}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
