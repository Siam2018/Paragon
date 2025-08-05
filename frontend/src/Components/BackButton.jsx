import React from 'react'
import {Link} from 'react-router-dom'
import {BsArrowLeft} from 'react-icons/bs'

const BackButton = ({destination= '/'}) => {
  return (
    <div className='flex'>
      <Link to={destination}
        className='bg-sky-800 hover:bg-sky-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg w-fit transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] group'>
            <BsArrowLeft className='text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-200' />
      </Link>
    </div>
  )
}

export default BackButton
