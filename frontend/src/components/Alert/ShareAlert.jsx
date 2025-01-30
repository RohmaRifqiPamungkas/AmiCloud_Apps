import { FaClipboard, FaShareAlt, FaWhatsapp } from "react-icons/fa";

function ShareAlert({ link, onCopy, onShare }) {
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

export default ShareAlert