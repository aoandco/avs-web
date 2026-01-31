"use client"
import React from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';


interface signupObj {
    fullName: string;
    email: string;
    securityQuestion: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
}

const enpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/signup/admin`

export default function Page() {
    const {register, handleSubmit, formState: { errors },watch} = useForm<signupObj>({
        defaultValues: {
            fullName: '',
            email: '',
            securityQuestion: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false
        }
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isLoading,setIsLoading] = React.useState(false);
    const password = watch("password");
    
     const onSubmit: SubmitHandler<signupObj> = data => {
        console.log(data);
        setIsLoading(true);
        axios.post(enpoint,{
            fullName: data.fullName,
            email: data.email,
            securityQuestion: data.securityQuestion,
            phoneNumber: data.phoneNumber,
            password: data.password
        })
            .then((response) => {
                toast.success(response.data.message)

            })
            .catch((error) => {
                toast.error(error.response ? error.response.data.message : "An error occurred during signup");
            })
            .finally(()=>{
                setIsLoading(false);
            })
    }  

  return (
        <div className='leading-none flex-1 md:flex-[1.5] lg:flex-[2] xl:flex-[3] pr-4 md:pr-6 lg:pr-8 xl:pr-10 pb-6 lg:pb-8 xl:pb-10 pl-4 md:pl-6 lg:pl-10 xl:pl-14 pt-6'>
           <Toaster />
           <p className='text-end text-base font-semibold pb-3'>Already have an account? <Link href="/admin/login" className='text-[#213bff]'>Sign In</Link></p> 
            <hr className='border-t-2'></hr>
            <div className="py-4 lg:py-6 px-0 lg:px-10 xl:px-14">
                <h2 className='leading-none text-2xl font-semibold mb-4'>Let&apos;s get Started</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className=' mb-2 block text-sm font-semibold' htmlFor="fullName">Full name of Admin</label>
                    <input
                        {...register("fullName", { required: "Full name is required" })}
                        className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.fullName ?"border-red-500": "border-black" } w-full`}
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                    />
                    <label
                        htmlFor="email" className='mb-2 block text-sm font-semibold'>Email address</label>
                   <input 
                        {...register("email", 
                            { required: true,
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
                    <div className='flex flex-row gap-8'>
                        <div className='flex-1'>
                            <label  className='mb-2 block text-sm font-semibold' htmlFor="securityQuestion">Security Question</label>
                            <input 
                                {...register("securityQuestion", { required: "Security question is required" })}
                                className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.securityQuestion ?"border-red-500": "border-black" } w-full`}
                                type="text" 
                                name="securityQuestion" 
                                id="securityQuestion" 
                            />
                        </div>
                        <div className='flex-1'>
                            <label className='mb-2 block text-sm font-semibold' htmlFor="phoneNumber">Phone Number</label>
                            <input 
                                {...register("phoneNumber", 
                                    { required: "Phone number is required",
                                    pattern: {
                                        value: /^\d{11}$/,
                                        message: "Phone number must be 10 digits"
                                        }
                                    })}
                                className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.phoneNumber ?"border-red-500": "border-black" } w-full`}
                                type="text" 
                                name="phoneNumber" 
                                id="phoneNumber" 
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
                                    className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.password ?"border-red-500": "border-black" } h-full w-full`} 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                />
                                <EyeOff 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className={`${!showPassword ? "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer" : "hidden"}`}     
                                />
                                <Eye 
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
                                        required: "Confirm password is required",
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                    className={`mb-3 px-2 py-2 md:py-3 block rounded-md border ${errors.confirmPassword ?"border-red-500": "border-black" } w-full`}
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                />
                                <EyeOff
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className={`${!showConfirmPassword ? "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer" : "hidden"}`} 
                                />
                                <Eye
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className={`${!showConfirmPassword ? "hidden" : "cursor-pointer absolute top-[50%] right-2 -translate-y-[50%]"}`}  
                                />
                            </div> 
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-center mb-6'>
                        <input
                            {...register("termsAccepted", { 
                                required: "You must accept the terms and conditions" 
                            })}
                            className='h-4 w-4' 
                            type="checkbox" 
                            name="termsAccepted" 
                            id="termsAccepted" 
                        />
                        <label className="text-sm font-semibold" htmlFor="">Agree to the <Link className='text-[#213bff]' href="">terms</Link> and <Link className='text-[#213bff]' href="">conditions</Link></label>
                    </div>
                    {errors.termsAccepted && (
                        <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
                    )}
                    <div className='flex justify-center items-center'>
                        <button 
                            disabled={isLoading}
                            className={`h-[40px] w-[215px] rounded-md text-white font-medium transition-all duration-300 transform ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                    : 'bg-[#485d3a] hover:bg-[#3a4a2e] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                            }`}
                        >
                            {
                                isLoading ? "Loading..." : "Get Started"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
  )
}
