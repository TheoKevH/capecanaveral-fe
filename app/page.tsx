"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold">
          🚀 Welcome to Cape Canaveral
        </h1>
        <p className="text-lg sm:text-xl">
          Task Management System with Kanban Board feature
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/auth/register">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-blue-200 transition">
              Get Started
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
              Log In
            </button>
          </Link>
        </div>

        <div className="mt-10 text-sm text-white/80">
          <p>Built by Theodore Kevin Himawan 💻 | Created with MERN stack + Next.js</p>
        </div>
      </div>
    </main>
  );
}
