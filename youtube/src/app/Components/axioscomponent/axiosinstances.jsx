import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000"
  // "https://yourtube-clone-1.vercel.app/"
});
export default axiosInstance;