import React from 'react'

const Spinner = () => {
  return (
    <div className='flex items-center justify-center p-4 sm:p-6 lg:p-8'>
      <div className='animate-spin w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border-4 border-sky-200 border-t-sky-600 shadow-lg'>
      </div>
    </div>
  )
}

export default Spinner
