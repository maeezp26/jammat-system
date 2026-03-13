import axios from "axios";

const API = axios.create({
  baseURL: "https://jammat-system.onrender.com/api"
});

export default API;