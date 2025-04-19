"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<any>("");
  const [allTodos, setAllTodos] = useState<any>([]);
  const [editingId, setEditingId] = useState<any>(null);

  async function fetchTodo() {
    const response = await fetch("http://localhost:4000/todos");
    const result = await response.json();
   
    setAllTodos([...result]);
  }

  const handleAdd = () => {
    if (editingId) {
      fetch(`http://localhost:4000/todos/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: input }), 
      })
        .then((response) => response.json())
        .then((updatedTodo) => {
          const updatedTodos = allTodos.map((todo: any) =>
            todo._id === editingId ? updatedTodo : todo
          );
          setAllTodos(updatedTodos);
          setInput("");
          setEditingId(null);
        });
    } else {
      // create
      fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: input }),
      })
        .then((response) => response.json())
        .then((todo) => {
          setAllTodos((prevTodos:any) => [...prevTodos, todo]);
          setInput("");
        })
        .catch((error) => {
          console.log(`There is an error: ${error}`);
        });
    }
  };
  

  function GetAllTodo() {
    fetchTodo();
  }

  function HandlerEdit(id: string) {
      const todoToEdit = allTodos.find((todo: any) => todo._id === id);
      if (todoToEdit) {
        setInput(todoToEdit.value); 
        setEditingId(id); 
      }
  }
  

  function HandlerToggle(id: string) {
    fetch(`http://localhost:4000/todos/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      body : JSON.stringify({id})
    })
      .then((responce) => responce.json())
      .then((todo) => {
        console.log(todo.isComplete)
        console.log(todo)
        const updatedTodos = allTodos.map((todo: any) => {
          if (todo._id === id) {
            return { ...todo, isComplete: !todo.isComplete };
          }
          return todo;
        }); 
        setAllTodos(updatedTodos);
      });
  }

  function HandlerDelete(id: string) {
    console.log(id);
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((responce) => responce.json())
      .then((todo) => {
        console.log(todo);
        const updatedTodos = allTodos.filter((todo: any) => todo._id !== id);
        setAllTodos(updatedTodos);
      });
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          value={input}
          placeholder="Enter your todo"
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>

      <button
        onClick={GetAllTodo}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Get All Todos
      </button>

      <div>
        <ul className="space-y-2">
          {allTodos &&
            allTodos.map((item : any) => {
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded"
                >
                  <li
                    className={item.isComplete ? "line-through text-gray-500" : "text-black"}
                  >
                    {item.value}
                  </li>

                  <div className="flex gap-2">
                    <button
                      onClick={() => HandlerEdit(item._id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => HandlerToggle(item._id)}
                      className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => HandlerDelete(item._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
