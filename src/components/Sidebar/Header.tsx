import { Plus } from 'lucide-react'
import React from 'react'

const Header: React.FC = () => {
  return (
    <>
    {/* logo+searchbar */}
      <div className='flex justify-between items-center h-13 w-80 pr-5 pl-5 '>
        <img src="src/assets/logo.svg" alt="logo" className='w-25.25 h-15.5' />
        <img src="src/assets/search.svg" alt="search" className='w-6 h-7' />
      </div>

      {/* add new note */}
      <div className=' flex justify-center items-center h-13 w-80 pr-5 pl-5 font-semibold ' style={{ fontFamily: "var(--font-primary)" }}>
        <button className=' flex justify-center items-center gap-3 w-65 h-10  bg-(--btn-bg) text-(--text-primary)  '><Plus className='h-5 w-5'/> New Note</button>
      </div>
    </>

  )
}

export default Header
