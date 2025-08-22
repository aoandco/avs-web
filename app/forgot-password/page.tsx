"use client"
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import {toast,Toaster} from 'react-hot-toast';

type resetFormInput = {
    email: string
}

export default function page() {
    const { register, handleSubmit, formState: { errors } } = useForm<resetFormInput>();
    const [isLoading,setIsLoading] = useState(false)

    const onSubmit: SubmitHandler<resetFormInput> = (data) => {
        const endpoint = 'https://bayog-production.up.railway.app/v1/auth/forgot-password/client/web'
        setIsLoading(true)
        axios.post(endpoint, {
            email: data.email
        })
        .then((response)=>{
            toast.success(response.data.message)
        })
        .catch((error)=>{
            toast.error(error.response.data.messsage || "an error occured")
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }

    return (
    <main className='flex flex-col  min-h-screen px-4 md:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto'>
        <Toaster />
        <Link
            href="/"
        >
        <Image
            src="/logo.png"
            alt="Bayog Logo"
            className='w-[125px]'
            width={125}
            height={50}
        />
        </Link>
        <div className='flex-1 flex justify-center items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-[90%] md:w-1/2 lg:w-1/3'>
                <p className='text-xl font-semibold text-[#485d3a] text-center mb-2'>Reset Password</p>
                <p className='text-center font-light mb-2'>Enter your mail registered with Bayog</p>
                <div className='space-y-3 flex flex-col'>
                    <label htmlFor='email'>Email address</label>
                    <input
                        placeholder="example@gmail.com"
                        {...register("email", { 
                            required: "Email is required", 
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        })}
                        className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.email ?"border-red-500": "border-black" } w-full`}
                        type="text" 
                        name="email" 
                        id="email" 
                    />
                </div>
                <button
                    type='submit'
                    disabled={isLoading}
                    className={`py-3 w-full rounded-md text-white font-medium transition-all duration-300 transform ${
                        isLoading 
                        ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                        : 'bg-[#485d3a] hover:bg-[#3a4a2e] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                     }`}
                >
                    {isLoading ? "Loading..." : 'Continue'}
                </button>
            </form>
        </div>
    </main>
  )
}
