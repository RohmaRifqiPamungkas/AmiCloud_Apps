import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo Section */}
        <div>
          <h2 className="font-bold text-lg">Amicloud Logo</h2>
          <p className="text-sm">Quick Respond, Instant Links!</p>
        </div>

     
        <div>
          <h3 className="font-semibold text-base mb-2">Product</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-gray-900">Feature</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">Upload File</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">Respond Link</a>
            </li>
          </ul>
        </div>

             <div>
          <h3 className="font-semibold text-base mb-2">About Us</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-gray-900">About</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">FAQ</a>
            </li>
          </ul>
        </div>

       
        <div>
          <h3 className="font-semibold text-base mb-2">Contact Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />
      <div className="text-center py-4 text-sm">
        Copyright © 2024 Amicloud. All Rights Reserved
      </div>
    </footer>
  );
}