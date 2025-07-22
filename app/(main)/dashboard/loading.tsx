import React from 'react'

export default function loading() {
  return (
    <div className="flex-1 min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#485d3a]">
      </div>
    </div>
  )
}
