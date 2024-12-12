
import { FaEnvelope } from "react-icons/fa";

export default function PasswordResetForm() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        </div>
        <h2 className="text-lg text-center font-semibold mb-2">Forgot your password? No problem.</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
        </p>
        <form>
          <div className="flex items-center border border-gray-300 rounded-lg mb-4 overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full py-2 px-3 text-gray-700 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Email Password Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
