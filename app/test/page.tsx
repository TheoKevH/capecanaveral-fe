"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function TestPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn()) {
      router.push("/auth/login");
      return;
    }

    const fetchBoards = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBoards(data);
      } catch (err) {
        console.error("Error fetching boards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [router]);

  return (
    <main className="p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          const token = localStorage.getItem("token");

          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/boards`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newBoardName }),
              }
            );

            const data = await res.json();
            if (!res.ok)
              return setError(data.message || "Failed to create board");

            // Add new board to state
            setBoards((prev) => [...prev, data]);
            setNewBoardName("");
            toast.success("Board created successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to create board");
          }
        }}
        className="mb-6 space-y-2"
      >
        <input
          type="text"
          placeholder="Board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create Board
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      <h1 className="text-2xl font-bold mb-4">Your Boards</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={50} color="#2563eb" />
        </div>
      ) : (
        <ul className="list-disc ml-6 space-y-2">
          {boards.length === 0 ? (
            <li>No boards found.</li>
          ) : (
            boards.map((board) => (
              <li key={board._id}>
                <a
                  href={`/board/${board._id}`}
                  className="text-blue-600 underline"
                >
                  {board.name}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }}
      >
        Logout
      </button>
    </main>
  );
}
