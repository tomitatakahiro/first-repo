"use client";

import React, { useEffect, useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!res.ok) throw new Error("failed");
        const data: Todo[] = await res.json();
        setTodos(data);
      } catch (e) {
        setError("TODOリストの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 24,
        boxSizing: "border-box",
        background: "#f5f5f7",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: "20px 22px 28px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center" }}>
          JSONPlaceholder Todos
        </h1>

        {loading && (
          <p style={{ marginTop: 12, color: "#6b7280" }}>読み込み中...</p>
        )}

        {error && (
          <p
            style={{
              marginTop: 12,
              color: "#b91c1c",
              background: "#fef2f2",
              border: "1px solid #fecdd3",
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "12px 14px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ fontWeight: 700 }}>{todo.title}</div>
                <div style={{ marginTop: 6, fontSize: "0.9rem" }}>
                  User: {todo.userId}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 999,
                    fontSize: "0.8rem",
                    background: todo.completed ? "#dcfce7" : "#fee2e2",
                    color: todo.completed ? "#166534" : "#991b1b",
                  }}
                >
                  {todo.completed ? "Completed" : "Not completed"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;

