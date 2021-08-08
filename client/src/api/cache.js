/**
 * The module containing interfaces with localstorage
*/
import jwt_decode from "jwt-decode";

const API_TOKEN_KEY = "askrefer-api-token";

export const getToken = () => localStorage.getItem(API_TOKEN_KEY);
export const deleteToken = () => localStorage.removeItem(API_TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(API_TOKEN_KEY, token);
export const getUser = () => jwt_decode(getToken()); // {email: "xyz@gmail.com", id: "X9Wr34KXP8" iat: 1604411829}
