"use client"

interface HeaderProps {
  isDarkTheme: boolean
  setIsDarkTheme: (theme: boolean) => void
  isMinimalView: boolean
  setIsMinimalView: (view: boolean) => void
  onViewRecords: () => void
}

export function Header({ isDarkTheme, setIsDarkTheme, isMinimalView, setIsMinimalView, onViewRecords }: HeaderProps) {
  return (
    <header
      className={`${isDarkTheme ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur-sm sticky top-0 z-50 border-b ${isDarkTheme ? "border-gray-700/50" : "border-gray-200/50"}`}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          href="#"
        >
          CGPA Calculator
        </a>

        {!isMinimalView && (
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`hover:${isDarkTheme ? "text-blue-400" : "text-blue-600"} cursor-pointer transition-colors duration-200 relative group`}
            >
              Home
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkTheme ? "bg-blue-400" : "bg-blue-600"} transition-all duration-200 group-hover:w-full`}
              ></span>
            </button>
            <button
              onClick={() =>
                document.querySelector('[data-section="user-management"]')?.scrollIntoView({ behavior: "smooth" })
              }
              className={`hover:${isDarkTheme ? "text-blue-400" : "text-blue-600"} cursor-pointer transition-colors duration-200 relative group`}
            >
              User Management
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkTheme ? "bg-blue-400" : "bg-blue-600"} transition-all duration-200 group-hover:w-full`}
              ></span>
            </button>
            <button
              onClick={() =>
                document.querySelector('[data-section="course-management"]')?.scrollIntoView({ behavior: "smooth" })
              }
              className={`hover:${isDarkTheme ? "text-blue-400" : "text-blue-600"} cursor-pointer transition-colors duration-200 relative group`}
            >
              Course Management
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkTheme ? "bg-blue-400" : "bg-blue-600"} transition-all duration-200 group-hover:w-full`}
              ></span>
            </button>
            <button
              onClick={() =>
                document.querySelector('[data-section="cgpa-summary"]')?.scrollIntoView({ behavior: "smooth" })
              }
              className={`hover:${isDarkTheme ? "text-blue-400" : "text-blue-600"} cursor-pointer transition-colors duration-200 relative group`}
            >
              CGPA Summary
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkTheme ? "bg-blue-400" : "bg-blue-600"} transition-all duration-200 group-hover:w-full`}
              ></span>
            </button>
            <button
              onClick={onViewRecords}
              className={`hover:${isDarkTheme ? "text-blue-400" : "text-blue-600"} cursor-pointer transition-colors duration-200 relative group`}
            >
              View Records
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDarkTheme ? "bg-blue-400" : "bg-blue-600"} transition-all duration-200 group-hover:w-full`}
              ></span>
            </button>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            className={`material-icons transition-all duration-200 hover:scale-110 ${isDarkTheme ? "hover:text-yellow-400" : "hover:text-orange-500"}`}
            onClick={() => setIsDarkTheme(!isDarkTheme)}
          >
            {isDarkTheme ? "brightness_4" : "brightness_2"}
          </button>

          <div className="flex items-center">
            <span className="text-sm mr-2">Minimal</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  className="sr-only"
                  type="checkbox"
                  checked={isMinimalView}
                  onChange={(e) => setIsMinimalView(e.target.checked)}
                />
                <div
                  className={`block ${isDarkTheme ? "bg-gray-600" : "bg-gray-300"} w-10 h-6 rounded-full transition-colors duration-200`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 shadow-md ${
                    isMinimalView ? "translate-x-4 bg-blue-500" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </nav>
    </header>
  )
}
