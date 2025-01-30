import { RiErrorWarningLine } from "react-icons/ri";

export default function AlertDanger() {
    return (
        <div className="flex flex-col items-center space-y-4 text-center">
            <RiErrorWarningLine size={80} className="text-secondary" />
            <h2 className="text-xl font-bold text-gray-700">Delete this image?</h2>
            <p className="text-gray-500">You won&apos;t be able to revert this!</p>
        </div>
    );
}
