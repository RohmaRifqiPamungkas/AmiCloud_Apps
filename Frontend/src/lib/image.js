const copyImageUrl = (url, callback) => {
    navigator.clipboard.writeText(url).then(() => {
        callback();
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const downloadImage = (imgUrl) => {
    const link = document.createElement('a');

    link.href = imgUrl;

    link.download = imgUrl.split('/').pop();

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
};


const generateLink = (path) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}


function formatFileSize(bytes) {
    if (isNaN(bytes)) {
        return "-";
    }

    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let unitIndex = 0;

    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }

    return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}

export { copyImageUrl, downloadImage, formatFileSize, generateLink };

