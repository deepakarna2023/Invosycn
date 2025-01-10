import axios from "axios";
const port = process.env.REACT_APP_SERVER_PORT;
console.log(port);
const axiosInstance = axios.create({
  baseURL: `${port}/`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
