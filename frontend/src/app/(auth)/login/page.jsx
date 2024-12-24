
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth"; 
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth({ middleware: "guest", redirectIfAuthenticated: "/dashboard" });
  const [status, setStatus] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const onSubmit = async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        remember: data.remember, 
        setErrors: setErrorMessages, 
        setStatus: setStatus, 
      });

    } catch (err) {
      console.error("Login failed:", err);
      setStatus("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center pt-12">
     
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Session Status */}
          <div>
            <p className="text-sm text-green-500 mb-4">{status}</p>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail:
            </label>
            <input
              type="email"
              id="email" 
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password" 
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="current-password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember_me" 
              {...register("remember")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
              Remember Me
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            SIGN IN
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <Link
            href="/register"
            className="text-sm text-blue-600 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      
    </div>
  );
};

export default Login;

