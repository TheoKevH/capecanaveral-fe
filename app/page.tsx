import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Cape Canaveral 🚀</h1>
      <Link href="/test" className="text-blue-600 underline">Go to Test Page</Link>
    </main>
  )
}
