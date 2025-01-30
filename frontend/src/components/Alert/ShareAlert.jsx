
import { FaClipboard, FaWhatsapp } from "react-icons/fa";

function ShareAlert({ link, onCopy, onShare }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Share Your File</h2>
      
      {/* Icon WhatsApp with onClick for sharing */}
      <button
        onClick={onShare}
        className="flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        title="Share via WhatsApp"
      >
        <FaWhatsapp size={40} />
      </button>

      {/* Divider with OR */}
      <div className="flex items-center w-full max-w-sm space-x-4">
        <hr className="flex-grow border-t border-gray-300" />
        <p className="text-gray-500 font-medium">OR</p>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <h4 className="text-sm text-gray-500">Copy your file link</h4>

      {/* Link Section */}
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between space-x-4 w-full">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 font-medium text-sm truncate flex-grow"
        >
          {link}
        </a>
        {/* Copy Button */}
        <button
          onClick={onCopy}
          className="text-gray-500 hover:text-gray-700 p-2"
          title="Copy Link"
        >
          <FaClipboard size={20} />
        </button>
      </div>
    </div>
  );
}

export default ShareAlert;
