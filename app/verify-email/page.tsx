"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function Page() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    console.log(token)

    const endpoint = `https://bayog-production.up.railway.app/v1/auth/verify-email-from-link?token=${token}`;
    
    const verifyEmail = async () => {
        try {
            const response = await axios.post(endpoint);
            console.log(response.data);
            if(response.status == 200){
                router.push('/login');
            }
        } catch (error) {
            console.error("Error verifying email:", error);
        }
    }

    React.useEffect(() => {
        verifyEmail();
    }, [token]);

  return (
    <main className='relative min-h-screen px-4 md:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto'>
        <img
            src="/logo.png"
            alt="Bayog Logo"
            className='w-[125px]'
        />
        <div className='border border-[#9dc782] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center gap-3 p-4 sm:p-8 md:p-10 lg:p-14'>
            <img 
                src="/verification-image.svg"
                alt="Verification Image"
                className='aspect-[1/1] object-cover'
            />
            <p className='whitespace-nowrap font-semibold'>Your email is been verified...Pls wait</p>
        </div>

    </main>
  )
}
