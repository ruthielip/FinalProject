import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://artistreeweb.herokuapp.com/api/"
});
