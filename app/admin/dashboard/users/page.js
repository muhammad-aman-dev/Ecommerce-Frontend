'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaArrowLeft, FaUser } from "react-icons/fa"


const mockUsers = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali@gmail.com",
    createdAt: "2024-12-01T10:23:00Z"
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    createdAt: "2024-11-15T14:10:00Z"
  },
  {
    id: 3,
    name: "Ahmed Raza",
    email: "ahmed@gmail.com",
    createdAt: "2024-12-05T09:05:00Z"
  },
  {
    id: 4,
    name: "Fatima Noor",
    email: "fatima@gmail.com",
    createdAt: "2024-10-20T16:30:00Z"
  },
  {
    id: 5,
    name: "Usman Malik",
    email: "usman@gmail.com",
    createdAt: "2024-09-10T11:45:00Z"
  }
]

export default function FindUsersPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  // Filter users by name or email
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-teal-50 p-6">

      {/* Back */}
      <div
        className="flex items-center gap-2 mb-6 text-teal-600 cursor-pointer hover:underline"
        onClick={() => router.push("/admin/dashboard")}
      >
        <FaArrowLeft /> Back to Dashboard
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <FaUser className="text-2xl text-teal-600" />
        <h1 className="text-3xl font-bold text-teal-700">Find Users</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Search platform users by name or email.
      </p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6"
      />

      {/* Users List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">

        {filteredUsers.length === 0 && <p className="text-gray-500">No users found.</p>}

        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-1">Email: {user.email}</p>
            <p className="text-sm text-gray-600">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}