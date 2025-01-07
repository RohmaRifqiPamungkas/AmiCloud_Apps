"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 

const Register = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [serverErrors, setServerErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const router = useRouter(); 


  const onSubmit = async (data) => {  
    await registerUser({
      ...data,
      setErrors: setServerErrors, 
      setStatus, 
      successCallback: () => {
   
        router.push("/verify-email");
      },
    });
  };

  return (
    <div>
   
        {serverErrors.length > 0 && (
          <div className="text-red-600 text-sm mb-4">
            {serverErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

     
        {status && <div className="text-green-600 text-sm mb-4">{status}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">    
          <div>
            <label
              htmlFor="name"
              className="block text-sm md:text-2xl font-medium text-gray-700 mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25" placeholder="Enter your Name"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

                 <div>
            <label
              htmlFor="email"
              className="block text-sm md:text-2xl font-medium text-gray-700 mb-2"

            >
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "E-mail is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25" placeholder="Enter your E-mail"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm md:text-2xl font-medium text-gray-700 mb-2"
             
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25" 
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm md:text-2xl font-medium text-gray-700 mb-2"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              {...register("confirmPassword", {
                required: "Password confirmation is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-secondary text-reguler text-black font-bold rounded-2xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-700 underline">
            Sign in
          </Link>
        </div>
      </div>

  );
};

export default Register;
