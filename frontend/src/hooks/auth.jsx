


import { useEffect, useCallback } from 'react';
import axios from '@/lib/axios'; // Gunakan axios instance
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  // Fetch data user menggunakan SWR
  const { data: user, error: fetchError, mutate: mutateUser } = useSWR(
    '/api/v1/user', // Endpoint untuk mendapatkan data user
    async () => {
      const res = await axios.get('/api/v1/user');
      return res.data;
    },
    { revalidateOnFocus: false }
  );

  // Mendapatkan CSRF token
  const csrf = useCallback(async () => {
    try {
      await axios.get('/sanctum/csrf-cookie'); // Pastikan CSRF cookie di-set
    } catch (error) {
      console.error('Gagal mendapatkan CSRF token:', error);
    }
  }, []);

  // Fungsi Register
  const register = useCallback(
    async ({ name, email, password, confirmPassword, setErrors, setStatus }) => {
      setErrors([]);
      setStatus(null);

      try {
        await csrf();

        const response = await axios.post('/api/v1/register', {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        });

        localStorage.setItem('auth_token', response.data.token); // Simpan token ke localStorage
        setStatus('Registration successful! Please verify your email.');
        router.push('/verify-email'); // Redirect ke halaman verifikasi email
      } catch (error) {
        if (error.response?.data) {
          setErrors(error.response.data.errors || [error.response.data.message]);
        } else {
          setErrors([error.message]);
        }
      }
    },
    [csrf, router]
  );

  // Fungsi Login
  const login = useCallback(
    async ({ email, password, setErrors }) => {
      await csrf();
      setErrors([]);

      try {
        const response = await axios.post('/api/v1/login', { email, password });

        localStorage.setItem('auth_token', response.data.token); 
        await mutateUser(); 
        router.push('/Dashboard'); // Redirect ke dashboard
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setErrors(['An unexpected error occurred.']);
        }
      }
    },
    [csrf, mutateUser, router]
  );

  // Fungsi Logout
  const logout = useCallback(async () => {
    try {
      await axios.post('/api/v1/logout');
      localStorage.removeItem('auth_token'); 
      mutateUser(null); // Reset data user
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [mutateUser, router]);

  // Fungsi Resend Email Verification
  const resendEmailVerification = useCallback(async ({ setStatus }) => {
    try {
      const response = await axios.post('/api/v1/email/verification-notification');
      setStatus(response.data.status); // Set status berhasil
    } catch (error) {
      console.error('Gagal mengirim ulang email verifikasi:', error);
    }
  }, []);

  // Fungsi Forgot Password
  const forgotPassword = useCallback(
    async ({ email, setErrors, setStatus }) => {
      await csrf();
      setErrors([]);
      setStatus(null);

      try {
        const response = await axios.post('/api/v1/forgot-password', { email });
        setStatus(response.data.status); // Set status berhasil
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setErrors(['An unexpected error occurred.']);
        }
      }
    },
    [csrf]
  );

  // Fungsi Reset Password
  const resetPassword = useCallback(
    async ({ token, email, password, confirmPassword, setErrors, setStatus }) => {
      await csrf();
      setErrors([]);
      setStatus(null);

      try {
        const response = await axios.post('/api/v1/reset-password', {
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        });

        router.push('/login?reset=' + btoa(response.data.status)); // Redirect ke login dengan pesan sukses
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setErrors(['An unexpected error occurred.']);
        }
      }
    },
    [csrf, router]
  );

  // Middleware untuk redirect (Auth/Guest)
  useEffect(() => {
    if (middleware === 'auth' && !user && !fetchError) {
      mutateUser(); // Refresh data user
    }

    if (user && middleware === 'guest') {
      router.push(redirectIfAuthenticated || '/dashboard'); // Redirect jika sudah login
    }

    if (fetchError && middleware === 'auth') {
      router.push('/login'); // Redirect ke login jika tidak ada user
    }
  }, [middleware, user, fetchError, redirectIfAuthenticated, router, mutateUser]);

  return {
    user,
    register,
    login,
    logout,
    resendEmailVerification,
    forgotPassword,
    resetPassword,
    csrf,
    error: fetchError,
  };
};
