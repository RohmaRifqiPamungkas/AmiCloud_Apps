'use client'

import { useAuth } from '@/hooks/auth';
import { useState } from 'react';
import { FaEnvelope } from "react-icons/fa";


const Page = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = event => {
        event.preventDefault()

        forgotPassword({ email, setErrors, setStatus })
    }

    return (
        <>
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        </div>
            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that
                will allow you to choose a new one.
            </div>
         
            <form onSubmit={submitForm}>
            <span>
              <FaEnvelope/>
            </span>
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

                <div className="flex items-center justify-end mt-4">
                    <button className='bg-primary hover:bg-blue-500 p'>Email Password Reset Link</button>
                </div>
            </form>
            </div>
            </div>
        </>
    )
}

export default Page
