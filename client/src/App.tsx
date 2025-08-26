import { trpc } from "./trpc";
import { useState } from "react";

function App() {
  const hello = trpc.hello.useQuery();
  const todos = trpc.todo.list.useQuery();
  const addTodo = trpc.todo.add.useMutation({
    onSuccess: () => todos.refetch(),
  });
  const toggleTodo = trpc.todo.toggle.useMutation({
    onSuccess: () => todos.refetch(),
  });

  const [newTodo, setNewTodo] = useState("");

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
      <h1 style={{ textAlign: "center", color: "#333" }}>
        {hello.data?.message}
      </h1>

      <h2 style={{ marginTop: "2rem", color: "#555" }}>Bon courage</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.data?.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo.mutate(todo.id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              marginBottom: "0.5rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <input
              type="checkbox"
              readOnly
              checked={todo.done}
              style={{ marginRight: "0.8rem" }}
            />
            <span style={{
              textDecoration: todo.done ? "line-through" : "none",
              color: todo.done ? "#888" : "#333",
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", marginTop: "1rem" }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Nouvelle tâche"
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={() => {
            addTodo.mutate(newTodo);
            setNewTodo("");
          }}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0 8px 8px 0",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default App;
