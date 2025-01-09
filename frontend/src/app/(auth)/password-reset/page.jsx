'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth";
import { useParams } from "next/navigation";  

const ResetPassword = () => {
  const { resetPassword } = useAuth({middleware: 'auth', redirestIfAuthenticated: '/Dashboard'}); 
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { token } = useParams();  

  const [status, setStatus] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const onSubmit = async (data) => {
    setErrorMessages([]);
    setStatus(null);

    try {
      await resetPassword({
        token,  
        setErrors: setErrorMessages,
        setStatus,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {status && (
        <p className="text-center text-green-600 font-medium">
          {status === "Your password has been reset." ? "Your password has been reset" : status}
        </p>
      )}
      {errorMessages.length > 0 && (
        <div className="text-center text-red-600 font-medium space-y-2">
          {errorMessages.map((error, index) => (
            <p key={index}>
              {error === "This password reset token is invalid." ? error : "An error occurred."}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* Email  */}
        <div>
          <label htmlFor="email" className="block font-medium md:text-2xl text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`mt-1 w-full px-5 py-3 rounded-2xl focus:outline-none bg-tertiary-25 ${
              errors.email ? "border-red-500" : "border-primary"
            }`}
            {...register("email", {
              required: "E-mail is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              }, })}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password  */}
        <div>
          <label htmlFor="password" className="block font-medium text-base md:text-2xl text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`mt-1 w-full px-5 py-3 rounded-2xl focus:outline-none bg-tertiary-25 ${
              errors.password ? "border-red-500" : "border-primary"
            }`}
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your new password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password  */}
        <div>
          <label htmlFor="confirmPassword" className="block font-medium text-base md:text-2xl text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`mt-1 w-full px-5 py-3 rounded-2xl focus:outline-none bg-tertiary-25 ${
              errors.confirmPassword ? "border-red-500" : "border-primary"
            }`}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm your new password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="mt-1 w-full px-4 py-2 bg-secondary text-foreground rounded-2xl text-base md:text-regular hover:bg-primary hover:text-white"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
