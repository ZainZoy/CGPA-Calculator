"use client"

interface FooterProps {
  isDarkTheme: boolean
}

export function Footer({ isDarkTheme }: FooterProps) {
  return (
    <footer
      className={`${isDarkTheme ? "bg-gray-900/50" : "bg-gray-50/50"} backdrop-blur-sm border-t ${isDarkTheme ? "border-gray-700/50" : "border-gray-200/50"} mt-12`}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Decorative line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

          {/* Main credit */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-lg ${isDarkTheme ? "text-gray-300" : "text-gray-700"}`}>Made by</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                Zain Zoy
              </span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
            <div className="mt-2">
              <a
                href="mailto:271057018@formanite.fccollege.edu.pk"
                className={`text-sm ${isDarkTheme ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"} transition-colors duration-200 hover:underline flex items-center justify-center space-x-1`}
              >
                <span className="material-icons text-sm">email</span>
                <span>271057018@formanite.fccollege.edu.pk</span>
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-px ${isDarkTheme ? "bg-gray-700" : "bg-gray-300"}`}></div>
            <div className="relative">
              <div className={`w-2 h-2 ${isDarkTheme ? "bg-gray-600" : "bg-gray-400"} rounded-full`}></div>
              <div
                className={`absolute inset-0 w-2 h-2 ${isDarkTheme ? "bg-blue-400" : "bg-blue-500"} rounded-full animate-ping opacity-20`}
              ></div>
            </div>
            <div className={`w-8 h-px ${isDarkTheme ? "bg-gray-700" : "bg-gray-300"}`}></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
