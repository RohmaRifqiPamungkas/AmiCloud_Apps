import { FaClipboard, FaShareAlt, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2"; 
import Image from "next/image";
import success from "../../../public/Alert/success.png"

export default function AlertSuccess({ link }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        title: 'Link berhasil disalin!',
        showConfirmButton: false,
        timer: 1500,
        width: '250px', 
        padding: '10px', 
        customClass: {
          popup: 'smaller-popup', 
        }
      });
    }).catch(err => {
      console.error("Gagal menyalin link:", err);
    });
  };

  const handleShare = async () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">    
         <Image src={success} alt="success" width={180} height={180} className="w-[180px] h-[180px]" />    
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
          onClick={handleCopy}
          className="text-gray-500 hover:text-black p-2 rounded-full"
        >
          <FaClipboard size={20} />
        </button>
        <button
          onClick={handleShare}
          className="text-gray-500 hover:text-black p-2 rounded-full"
        >
          <FaShareAlt size={20} />
        </button>
      </div>
    </div>
  );
}
