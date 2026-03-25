import React from 'react'

const Features :React.FC = () => {
  return (
    
       <div className='flex flex-col w-80 h-39 gap-4 '>
                <p className='text-(--text-secondary) text-[16px] font-semibold' style={{ fontFamily: "var(--font-primary)" }}>More</p>

                <div className='flex w-80 h-39 gap-4 '>
                    <img className='w-5 h-5' src="src/assets/favrouite.svg" alt="favorites" />
                    <p className='text-(--text-secondary) font-semibold' style={{ fontFamily: "var(--font-primary)" }}>Favorites</p>
                </div>

                <div className='flex w-80 h-39 gap-4 '>
                    <img className='w-5 h-5' src="src/assets/trash.svg" alt="trash" />
                    <p className='text-(--text-secondary) font-semibold' style={{ fontFamily: "var(--font-primary)" }}>Trash</p>
                </div>

                <div className='flex w-80 h-39 gap-4 '>
                    <img className='w-5 h-5' src="src/assets/archive.svg" alt="archive" />
                    <p className='text-(--text-secondary) font-semibold' style={{ fontFamily: "var(--font-primary)" }}>Archived Notes</p>
                </div>
            </div>
  )
}

export default Features
