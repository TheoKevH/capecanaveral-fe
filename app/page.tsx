import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Cape Canaveral 🚀</h1>
      <Link href="/auth/register" className="text-blue-600 underline">Register</Link>
      <Link href="/auth/login" className="text-blue-600 underline">Login</Link>
      <Link href="/test" className="text-blue-600 underline">Test Page</Link>
    </main>
  )
}
