"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";

const Login = () => {
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/Dashboard",
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessages([]);

    try {
      await login({
        ...data,
        setErrors: (errors) => {
          if (errors.length > 0) {
            setErrorMessages(errors);
          }
        },
      });
    } catch (error) {
      setErrorMessages(["Something went wrong. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Session Status */}
        <div>
          {errorMessages.length > 0 && (
            <div className="text-red-500 text-sm">
              {errorMessages.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium md:text-2xl text-gray-700 mb-2"
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
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember_me"
              {...register("remember")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember Me
            </label>
          </div>

          {/* Forgot Password Link */}
          <div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-secondary text-black hover:bg-primary hover:text-white"
          }`}
        >
          {isLoading ? "SIGN IN" : "SIGN IN"}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
