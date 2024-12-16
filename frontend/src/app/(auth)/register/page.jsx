

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth";

const Register = () => {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    await registerUser({
      ...data,
      setErrors,
      setStatus,
    });
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="p-8 bg-white rounded-md shadow-md w-96">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.length > 0 && (
            <div className="text-red-600 text-sm">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          {status && <div className="text-green-600 text-sm">{status}</div>}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              {...register("remember")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to the{" "}
              <span className="text-blue-600">Term of Use</span> and{" "}
              <span className="text-blue-600">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
