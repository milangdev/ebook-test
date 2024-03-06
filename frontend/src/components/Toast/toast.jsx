import { toast } from "react-toastify";

export const ToastSuccess = (data) => {
  toast.success(data, {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    theme: "light",
  });
};

export const ToastError = (data) => {
  toast.error(data, {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    theme: "light",
  });
};
