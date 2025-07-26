"use client"

import { useState } from "react"
import type { User } from "@/lib/types"

interface UserManagementProps {
  users: User[]
  selectedUserId: string
  setSelectedUserId: (id: string) => void
  addUser: (user: Omit<User, "id">) => void
  deleteUser: (id: string) => void
  isDarkTheme: boolean
}

export function UserManagement({
  users,
  selectedUserId,
  setSelectedUserId,
  addUser,
  deleteUser,
  isDarkTheme,
}: UserManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    major: "",
    existingQualityPoints: "",
    existingCredits: "",
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.major) {
      // Check for duplicate user (case insensitive)
      const isDuplicate = users.some(
        (user) =>
          user.name.toLowerCase() === newUser.name.toLowerCase() &&
          user.major.toLowerCase() === newUser.major.toLowerCase(),
      )

      if (isDuplicate) {
        alert("A user with this name and major already exists!")
        return
      }

      addUser({
        name: newUser.name,
        major: newUser.major,
        existingQualityPoints: Number.parseFloat(newUser.existingQualityPoints) || 0,
        existingCredits: Number.parseInt(newUser.existingCredits) || 0,
        createdAt: new Date(),
      })
      setNewUser({ name: "", major: "", existingQualityPoints: "", existingCredits: "" })
      setShowAddForm(false)
    }
  }

  const handleDeleteUser = () => {
    if (selectedUserId && confirm("Are you sure you want to delete this user and all their courses?")) {
      deleteUser(selectedUserId)
    }
  }

  return (
    <div
      className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`}
      data-section="user-management"
    >
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-1`}>
            Select Student
          </label>
          <div className="relative">
            <select
              className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.major}
                </option>
              ))}
            </select>
            <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {showAddForm && (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Enter student name (e.g., Sarah Wilson)"
                className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter major/program (e.g., Computer Science)"
                className={`w-full ${isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"} border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newUser.major}
                onChange={(e) => setNewUser({ ...newUser, major: e.target.value })}
              />
            </div>

            <div
              className={`${isDarkTheme ? "bg-gray-700/30" : "bg-blue-50"} p-3 rounded-lg border-l-4 border-blue-500`}
            >
              <h4 className="font-medium text-blue-400 mb-2">Previous Academic History (Optional)</h4>
              <p className={`text-xs ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-3`}>
                If you're transferring from another institution or continuing from previous semesters, enter your
                academic history below. Leave blank if you're starting fresh.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    Quality Points Earned
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 120.5 (leave empty for 0)"
                    min="0"
                    step="0.1"
                    className={`w-full ${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={newUser.existingQualityPoints}
                    onChange={(e) => setNewUser({ ...newUser, existingQualityPoints: e.target.value })}
                  />
                  <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    Total quality points from previous courses
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium ${isDarkTheme ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    Credit Hours Completed
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 30 (leave empty for 0)"
                    min="0"
                    className={`w-full ${isDarkTheme ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300"} border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={newUser.existingCredits}
                    onChange={(e) => setNewUser({ ...newUser, existingCredits: e.target.value })}
                  />
                  <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    Total credit hours from previous courses
                  </p>
                </div>
              </div>

              <div className={`mt-3 p-2 ${isDarkTheme ? "bg-gray-600/50" : "bg-blue-100"} rounded text-xs`}>
                <p className={`${isDarkTheme ? "text-gray-300" : "text-blue-800"}`}>
                  <strong>Example:</strong> If you completed 30 credit hours with a 3.5 GPA, your quality points would
                  be 30 × 3.5 = 105.0
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Add Student
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 ${isDarkTheme ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"} font-semibold py-2 px-4 rounded-lg transition`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <span className="material-icons text-base mr-2">{showAddForm ? "close" : "person_add"}</span>
            {showAddForm ? "Cancel" : "Add Student"}
          </button>

          {selectedUserId && (
            <button
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold p-2 rounded-lg transition"
            >
              <span className="material-icons">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
