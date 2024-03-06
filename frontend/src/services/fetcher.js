import axios from "axios";
import Cookies from "js-cookie";
import { ToastError } from "../components/Toast";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  ...(process.env.NODE_ENV === "production" && { withCredentials: true }),
  timeout: 10000,
});

instance.interceptors.request.use(
  (e) => {
    const user = Cookies.get("user");
    if (user) {
      const token = JSON.parse(user)?.token;
      if (token) {
        e.headers.Authorization = `Bearer ${token}`;
      }
    }
    return e;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      const { status } = error?.response;
      if (status === 401) {
        Cookies.remove("user");
      }
    }
    return Promise.reject(error);
  }
);

export const httpRequest = async (req) => {
  const response = await instance(req);
  return { data: response?.data, status: response?.status };
};

export const Error = (error) => {
  if (error?.response) {
    if (error?.response?.data?.message) {
      ToastError(error?.response?.data?.message);
    } else if (!error?.response?.data?.message) {
      ToastError(error?.response?.statusText);
    }
  }
};

export default instance;
