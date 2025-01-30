import ShareAlert from "@/components/Alert/ShareAlert";
import AlertDanger from "@/components/Alert/DangerAlert";
import ReactDOM from "react-dom/client";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import { copyImageUrl } from "./image";

const showConfirmDialog = async ({
    alertContent = <AlertDanger />,
    onConfirm,
    onCancel,
    confirmButtonText = "OK",
    cancelButtonText = "Cancel",
}) => {
    return Swal.fire({
        html: ReactDOMServer.renderToString(alertContent),
        showConfirmButton: true,
        confirmButtonText,
        showCancelButton: true,
        cancelButtonText,
        customClass: {
            confirmButton:
                "bg-secondary text-black px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white",
            cancelButton:
                "border-primary bg-transparant text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white",
            popup: "rounded-3xl p-6 shadow-lg",
        },
        showCloseButton: true,
    }).then((result) => {
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        } else if (result.isDismissed && onCancel) {
            onCancel();
        }
    });
};


const handleCopy = (url, callback) => {
    copyImageUrl(url, callback)
};

const showShareDialog = async (url, callback) => {
    Swal.fire({
        html: `<div id="alert-share"></div>`,
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
            confirmButton:
                "bg-secondary text-black px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white",
            popup: "rounded-3xl p-6 shadow-lg",
        },
        showCloseButton: true,
        didOpen: () => {
            const onCopy = () => {
                handleCopy(url, callback)
                Swal.close();
            };

            const onShare = () => {
                const whatsappUrl = `https://wa.me/?text=${url}`;
                window.open(whatsappUrl, '_blank');
            };

            const root = ReactDOM.createRoot(document.getElementById('alert-share'));
            root.render(
                <ShareAlert link={url} onCopy={onCopy} onShare={onShare} />
            );
        },
    });
}


export { showConfirmDialog, showShareDialog };

