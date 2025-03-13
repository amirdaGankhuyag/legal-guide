import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
});
instance.defaults.withCredentials = true; // Cookie-д бичигдсэн зүйлсийг дамжуулах

export default instance;