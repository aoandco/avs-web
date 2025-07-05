"use client"
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Separate component that uses useSearchParams
function VerificationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [isVerifying, setIsVerifying] = React.useState(true);
    const [verificationStatus, setVerificationStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
    
    console.log(token)

    const endpoint = `https://bayog-production.up.railway.app/v1/auth/verify-email-from-link?token=${token}`;
    
    const verifyEmail = async () => {
        try {
            setIsVerifying(true);
            const response = await axios.post(endpoint);
            console.log(response.data);
            if(response.status == 200){
                setVerificationStatus('success');
                setTimeout(() => {
                    router.push('/login');
                }, 2000); // Give user time to see success message
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            setVerificationStatus('error');
        } finally {
            setIsVerifying(false);
        }
    }

    React.useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setIsVerifying(false);
        }
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
                <p className={`whitespace-nowrap font-semibold ${
                    verificationStatus === 'success' ? 'text-green-600' : 
                    verificationStatus === 'error' ? 'text-red-600' : 'text-gray-800'
                }`}>
                    {verificationStatus === 'loading' && 'Your email is being verified...Please wait'}
                    {verificationStatus === 'success' && 'Email verified successfully! Redirecting to login...'}
                    {verificationStatus === 'error' && 'Email verification failed. Please try again.'}
                </p>
                {isVerifying && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#485d3a]"></div>
                )}
            </div>
        </main>
    );
}

// Loading fallback component
function VerificationFallback() {
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
                <p className='whitespace-nowrap font-semibold'>Loading verification...</p>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#485d3a]"></div>
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<VerificationFallback />}>
            <VerificationContent />
        </Suspense>
    );
}
