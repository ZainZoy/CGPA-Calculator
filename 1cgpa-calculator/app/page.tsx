"use client"

import { useState, useEffect } from "react"
import type { User, Course, ActivityLog, Projection } from "@/lib/types"
import { UserManagement } from "@/components/UserManagement"
import { CGPASummary } from "@/components/CGPASummary"
import { CourseManagement } from "@/components/CourseManagement"
import { MinimalView } from "@/components/MinimalView"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProjectionModal } from "@/components/ProjectionModal"
import { ViewRecordsModal } from "@/components/ViewRecordsModal"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [projections, setProjections] = useState<Projection[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isMinimalView, setIsMinimalView] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showProjectionModal, setShowProjectionModal] = useState(false)
  const [showRecordsModal, setShowRecordsModal] = useState(false)

  // Load initial data
  useEffect(() => {
    loadUsers()
    loadCourses()
    loadActivities()
    loadProjections()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].id)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const loadCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      const data = await response.json()
      setCourses(data)
      setLoading(false)
    } catch (error) {
      console.error("Error loading courses:", error)
      setLoading(false)
    }
  }

  const loadActivities = async () => {
    try {
      const response = await fetch("/api/activities")
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error("Error loading activities:", error)
    }
  }

  const loadProjections = async () => {
    try {
      const response = await fetch("/api/projections")
      const data = await response.json()
      setProjections(data)
    } catch (error) {
      console.error("Error loading projections:", error)
    }
  }

  const logActivity = async (activity: Omit<ActivityLog, "id">) => {
    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      })
      const newActivity = await response.json()
      setActivities([newActivity, ...activities])
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  const addCourse = async (course: Omit<Course, "id">) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...course, userId: selectedUserId }),
      })
      const newCourse = await response.json()
      setCourses([...courses, newCourse])

      // Log activity
      await logActivity({
        userId: selectedUserId,
        type: "course_added",
        description: `Added course: ${newCourse.name}`,
        newValue: newCourse,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Error adding course:", error)
    }
  }

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const oldCourse = courses.find((c) => c.id === id)
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const updatedCourse = await response.json()
      setCourses(courses.map((c) => (c.id === id ? updatedCourse : c)))

      // Log activity
      await logActivity({
        userId: selectedUserId,
        type: "course_updated",
        description: `Updated course: ${updatedCourse.name}`,
        oldValue: oldCourse,
        newValue: updatedCourse,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      const courseToDelete = courses.find((c) => c.id === id)
      await fetch(`/api/courses/${id}`, { method: "DELETE" })
      setCourses(courses.filter((c) => c.id !== id))

      // Log activity
      if (courseToDelete) {
        await logActivity({
          userId: selectedUserId,
          type: "course_deleted",
          description: `Deleted course: ${courseToDelete.name}`,
          oldValue: courseToDelete,
          timestamp: new Date(),
        })
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const addUser = async (user: Omit<User, "id">) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      const newUser = await response.json()
      setUsers([...users, newUser])
      if (!selectedUserId) {
        setSelectedUserId(newUser.id)
      }

      // Log activity
      await logActivity({
        userId: newUser.id,
        type: "user_created",
        description: `Created user: ${newUser.name}`,
        newValue: newUser,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" })
      setUsers(users.filter((u) => u.id !== id))
      // Delete all courses for this user
      setCourses(courses.filter((c) => c.userId !== id))
      // Delete all activities for this user
      setActivities(activities.filter((a) => a.userId !== id))
      // Delete all projections for this user
      setProjections(projections.filter((p) => p.userId !== id))

      if (selectedUserId === id) {
        setSelectedUserId(users.find((u) => u.id !== id)?.id || "")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const saveProjection = async (projection: Omit<Projection, "id">) => {
    try {
      const response = await fetch("/api/projections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projection),
      })
      const newProjection = await response.json()
      setProjections([...projections, newProjection])

      // Log activity
      await logActivity({
        userId: selectedUserId,
        type: "projection_created",
        description: `Created CGPA projection`,
        newValue: newProjection,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error("Error saving projection:", error)
    }
  }

  const userCourses = courses.filter((c) => c.userId === selectedUserId)
  const userActivities = activities.filter((a) => a.userId === selectedUserId)
  const userProjections = projections.filter((p) => p.userId === selectedUserId)
  const selectedUser = users.find((u) => u.id === selectedUserId)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} ${isMinimalView ? "minimal-view-active" : ""} transition-colors duration-300`}
    >
      <Header
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        isMinimalView={isMinimalView}
        setIsMinimalView={setIsMinimalView}
        onViewRecords={() => setShowRecordsModal(true)}
      />

      <main className="container mx-auto p-6">
        {!isMinimalView ? (
          <div className="dashboard-view grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <UserManagement
                users={users}
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                addUser={addUser}
                deleteUser={deleteUser}
                isDarkTheme={isDarkTheme}
              />
              <CGPASummary courses={userCourses} user={selectedUser} isDarkTheme={isDarkTheme} />
            </div>
            <div className="lg:col-span-2">
              <CourseManagement
                courses={userCourses}
                addCourse={addCourse}
                updateCourse={updateCourse}
                deleteCourse={deleteCourse}
                onShowProjection={() => setShowProjectionModal(true)}
                isDarkTheme={isDarkTheme}
              />
            </div>
          </div>
        ) : (
          <MinimalView
            courses={userCourses}
            user={selectedUser}
            addCourse={addCourse}
            deleteCourse={deleteCourse}
            isDarkTheme={isDarkTheme}
          />
        )}
      </main>

      <Footer isDarkTheme={isDarkTheme} />

      <ProjectionModal
        isOpen={showProjectionModal}
        onClose={() => setShowProjectionModal(false)}
        user={selectedUser}
        courses={userCourses}
        onSaveProjection={saveProjection}
        isDarkTheme={isDarkTheme}
      />

      <ViewRecordsModal
        isOpen={showRecordsModal}
        onClose={() => setShowRecordsModal(false)}
        user={selectedUser}
        courses={userCourses}
        activities={userActivities}
        projections={userProjections}
        isDarkTheme={isDarkTheme}
      />
    </div>
  )
}
