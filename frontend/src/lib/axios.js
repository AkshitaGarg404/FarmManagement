import axios from "axios";

const axiosInstance=axios.create({
    baseURL: import.meta.mode==="development" ? "http://localhost:8000/api" : "/api",
    withCredentials:true, //send cookies in the req to the server cookies are necessary because we are authenticating using cookies
});

export default axiosInstance;