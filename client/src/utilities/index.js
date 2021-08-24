/**
 * A repository of utility functions used throughout the application
 */
import { toast } from "react-toastify";
import randomColor from "randomcolor"; // import the script
import { LINKEDIN_REGEXP, TOAST_INITIALIZERS } from "./constants";

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
    if (!fullName) return "";
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
    window.open(link, "_blank");
};

/**
 * Copy a text to clipboard
 */
export const copyToClipboard = (url, successMessage = "") => {
    // fallback for non navigator browser support
    // if(navigator && navigator.clipboard){
    //     navigator.clipboard.writeText(url);
    // }else{
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    // }
    successMessage && showSuccessToast(successMessage);
};

/**
 * Validate an email address
 */
export function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * validate a linkedin url
 */
export function validateLinkedIn(url) {
    return LINKEDIN_REGEXP.exec(url);
}


/**
 * Validate url using regex
 */
export function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}