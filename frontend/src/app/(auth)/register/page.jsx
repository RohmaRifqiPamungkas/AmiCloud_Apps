

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";

const Register = () => {
  const { register: registerUser } = useAuth();

  const {
    handleSubmit,
    watch,
    formState: { errors },
    register, reset,
  } = useForm();

  const [serverErrors, setServerErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        setErrors: setServerErrors,
        setStatus,
      });

      if (status) {
        reset();
        console.log("Redirecting to verify email page...");
      }
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);  
    }
  };

  return (
    <div>
      {/* Tampilkan error dari server */}
      {serverErrors.length > 0 && (
        <div className="text-red-600 text-sm mb-4">
          {serverErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {/* Tampilkan status berhasil */}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25"
            placeholder="Enter your Name"
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
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
            {...register("email", {
              required: "E-mail is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25"
            placeholder="Enter your E-mail"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
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
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-tertiary-25"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
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
          className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-secondary text-black hover:bg-primary hover:text-white"
          }`}
          disabled={isLoading}  
        >
          {isLoading ? "Creating Account" : "Create Account"}
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
