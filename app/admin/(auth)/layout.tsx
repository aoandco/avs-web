import AuthComp2 from '@/app/components/AuthComp2'
import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-screen flex flex-row max-w-screen-2xl mx-auto'>
        <AuthComp2/>
        {children}
    </div>
  )
}
