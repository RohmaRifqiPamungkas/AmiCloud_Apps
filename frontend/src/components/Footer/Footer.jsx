import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-tertiary-25 text-gray-700">
      <div className="container mx-auto px-6 md:px-20 py-8">
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Logo Section */}
          <div className="md:col-span-5">
            <h2 className="font-bold text-lg text-primary">AmiCloud</h2>
            <p className="text-sm mt-2">
              AmiCloud is designed to help users reupload files to a new server,
              ensuring they remain accessible even if the previous link is
              deleted.
            </p>
          </div>

          {/* Product Section */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-base mb-2">Product</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Upload File
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Reupload Link
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-base mb-2">About Us</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="md:col-span-3">
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
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-foreground my-6" />
        <div className="text-center text-sm text-gray-600">
          Copyright © 2024 AmiCloud. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
