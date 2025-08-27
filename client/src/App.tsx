import { useState } from "react";
import { trpc } from "./trpc";

export default function App() {
  const todosQuery = trpc.todo.list.useQuery();
  const addTodo = trpc.todo.add.useMutation();
  const updateTodo = trpc.todo.update.useMutation();
  const deleteTodo = trpc.todo.delete.useMutation();
  const toggleTodo = trpc.todo.toggle.useMutation();

  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = async () => {
    if (newTodo.trim()) {
      await addTodo.mutateAsync(newTodo);
      setNewTodo("");
      todosQuery.refetch();
    }
  };

  const handleUpdate = async (id: number) => {
    if (editText.trim()) {
      await updateTodo.mutateAsync({ id, text: editText });
      setEditId(null);
      setEditText("");
      todosQuery.refetch();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTodo.mutateAsync(id);
    todosQuery.refetch();
  };

  const handleToggle = async (id: number) => {
    await toggleTodo.mutateAsync(id);
    todosQuery.refetch();
  };

  const todos = todosQuery.data ?? [];
  const remainingCount = todos.filter((t) => !t.done).length;

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "500px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📋 Tâche à faire</h1>

      <p style={{ textAlign: "center", color: "#555" }}>
        Tâches à faire : <strong>{remainingCount}</strong>
      </p>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Nouvelle tâche"
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "8px 8px",
            margin:"2px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: " 8px 8px ",
            backgroundColor: "#3a9167ff	",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
        >
          ➕ Ajouter
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              marginBottom: "0.5rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggle(todo.id)}
              style={{ marginRight: "0.8rem" }}
            />
            {editId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ flex: 1, padding: "0.3rem" }}
              />
            ) : (
              <span
                style={{
                  textDecoration: todo.done ? "line-through" : "none",
                  color: todo.done ? "#888" : "#333",
                  flex: 1,
                }}
              >
                {todo.text}
              </span>
            )}

            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
              {editId === todo.id ? (
                <button 
                onClick={() => handleUpdate(todo.id)}
                style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: " 8px 8px ",
            backgroundColor: "#3a9167ff	",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}>💾Enregistrer</button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(todo.id);
                    setEditText(todo.text);
                  }}
                  style={{
            padding: "0.5rem 0.5rem",
            border: "none",
            borderRadius: " 8px 8px ",
            backgroundColor: "#3481f5ff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
                >
                  🖊️Modifier
                </button>
              )}
              <button
               onClick={() => handleDelete(todo.id)}
               style={{
            padding: "0.5rem 0.5rem",
            border: "none",
            borderRadius: " 8px 8px ",
            backgroundColor: "#d62536ff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}>
               🗑️Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
