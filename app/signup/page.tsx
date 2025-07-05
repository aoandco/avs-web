"use client"
import React from 'react'
import AuthComp from '../components/AuthComp'
import Link from 'next/link'
import { PiEyeLight,PiEyeSlashLight } from "react-icons/pi";
import {useForm, SubmitHandler} from 'react-hook-form';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
interface signupObj{
    companyName: string;
    email: string;
    uploaderName: string;
    uploaderPhone: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
}

const endpoint = 'https://bayog-production.up.railway.app/v1/auth/signup/client/web'

export default function page() {
    const {register, handleSubmit, formState: {errors}, watch} = useForm<signupObj>();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const password = watch("password");
    
    const onSubmit: SubmitHandler<signupObj> = data => {
            // console.log(data);
            setIsLoading(true);
            axios.post(endpoint, {
                companyName: data.companyName,
                email: data.email,
                uploaderName: data.uploaderName,
                uploaderPhone: data.uploaderPhone,
                password: data.password,
            })
            .then(response => {
                toast.success(response.data.message);
                })
                .catch(error => {
                    toast.error(error.response ? error.response.data.message : "An error occurred during signup");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
  return (
    <div className='min-h-screen flex flex-row'>
        <Toaster />
        <AuthComp />
        <div className='leading-none flex-1 md:flex-[1.5] lg:flex-[2] xl:flex-[3] pr-4 md:pr-6 lg:pr-8 xl:pr-10 pb-6 lg:pb-8 xl:pb-10 pl-4 md:pl-6 lg:pl-10 xl:pl-14 pt-6'>
           <p className='text-end text-base font-semibold pb-3'>Already have an account? <Link href="/login" className='text-[#213bff]'>Sign In</Link></p> 
            <hr className='border-t-2'></hr>
            <div className="py-4 lg:py-6 px-0 lg:px-10 xl:px-14">
                <h2 className='leading-none text-2xl font-semibold mb-4'>Let&apos;s get Started</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="companyName" className=' mb-2 block text-sm font-semibold'>Name of company</label>
                    <input 
                        {...register("companyName", { required: "Company Name is required" })}
                        className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.companyName ?"border-red-500": "border-black" } w-full`} 
                        type="text" 
                        name="companyName" 
                        id="" 
                    />
                    <label htmlFor="email" className='mb-2 block text-sm font-semibold'>Email address</label>
                    <input
                        {...register("email", 
                            { required: true,
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                            })}
                        className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.email ?"border-red-500": "border-black" } w-full`}  
                        type="email" 
                        name="email" 
                        id="" 
                    />
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label htmlFor="uploaderName" className='mb-2 block text-sm font-semibold'>Uploader&apos;s Name</label>
                            <input 
                                {...register("uploaderName", { required: true })}
                                className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.uploaderName ?"border-red-500": "border-black" } w-full`} 
                                type="text" 
                                name="uploaderName"
                                id="" 
                            />
                        </div>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="uploaderPhone">Uploader&apos;s Phone Number</label>
                            <input  
                                {...register("uploaderPhone", { required: true })}
                                className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.uploaderPhone ?"border-red-500": "border-black" } w-full`} 
                                type="text" 
                                name="uploaderPhone" 
                                id="" 
                            />
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="password">Password</label>
                            <div className="relative mb-3 w-full">
                                <input
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters long"
                                        }
                                    })} 
                                    className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.password ?"border-red-500": "border-black" } w-full`}  
                                    type={showPassword ? "text" :"password"} 
                                    name="password" 
                                    id="" 
                                />
                                <PiEyeSlashLight
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={`${!showPassword ? "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer" : "hidden"}`} 
                                />
                                <PiEyeLight
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={`${!showPassword ? "hidden" : "cursor-pointer absolute top-[50%] right-2 -translate-y-[50%]"}`}  
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
                            )}                         
                        </div>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative mb-3 w-full">
                                <input 
                                    {...register("confirmPassword", { 
                                        required: "Please confirm your password",
                                        validate: (value) => 
                                            value === password || "Passwords do not match"
                                    })} 
                                    className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.confirmPassword ?"border-red-500": "border-black" } w-full`} 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    id="" 
                                />
                                <PiEyeSlashLight
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className={`${!showConfirmPassword ? "absolute top-[50%] right-2 -translate-y-[50%]" : "hidden"}`} 
                                />
                                <PiEyeLight
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className={`${!showConfirmPassword ? "hidden" : "absolute top-[50%] right-2 -translate-y-[50%]"}`}  
                                />    
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>
                            )} 
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-start'>
                        <input 
                            {...register("termsAccepted", { 
                                required: "You must accept the terms and conditions" 
                            })}
                            className="h-4 w-4 accent-[#485d3a]"
                            type="checkbox" 
                            name="termsAccepted" 
                            id="termsAccepted" 
                        />
                        <label className="text-sm font-semibold cursor-pointer" htmlFor="termsAccepted">Agree to the <Link className='text-[#213bff]' href="">terms</Link> and <Link className='text-[#213bff]' href="">conditions</Link></label>
                    </div>
                    {errors.termsAccepted && (
                        <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
                    )}
                    <div className='flex justify-center items-center mt-6'>
                        <button disabled={isLoading} className='h-[40px] w-[215px] rounded-md bg-[#485d3a] text-white hover:opacity-80 cursor-pointer'>
                           {
                            isLoading ? 
                            "Loading..." 
                            : "Get Started"
                           }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
