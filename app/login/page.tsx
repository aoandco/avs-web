"use client"
import React from 'react'
import AuthComp from '../components/AuthComp'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'

interface lofinFormInput {
    email: string;
    password: string;
}

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login/client`

export default function Page() {
    const { register, handleSubmit, formState: { errors } } = useForm<lofinFormInput>();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<lofinFormInput> = (data) => {
        setIsLoading(true);
        axios.post(endpoint,{
            ...data
        })
        .then((response)=>{
            console.log(response.data)
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("user", JSON.stringify(response.data.data));
            router.push("/dashboard");
        })
        .catch((error)=>{
            toast.error(error.response ? error.response.data.message : "An error occurred during login");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

  return (
    <div className='h-screen flex flex-row'>
        <Toaster />
        <AuthComp />
        <div className='relative leading-none flex-1 lg:flex-[2] xl:flex-[3] pb-6 lg:pb-10 px-4 md:px-6 lg:px-10 xl:px-14 pt-6'>
            <p className='text-end text-base font-semibold pb-3'>Don&apos;t have an account? <Link href="/signup" className='text-[#213bff]'>Sign Up</Link></p> 
            <hr className='border-t-2'></hr>
            <div className='px-4 md:px-6 lg:px-10 xl:px-14 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-full'>
                <h2 className='leading-none text-2xl font-semibold mb-4'>Welcome Back</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className=' mb-2 block text-sm font-semibold' htmlFor="email">Email address</label>
                    <input 
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
                    {errors.email?.message == "Invalid email address" && (
                        <p className='text-red-500 text-sm mb-3'>{errors.email.message}</p>
                    )}
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="password">Password</label>
                            <div className="relative mb-3 w-full">
                                <input
                                    {...register("password", { 
                                        required: "Password is required", 
                                    })}
                                    id="password" 
                                    className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.password ?"border-red-500": "border-black" } w-full`}
                                    type={ showPassword ? "text" : "password"} 
                                    name="password" 
                                />
                                <EyeOff
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={`${!showPassword ? "cursor-pointer absolute top-[50%] right-2 -translate-y-[50%]" : "hidden"}`} 
                                />
                                <Eye
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={`${!showPassword ? "hidden" : "cursor-pointer absolute top-[50%] right-2 -translate-y-[50%]"}`}  
                                />
                            </div>                         
                        </div>
                    </div>
                    <div className='mb-8'>
                        <a href='/forgot-password'>Forgot password?</a>
                    </div>

                    <div className='flex justify-center items-center'>
                        <button
                            disabled={isLoading}
                            className={`py-3 px-14 rounded-md text-white font-medium transition-all duration-300 transform ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                    : 'bg-[#485d3a] hover:bg-[#3a4a2e] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                            }`}
                        >   {
                            isLoading ? "Loading..." : "Sign In"
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
