/**
 * Module containg all functions for API requests which are going to be made
 */
import axios from "axios";
import { getToken } from "@/api/cache";


/**
 * dynamically select the url to use for the backend
 * depending on if were working locally or building for deployment
 */
// TODO change to use .env and .env.prod respectively
const REMOTE_URL = "https://askrefer-backend.herokuapp.com";
export const BASE = REMOTE_URL;
    //  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    //      ? "http://localhost:8000"
    //      : REMOTE_URL;

/**
 * dynamically get the tokens for every API call
 * @param {String} token The token which would enable the user access protected routes
 */
const getHeader = () => ({
    "Content-Type": "application/json"
});

/**
 * Make a post request to the server using the stored token in the database
 * @param {String} path The path we wish to make a post request to
 * @param {Object} obj The payload of the post request in the form of an object
 * @returns {Promise}
 */
export const postReq = async (path, obj) => {
    try {
        const response = await axios.post(BASE + path, obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Make a get request from the server using the token in the databasr
 * @param {*} path The path we wish to make a post request to
 * @returns {Promise}
 */
export const getReq = async (path) => {
    try {
        const response = await axios.get(BASE + path);
        return response;
    } catch (error) {
        throw error;
    }
};
