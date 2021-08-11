/**
 * A repository of utility functions used throughout the application
 */
import { toast } from "react-toastify";
import { TOAST_INITIALIZERS } from "./constants";

/**
 * A utility function used to show an error toast
 */
export const showErrorToast = (text) => {
    toast.error(text, TOAST_INITIALIZERS);
};

/**
 * A utility function to show a success toast
 */
export const showSuccessToast = (text) => {
    toast.success(text, TOAST_INITIALIZERS);
}