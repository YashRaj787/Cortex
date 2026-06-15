import { toast } from "react-toastify";

/**
 * Show a success toast notification.
 */
export function toastSuccess(message) {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

/**
 * Show an error toast notification.
 */
export function toastError(message) {
  toast.error(message || "Something went wrong", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}