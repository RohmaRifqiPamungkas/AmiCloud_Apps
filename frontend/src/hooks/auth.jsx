
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();
    const params = useParams();

    const { data: user, error, mutate } = useSWR('/api/user', async () => {
        try {
            const res = await axios.get('/api/user');
            return res.data;
        } catch (error) {
            if (error.response?.status === 409) {
                router.push('/verify-email');
            }
            throw error;
        }
    });

    // const csrf = async () => {
    //     await axios.get('/sanctum/csrf-cookie');  
    // };

    const csrf = async () => {
        try {
            const response = await axios.get('/sanctum/csrf-cookie');
            console.log(response);  
        } catch (error) {
            console.error('CSRF Error:', error);
        }
    };
    

    const register = async ({ setErrors, ...props }) => {
        await csrf();
        setErrors([]);

        try {
            const response = await axios.post('/register', props);
            console.log("Register Success:", response.data); 
            await mutate();
        } catch (error) {
            console.error("Register Error:", error); 
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(['An unexpected error occurred.']);
            }
        }
    };

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf();
        setErrors([]);
        setStatus(null);

        try {
            await axios.post('/login', props);
            await mutate();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(['An unexpected error occurred.']);
            }
        }
    };

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();
        setErrors([]);
        setStatus(null);

        try {
            const response = await axios.post('/forgot-password', { email });
            setStatus(response.data.status);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(['An unexpected error occurred.']);
            }
        }
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf();
        setErrors([]);
        setStatus(null);

        try {
            const response = await axios.post('/reset-password', { token: params.token, ...props });
            router.push('/login?reset=' + btoa(response.data.status));
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(['An unexpected error occurred.']);
            }
        }
    };

    const resendEmailVerification = async ({ setStatus }) => {
        try {
            const response = await axios.post('/email/verification-notification');
            setStatus(response.data.status);
        } catch (error) {
            console.error("Error resending email verification:", error);
        }
    };

    const logout = async () => {
        if (!error) {
            await axios.post('/logout');
            await mutate();
        }
        window.location.pathname = '/login';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
            router.push(redirectIfAuthenticated);
        }
        if (middleware === 'auth' && error) {
            logout();
        }
    }, [user, error]);

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
};

