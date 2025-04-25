'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [boards, setBoards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return alert('No token found. Please login.')

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()
        setBoards(data)
      } catch (err) {
        console.error('Error fetching boards:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBoards()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Boards</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc ml-6 space-y-2">
          {boards.length === 0 ? (
            <li>No boards found.</li>
          ) : (
            boards.map((board) => (
              <li key={board._id}>
                <span className="font-medium">{board.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  )
}
