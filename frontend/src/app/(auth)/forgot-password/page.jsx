"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from '@/hooks/auth';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword } = useAuth({middleware: 'guest', redirestIfAuthenticated: '/Dashboard'});
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isClient, setIsClient] = useState(false); 



  useEffect(() => {
    setIsClient(true); 
  }, []);


  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    setStatus(null);
    setErrorMessage(null);

    try {
      await forgotPassword({
        email: data.email,
        setErrors: (serverErrors) => {
          if (Array.isArray(serverErrors) && serverErrors.length > 0) {
            setError("email", { type: "server", message: serverErrors[0] });
            setErrorMessage(serverErrors[0]); 
          }
        },
        setStatus: (statusMessage) => {
          setStatus(statusMessage); 
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };



  if (!isClient) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mt-4 text-gray-700 text-left md:text-xl">
        Forgot your password? No problem. Just let us know your email
        address, and we will email you a password reset link that will allow
        you to choose a new one.
      </p>

      <div>
  {errorMessage ? (
    <p className="mt-4 text-red-600 text-left">{errorMessage}</p>
  ) : status ? (
    <p className="mt-4 text-green-600 text-left">{status}</p>
  ) : null}
</div>


      <div className="mt-6">
        <label
          htmlFor="email"
          className="block text-sm md:text-2xl font-medium text-gray-700"
        >
          Email*
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          className={`mt-1 block w-full px-5 py-3 rounded-2xl shadow-sm bg-tertiary-25 focus:ring-purple-500 focus:border-purple-500 ${errors.email ? "border-red-500" : "border-primary"}`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="bg-secondary text-foreground font-semibold py-3 px-4 rounded-2xl hover:bg-primary hover:text-white w-full"
        >
          Email Password Reset Link
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
