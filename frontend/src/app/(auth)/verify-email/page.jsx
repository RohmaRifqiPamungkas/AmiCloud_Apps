
// "use client";

// import { useAuth } from "@/hooks/auth";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const VerifyEmail = () => {
//   const { user, resendEmailVerification, logout } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect jika email sudah diverifikasi
//     if (user?.email_verified_at) {
//       router.push("/dashboard");
//     }
//   }, [user, router]);

//   const handleResendVerification = async () => {
//     try {
//       await resendEmailVerification();
//       alert("Verification email has been resent!");
//     } catch (error) {
//       console.error("Error resending email verification:", error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//         <p className="mb-4 text-gray-600 text-justify">
//           Thanks for signing up! Before getting started, could you verify your
//           email address by clicking on the link we just emailed to you? If you
//           didn't receive the email, we will gladly send you another.
//         </p>

//         <div>
//           <button
//             onClick={handleResendVerification}
//             className="bg-primary hover:bg-blue-500 px-5 py-2 text-white rounded-md w-full"
//           >
//             Resend Verification Email
//           </button>
//         </div>

//         <div className="text-center flex items-center justify-center">
//           <button
//             onClick={logout}
//             className="mt-4 underline text-sm text-gray-600 hover:text-gray-900"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;

'use client';

import React from "react";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";


export default function VerificationPage() {
  const { resendEmailVerification } = useAuth();
  const [status, setStatus] = useState(null);

  const handleResendEmail = async () => {
    try {
      await resendEmailVerification({ setStatus });
    } catch (error) {
      console.error("Failed to resend email verification:", error);
    }
  };

  return (
    <>
    <div >
    <p className="mt-4 text-foreground text-left md:text-xl">
        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
      </p>

      {status && (
        <p className="mt-4 text-green-600 text-center">{status}</p>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleResendEmail}
          className="bg-secondary text-foreground font-semibold py-2 px-4 rounded md:rounded-2xl hover:bg-secondary w-full"
        >
          Resend Verification Email
        </button>
      </div>

      <p className="mt-6 text-center text-sm md:text-base text-gray-500">
        Not using your account anymore?{' '}
        <a href="/logout" className="text-blue-500 underline hover:underline">
          Log Out
        </a>
      </p>
    </div>     
      </>
  );
}