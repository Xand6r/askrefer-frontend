/**
 * A repository of utility functions used throughout the application
 */
import { toast } from "react-toastify";
import randomColor from "randomcolor"; // import the script
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
};

/**
 * A utility function to get initials and a random color
 * useful for displaying avatar placeholders
 */
export const getAvatarDetails = (fullName) => {
    const [firstName, lastname] = fullName.split("");
    let initials;
    if (lastname) {
        initials = `${fullName[0]}${fullName[1]}`;
    } else {
        initials = `${firstName[0]}${lastname[0]}`;
    }
    const color = randomColor({ seed: initials });
    return {
        color,
        initials,
    };
};


/**
 * MAnually redirecting to another URL
 */
export const gotoURL = (link) => {
    window.open(link, "_blank")
}