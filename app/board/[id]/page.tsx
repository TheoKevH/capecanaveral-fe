"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

type Task = {
  _id: string;
  title: string;
  description?: string;
};

type Column = {
  _id: string;
  name: string;
  tasks: Task[];
};

type Board = {
  _id: string;
  name: string;
  columns: Column[];
};

export default function BoardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/auth/login");
      return;
    }

    const fetchBoard = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/boards/full/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setBoard(data);
      } catch (err) {
        console.error("Error fetching board:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, router]);

  if (loading) return <div className="p-6">Loading board...</div>;
  if (!board) return <div className="p-6">Board not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{board.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {board.columns.map((column) => (
          <div key={column._id} className="bg-gray-100 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">{column.name}</h2>
            <div className="space-y-2">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  const form = e.target as HTMLFormElement;
                  const title = (
                    form.elements.namedItem("title") as HTMLInputElement
                  ).value;
                  const description = (
                    form.elements.namedItem("description") as HTMLInputElement
                  ).value;

                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/tasks/${column._id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ title, description }),
                      }
                    );

                    const newTask = await res.json();
                    setBoard((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        columns: prev.columns.map((col) =>
                          col._id === column._id
                            ? { ...col, tasks: [...col.tasks, newTask] }
                            : col
                        ),
                      };
                    });
                    form.reset();
                  } catch (err) {
                    console.error("Failed to create task:", err);
                  }
                }}
                className="mb-3 space-y-2"
              >
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Task title"
                  className="w-full p-2 text-sm border rounded"
                />
                <input
                  name="description"
                  type="text"
                  placeholder="Description (optional)"
                  className="w-full p-2 text-sm border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-1 rounded text-sm"
                >
                  Add Task
                </button>
              </form>

              {column.tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-3 rounded shadow-sm border"
                >
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
              ))}
              {column.tasks.length === 0 && (
                <p className="text-sm text-gray-500">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
