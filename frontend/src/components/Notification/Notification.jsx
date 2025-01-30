import { FaRegCircleCheck } from "react-icons/fa6";

function Notification({ message }) {
    return (
        <div className="absolute top-28 left-1/2 transform -translate-x-1/2 bg-[#B6D7A8] border border-green-700 rounded-2xl flex items-center p-4 w-auto">
            <FaRegCircleCheck className="mr-4 text-green-700" />
            <span className="text-black font-medium">{message}</span>
        </div>
    );
}



export default Notification;