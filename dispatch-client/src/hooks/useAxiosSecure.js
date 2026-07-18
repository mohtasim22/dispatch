import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebase.init";
import useAuth from "./useAuth";

const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // REQUEST interceptor — attach a fresh token to every outgoing call
    const reqId = axiosSecure.interceptors.request.use(async (config) => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();   // Firebase auto-refreshes if expired
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // RESPONSE interceptor — if the server rejects our auth, log out + redirect
    const resId = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);   // still reject so the caller's catch runs
      }
    );

    // CLEANUP — eject on unmount so interceptors don't stack on re-renders
    return () => {
      axiosSecure.interceptors.request.eject(reqId);
      axiosSecure.interceptors.response.eject(resId);
    };
  }, [navigate, logOut]);

  return axiosSecure;
};

export default useAxiosSecure;
