'use client';
import React, { useEffect,useState } from 'react'
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
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok) throw new Error("failed");
        const data: Todo[] = await res.json();
        console.log(data);
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
    <div>            {todos.map((todo) => (
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
            ))}</div>
  )
}

export default Page