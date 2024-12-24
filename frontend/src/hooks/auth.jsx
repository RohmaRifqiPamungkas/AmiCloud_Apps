

import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";


export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", async () => {
    try {
      const res = await axios.get("/api/user", {
        headers: {
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      });
      return res.data;
    } catch (error) {
      if (error.response?.status === 409) {
        router.push("/verify-email");
      }
      throw error;
    }
  });


  

  const csrf = async () => {
    try {
        await axios.get('/sanctum/csrf-cookie'); 
        console.log("CSRF token diterima dan diset");
    } catch (error) {
        console.error("Gagal mendapatkan CSRF token:", error);
    }
  };

  const register = async ({
    name,
    email,
    password,
    confirmPassword, 
    setErrors,
    setStatus,
    successCallback,
  }) => {
    try {
      await csrf();  
     
      const response = await axios.post("/register", {
        name,
        email,
        password, 
        password_confirmation: confirmPassword, 
      });
  
      if (response.status === 200) {
        setStatus("Registration successful!");
        successCallback(); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || [error.response.data.message]);
      } else {
        setErrors([error.message]);
      }
    }
  };

  const login = async ({ email, password, remember, setErrors, setStatus }) => {
    await csrf(); 
  
    try {
      const response = await axios.post("/login", {
        email,
        password,
        remember: remember === true || remember === 'on', 
      });

      console.log("Login Response:", response);
  
      if (response.status === 200) {
        setStatus("Login successful!");
        await mutate(); 
        router.push("/dashboard"); 
      } else {
        setErrors(["Invalid login attempt."]); 
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 422:
            setErrors(Object.values(error.response.data.errors).flat());
            break;
          case 401:
            setErrors(["Invalid credentials."]);
            break;
          default:
            setErrors(["An unexpected error occurred."]);
            break;
        }
      } else {
        setErrors(["Failed to connect to the server. Please try again."]);
      }
    }
  };


  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/forgot-password", { email });
      setStatus(response.data.status);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/reset-password", {
        token: params.token,
        ...props,
      });
      router.push("/login?reset=" + btoa(response.data.status));
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  const resendEmailVerification = async ({ setStatus }) => {
    try {
      const response = await axios.post("/email/verification-notification");
      console.log("Resend Email Verification Response:", response); 
      setStatus(response.data.status);
    } catch (error) {
      console.error("Error resending email verification:", error);
      console.log("Error Status:", error.response?.status); 
    }
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout");
      await mutate();
    }
    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }  
    if (window.location.pathname === "/verify-email" && user?.email_verified_at) {
      router.push(redirectIfAuthenticated);
    }
    if (middleware === "auth" && error && error.response?.status !== 403) {
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
