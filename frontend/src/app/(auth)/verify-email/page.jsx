

'use client';

import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import {useRouter} from "next/navigation";



export default function VerificationPage() {
  const router = useRouter();
  const { logout, resendEmailVerification } = useAuth();

  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleResendEmail = async () => {
    setIsLoading(true); 
    try {
      await resendEmailVerification({ setStatus });
    } catch (error) {
      console.error("Failed to resend email verification:", error);
    } finally {
      setIsLoading(false); 
    }
  };


  return (
    <>
    <div >
    <p className="mt-4 text-foreground text-left md:text-xl">
    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
      </p>

      {status && (
        <p className="mt-4 text-green-600 text-justify">{status}</p>
      )}

      <div className="mt-6 flex justify-center">
      <button
            onClick={handleResendEmail}
            disabled={isLoading} 
            className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
          >
            {isLoading ? 'Resend Verification Email' : 'Resend Verification Email'} 
          </button>
      </div>

      <p className="mt-6 text-center text-sm md:text-base text-gray-500">
      Not using your account anymore?&nbsp;
        <button onClick={logout} className="text-blue-500 underline hover:underline">
          Log Out
        </button>
      </p>
    </div>     
      </>
  );
}