import React from 'react'
import { useApp } from '../../context/useApp'

const Features :React.FC = () => {
        const {setActiveView,setSelectedNoteId}=useApp()

  return (
    
       <div className='flex flex-col w-80 h-39 gap-4 '>
                <p className='text-(--text-secondary) text-[17px] font-semibold' style={{ fontFamily: "var(--font-primary)" }}>More</p>

                <div className='flex w-80 h-39 gap-4 hover:bg-[#FFFFFF1A] items-center p-1 rounded-[3px]' onClick={()=>{setActiveView("favorites");setSelectedNoteId(null)}} >
                    <img className='w-5 h-6' src="src/assets/favrouite.svg" alt="favorites" />
                    <p className='text-(--text-secondary) text-[18px] font-semibold hover:text-white cursor-pointer' style={{ fontFamily: "var(--font-primary)" }}>Favorites</p>
                </div>

                <div className='flex w-80 h-39 gap-4 hover:bg-[#FFFFFF1A] p-1 rounded-[3px]'>
                    <img className='w-5 h-7' src="src/assets/trash.svg" alt="trash" />
                    <p className='text-(--text-secondary) font-semibold hover:text-white text-[18px] cursor-pointer' style={{ fontFamily: "var(--font-primary)" }}>Trash</p>
                </div>

                <div className='flex w-80 h-39 gap-4 hover:bg-[#FFFFFF1A] p-1 rounded-[3px]' onClick={()=>{setActiveView("archived")}}>
                    <img className='w-5 h-7' src="src/assets/archive.svg" alt="archive" />
                    <p className='text-(--text-secondary) font-semibold hover:text-white cursor-pointer text-[18px]' style={{ fontFamily: "var(--font-primary)" }}>Archived Notes</p>
                </div>
            </div>
  )
}

export default Features
