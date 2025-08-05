import React from 'react'

const Copyright = () => {
  return (
    <div className="w-full text-center text-xs sm:text-sm mt-4 bg-gray-600 border-gray-700 py-3 sm:py-4 px-2 sm:px-4 text-white">
        <p className="leading-relaxed">
          <span className="block sm:inline">&copy; {new Date().getFullYear()} Paragon. All rights reserved.</span>
          <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">| Crafted By Tech Knight</span>
        </p>
      </div>
  )
}

export default Copyright
