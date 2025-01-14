import { FaClipboard, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";


export default function AlertShare({ link }) {
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
        },
      });
    }).catch((err) => {
      console.error("Gagal menyalin link:", err);
    });
  };

  const handleShare = async () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <FaWhatsapp size={180} className="text-green-500" />
      <h2 className="text-xl font-bold text-gray-700">Share Your File</h2>
      <p className="text-gray-500">Copy your file link or share it via WhatsApp.</p>

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
