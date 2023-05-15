import React, { useState, useEffect } from "react";
import Task from "./Task";
import "../CSS/style.css";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch("http://localhost:4200/tasks")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.log("Error fetching todos:", error));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTodo = () => {
    if (input.trim() !== "") {
      const newTask = {
        task: input,
        completed: false,
      };

      fetch("http://localhost:4200/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos((prevTodos) => [...prevTodos, data]);
          setInput("");
        })
        .catch((error) => console.log("Error adding todo:", error));
    }
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:4200/tasks/${id}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
        } else {
          console.log("Error deleting todo:", response.status);
        }
      })
      .catch((error) => console.log("Error deleting todo:", error));
  };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    // Update the task on the server
    const updatedTask = updatedTodos.find((todo) => todo._id === id);
    fetch(`http://localhost:4200/tasks/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Error updating todo:", response.status);
        }
      })
      .catch((error) => console.log("Error updating todo:", error));
  };
  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a task..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <Task
            key={todo._id}
            todo={todo}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
