import Image from "next/image";
import { FaClipboard, FaShareAlt } from "react-icons/fa";
import success from "../../../public/Alert/success.png";

function SuccessAlert({ link, onCopy, onShare }) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Image
        src={success}
        alt="success"
        width={180}
        height={180}
        className="w-[180px] h-[180px]"
      />
      <h2 className="text-xl font-bold text-gray-700">Upload Successful!</h2>
      <p className="text-gray-500">Link has been created.</p>

      <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-between space-x-4 w-full max-w-md">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 underline font-semibold flex-grow text-sm truncate"
        >
          {link}
        </a>
        <button
          onClick={onCopy}
          className="text-gray-500 hover:text-black p-2 rounded-full"
        >
          <FaClipboard size={20} />
        </button>
        <button
          onClick={onShare}
          className="text-gray-500 hover:text-black p-2 rounded-full"
        >
          <FaShareAlt size={20} />
        </button>
      </div>
    </div>
  );
}
export default SuccessAlert;
