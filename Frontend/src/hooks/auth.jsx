import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const {
    data: user,
    error: fetchError,
    mutate: mutateUser,
  } = useSWR(
    typeof window !== "undefined" && localStorage.getItem("auth_token")
      ? "/api/v1/user"
      : null,
    async () => {
      setIsLoading(true);

      try {
        const res = await axios.get("/api/v1/user");
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsLoading(false);
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.push("/login"); // Arahkan ke login
        }
        setIsLoading(false);
        throw error;
      }
    },
    { revalidateOnFocus: false }
  );

  // ini buattt csrf
  const csrf = useCallback(async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("Gagal mendapatkan CSRF token:", error);
    }
  }, []);

  // Fungsi Register
  const register = useCallback(
    async ({
      name,
      email,
      password,
      confirmPassword,
      setErrors,
      setStatus,
    }) => {
      setErrors([]);
      setStatus(null);

      try {
        await csrf();

        const response = await axios.post("/api/v1/register", {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        });
        setStatus(
          response.data.message ||
            "Registration successful! Please verify your email."
        );
        router.push("/verify-email");
      } catch (error) {
        if (error.response?.data) {
          setErrors(
            error.response.data.errors || [error.response.data.message]
          );
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
        const response = await axios.post("/api/v1/login", { email, password });

        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Simpan data user
        await mutateUser();
        router.push("/Dashboard");
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setErrors(["An unexpected error occurred."]);
        }
      }
    },
    [csrf, mutateUser, router]
  );

  // Fungsi Logout
  const logout = useCallback(async () => {
    try {
      await axios.post("/api/v1/logout");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user"); // Hapus data user
      mutateUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [mutateUser, router]);

  // Fungsi Resend Email Verification
  const resendEmailVerification = useCallback(async ({ setStatus }) => {
    try {
      const response = await axios.post(
        "/api/v1/email/verification-notification"
      );
      setStatus(
        "A new verification link has been sent to the email address you provided during registration."
      );
    } catch (error) {
      console.error("Gagal mengirim ulang email verifikasi:", error);
    }
  }, []);

  // fungsi verify email
  // const verifyEmail = useCallback(
  //   async ({ id, hash, setStatus, setErrors }) => {
  //     setErrors([]);
  //     setStatus(null);

  //     if (!id || !hash) {
  //       setErrors(['Invalid verification link.']);
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(`/api/v1/verify-email/${id}/${hash}`);
  //       setStatus('Verification successful! You can now log in.');
  //       router.push('/login');
  //     } catch (error) {
  //       if (error.response?.data) {
  //         setErrors([error.response.data.message || 'Verification failed.']);
  //       } else {
  //         setErrors(['An unexpected error occurred.']);
  //       }
  //     }
  //   },
  //   [router]
  // );

  const verifyEmail = async ({
    id,
    hash,
    expires,
    signature,
    setStatus,
    setErrors,
  }) => {
    setErrors([]);
    setStatus(null);

    if (!id || !hash || !expires || !signature) {
      setErrors(["Invalid verification link."]);
      return;
    }

    try {
      const response = await axios.get(`/api/v1/verify-email/${id}/${hash}`, {
        params: { expires, signature },
      });

      setStatus("Email berhasil diverifikasi!");
      router.push("/Dashboard?verified=1");
    } catch (error) {
      if (error.response?.data) {
        setErrors([error.response.data.message || "Verification failed."]);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  // Fungsi Forgot Password
  const forgotPassword = useCallback(
    async ({ email, setErrors, setStatus }) => {
      await csrf();
      setErrors([]);
      setStatus(null);

      try {
        const response = await axios.post("/api/v1/forgot-password", { email });

        if (response.status === 200) {
          setStatus(
            response.data.message || "Password reset email sent successfully."
          );
        }
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors || ["Invalid email address."]);
        } else {
          setErrors(["An unexpected error occurred. Please try again."]);
        }
      }
    },
    [csrf]
  );

  // Fungsi Reset Password
  const resetPassword = useCallback(
    async ({
      token,
      email,
      password,
      confirmPassword,
      setErrors,
      setStatus,
    }) => {
      await csrf();
      setErrors([]);
      setStatus(null);

      try {
        const response = await axios.post("/api/v1/reset-password", {
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        });

        router.push("/login?reset=" + btoa(response.data.status));
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else {
          setErrors(["An unexpected error occurred."]);
        }
      }
    },
    [csrf, router]
  );

  // Middleware untuk redirect (Auth/Guest)
  useEffect(() => {
    if (middleware === "auth" && !user && !fetchError) {
      mutateUser();
    }

    if (user && middleware === "guest") {
      router.push(redirectIfAuthenticated || "/Dashboard");
    }

    if (user && middleware === "admin" && user.id != 1) {
      router.push("/Dashboard");
    }

    if (fetchError?.response?.status === 401 && middleware === "auth") {
      // Error 401 di middleware auth, logout otomatis
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [
    middleware,
    user,
    fetchError,
    redirectIfAuthenticated,
    router,
    mutateUser,
  ]);

  useEffect(() => {
    if (!localStorage.getItem("auth_token") || user || fetchError) {
      setIsLoading(false);
    }
  }, [user, fetchError]);

  return {
    user,
    register,
    login,
    logout,
    resendEmailVerification,
    verifyEmail,
    forgotPassword,
    resetPassword,
    csrf,
    isLoading,
    error: fetchError,
  };
};
