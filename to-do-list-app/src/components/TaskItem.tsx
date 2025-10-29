import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onToggleComplete,
  onDelete,
  onUpdateText,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (editText.trim()) {
      onUpdateText(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.text);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex justify-between items-center p-3 my-2 rounded-xl shadow transition-all ${
            snapshot.isDragging 
              ? 'bg-gray-200 dark:bg-gray-700 transform scale-105 shadow-lg' 
              : 'bg-white dark:bg-gray-700 hover:shadow-md'
          }`}
          style={{
            ...provided.draggableProps.style,
            // Add a slight tilt when dragging for better visual feedback
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(1deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
          <div className="flex items-center space-x-3 flex-1" {...provided.dragHandleProps}>
            {/* Drag handle icon */}
            <div className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="9" cy="5" r="1"></circle>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <circle cx="15" cy="19" r="1"></circle>
              </svg>
            </div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}
                onDoubleClick={handleEdit}
              >
                {task.text}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {task.priority && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                }`}
              >
                {task.priority}
              </span>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
