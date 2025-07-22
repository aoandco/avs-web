import { X } from 'lucide-react'
import React from 'react'

type modalPropsType = {
    isClose: () => void,
    complainObjInfo: {
        subject: string,
        message: string,
    }
}

export default function ViewComplainModal({isClose, complainObjInfo: {subject, message} }:modalPropsType) {
  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full z-10">
      <div onClick={isClose} className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
      <div className="relative z-20 bg-white rounded-xl pt-6 px-6 pb-8 max-w-xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <button
          onClick={isClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        //   title="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Complaint Details</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-900 font-semibold">{subject}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-800 whitespace-pre-line">{message}</div>
        </div>
      </div>
    </div>
  )
}
