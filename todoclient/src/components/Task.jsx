import React from "react";

const Task = ({ todo, onDelete, onToggle }) => {
  const { _id, task, completed } = todo;

  const handleDelete = () => {
    onDelete(_id);
  };

  const handleToggle = () => {
    onToggle(_id);
  };

  return (
    <li className={`task ${completed ? "completed" : ""}`}>
      <div className="task-content">
        <span className="task-text">{task}</span>
        <div className="task-actions">
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
          <button className="toggle-btn" onClick={handleToggle}>
            {completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      </div>
    </li>
  );
};

export default Task;
