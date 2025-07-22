"use client"
import Link from 'next/link';
import React, { useState } from 'react'
import logo from '../assests/logo.png'
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isMenuOpen,setIsMenuOpen] = useState(false)
    const [isClicked,setIsClicked] = useState(false)
    const pathname = usePathname()

    return (
    <header className='relative w-full left-0 top-0 bg-white flex justify-between items-center px-[5%] h-[60px] gap-6'>
      <div>
        <Link href='/'>
          <Image 
            src={logo} 
            alt='bayog logo' 
            height={60}
            className='cursor-pointer'
          />
        </Link>
      </div>
        <ul className='hidden sm:flex sm:w-[50%] md:w-[45%] lg:w-[30%] justify-between items-center'>
            <li 
              className={`relative h-[28px] pb-1.5 cursor-pointer text-[#0f170a] ${pathname == "/" ? "border-b-2 border-b-[#485d3a]" : "test-link"} text-base font-medium whitespace-nowrap`}
            >
              <Link  href="/">Home</Link>
            </li>
            <li  
              className={`relative  ${pathname == "/howitworks" ? "border-b-2 border-b-[#485d3a]" : "test-link"} h-[28px] pb-1.5 cursor-pointer text-[#0f170a] text-base font-medium whitespace-nowrap`}
            >
              <Link href="/howitworks">How it Works</Link>
            </li>
            <li className={`relative  ${pathname == "/admin" ? "border-b-2 border-b-[#485d3a]" : "test-link"} h-[28px] pb-1.5 cursor-pointer ext-[#0f170a] text-base font-medium whitespace-nowrap`}>
                <Link href="/admin">Admin</Link>
            </li>
            <li className={`relative ${pathname == "/aboutus" ? "border-b-2 border-b-[#485d3a]" : "test-link"} h-[28px] pb-1.5 cursor-pointer text-[#0f170a] text-base font-medium whitespace-nowrap`}>
                <Link href="/aboutus">About Us</Link>
            </li>
        </ul>
        <div className='hidden sm:flex items-center'>
            <button>
                <Link
                  className='translate-x-2 w-[90px] md:w-[98px] h-[36px] flex justify-center items-center text-[#0f170a] text-base font-medium hover:border hover:border-r-0 hover:border-[#485d3a] rounded-tl-lg rounded-bl-lg  transition-all duration-500 ease-linear'
                  href='/login'>Login
                </Link>
            </button>
            <button>
                <Link  
                  className='w-[90px] md:w-[98px] h-[36px] flex justify-center items-center text-white text-base font-medium bg-[#485d3a] rounded-lg hover:bg-white hover:text-[#485d3a] hover:border-2 hover:border-[#485d3a] transition-all duration-500 ease-linear' href="/signup">
                    Sign Up
                </Link>
              </button>
        </div>
      {
        !isMenuOpen
        ? 
        <Menu
            onClick={()=> {setIsMenuOpen(true); setIsClicked(true)}} 
            className='block cursor-pointer sm:hidden text-[#0f170a] text-2xl'
            />
        : <X
            onClick={()=> setIsMenuOpen(false)} 
            className='block cursor-pointer sm:hidden text-[#0f170a] text-2xl'
            />
      }
      <nav className={`px-[5%] py-2 ${isMenuOpen ?  "block active sm:hidden" : !isMenuOpen && isClicked ? "block sm:hidden inactive" : "hidden"} absolute z-30 left-0 top-full bg-white w-full`}>
        <ul className='text-[#0f170a]'>
            <Link onClick={() =>{setIsMenuOpen(false)}} href='/'>
              <li className='py-2 text-center cursor-pointer text-sm border-b border-b-[#485d3a]'>
                Home
              </li>
            </Link>
            <Link onClick={() =>{setIsMenuOpen(false)}} href="/howitworks">
            <li className='py-2 text-center cursor-pointer text-sm border-b border-b-[#485d3a]'>
              How It Works
            </li>
            </Link>
            <Link onClick={() =>{setIsMenuOpen(false)}} href="/admin">
              <li className='py-2 text-center cursor-pointer text-sm border-b border-b-[#485d3a]'>
                Admin
              </li>
            </Link>
            <Link onClick={() =>{setIsMenuOpen(false)}} href="/aboutus">
              <li className='py-2 text-center cursor-pointer text-sm border-b border-b-[#485d3a]'>
                About Us
              </li>
            </Link>
        </ul>
        <div className='mt-8 flex flex-col'>
            <Link href="/signup">
              <button className='text-white py-2 cursor-pointer bg-[#485d3a] rounded-lg w-full'>Sign Up</button>
            </Link>
            <Link href='/login'>
              <button className='py-2 cursor-pointer w-full'>Log In</button>
            </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
