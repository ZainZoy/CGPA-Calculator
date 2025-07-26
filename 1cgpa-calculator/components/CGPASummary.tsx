import type { Course, User } from "@/lib/types"
import { calculateCGPA } from "@/lib/utils"

interface CGPASummaryProps {
  courses: Course[]
  user?: User
  isDarkTheme: boolean
}

export function CGPASummary({ courses, user, isDarkTheme }: CGPASummaryProps) {
  const { totalQualityPoints, totalCredits, cgpa } = calculateCGPA(courses, user)

  return (
    <div className={`${isDarkTheme ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg`} data-section="cgpa-summary">
      <h2 className="text-xl font-semibold mb-4">CGPA Summary</h2>

      <div className="space-y-4">
        <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
          <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Total Quality Points</p>
          <p className="text-3xl font-bold text-blue-400">{totalQualityPoints.toFixed(1)}</p>
          {user && user.existingQualityPoints > 0 && (
            <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"}`}>
              (Includes {user.existingQualityPoints} existing)
            </p>
          )}
        </div>

        <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
          <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Credits Earned</p>
          <p className="text-3xl font-bold text-blue-400">{totalCredits}</p>
          {user && user.existingCredits > 0 && (
            <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"}`}>
              (Includes {user.existingCredits} existing)
            </p>
          )}
        </div>

        <div className={`${isDarkTheme ? "bg-gray-700/50" : "bg-gray-100"} p-4 rounded-lg`}>
          <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>Current CGPA</p>
          <p className="text-4xl font-bold text-emerald-400 glowing-text-green">{cgpa.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
