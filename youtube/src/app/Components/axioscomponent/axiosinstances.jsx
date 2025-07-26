import axios from "axios";
const axiosInstance = axios.create({
  baseURL: ["https://youtube-clone-oprs.onrender.com", "https://youtube-clone-oprs.onrender.com/"]
});
export default axiosInstance;