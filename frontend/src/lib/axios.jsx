import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true, 
});


axios.interceptors.request.use(
    (config) => {
    
        const xsrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1];

        if (xsrfToken) {
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
            console.log("X-XSRF-TOKEN berhasil disisipkan:", xsrfToken);
        } else {
            console.warn("XSRF-TOKEN tidak ditemukan di cookie");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
