// "use client";

// import { useAuth } from "@/hooks/auth";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// const VerifyEmail = () => {
//   const { resendEmailVerification, logout } = useAuth({
//     middleware: "auth",
//     redirectIfAuthenticated: "/dashboard",
//   });

//   const [status, setStatus] = useState(null);
//   const { handleSubmit, formState: { isSubmitting } } = useForm();

//   // Resend email verification
//   const handleResendVerification = async () => {
//     await resendEmailVerification({ setStatus });
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//          <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
//         </div>
//         <div className="mb-4 text-sm text-gray-600">
//           Thanks for signing up! Please verify your email by clicking the link
//           sent to your inbox. If you didn’t receive the email, click resend.
//         </div>

//         {status === "verification-link-sent" && (
//           <div className="mb-4 font-medium text-sm text-green-600">
//             A new verification link has been sent to your email.
//           </div>
//         )}

//         <form onSubmit={handleSubmit(handleResendVerification)}>
//           <div className="mt-4 flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-primary hover:bg-blue-500 px-5 py-2 text-white rounded-md"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Resending..." : "Resend Verification Email"}
//             </button>

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="underline text-sm text-gray-600 hover:text-gray-900"
//             >
//               Logout
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;

"use client";

import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VerifyEmail = () => {
  const { user, resendEmailVerification, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect jika email sudah diverifikasi
    if (user?.email_verified_at) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    try {
      await resendEmailVerification();
      alert("Verification email has been resent!");
    } catch (error) {
      console.error("Error resending email verification:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <p className="mb-4 text-gray-600 text-justify">
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didn't receive the email, we will gladly send you another.
        </p>

        <div>
          <button
            onClick={handleResendVerification}
            className="bg-primary hover:bg-blue-500 px-5 py-2 text-white rounded-md w-full"
          >
            Resend Verification Email
          </button>
        </div>

        <div className="text-center flex items-center justify-center">
          <button
            onClick={logout}
            className="mt-4 underline text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
