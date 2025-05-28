import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <div className='bg-[#f7f7f7]'>
      {children}
    </div>
  )
}
