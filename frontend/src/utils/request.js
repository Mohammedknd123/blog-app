import axios from "axios";

const request = axios.create({
  baseURL: "https://blog-app-pd8m.onrender.com",
});

export default request;
