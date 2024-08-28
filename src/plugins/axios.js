import axios from "axios";

export const adminRoot = "/app";

// SERVER_MODE [localhost, dev, live]
const SERVER_MODE = "dev";

/********************************************************************
 * LocalHost Credentials
 ********************************************************************/
const local_img_baseURL = "http://localhost:8000/storage/";
const local_baseURL = "http://localhost:8000/api/";

/********************************************************************
 * Dev Server Credentials
 ********************************************************************/
const dev_img_baseURL = "https://swess.store/storage/";
const dev_baseURL = "https://swess.store/api/";

/********************************************************************
 * Live Server Credentials
 ********************************************************************/
const live_img_baseURL = "https://backend.swesshome.com/storage/";
const live_baseURL = "https://backend.swesshome.com/api/";

axios.defaults.headers.common["Accept-Language"] = "ar";
axios.defaults.headers.common["lang"] = "ar";

export const img_baseUrl = live_img_baseURL; // تعيين الـ base URL حسب SERVER_MODE
axios.defaults.baseURL =
  SERVER_MODE === "localhost"
    ? local_baseURL
    : SERVER_MODE === "dev"
    ? dev_baseURL
    : live_baseURL;

// تصدير axios كـ default export
export default axios;
