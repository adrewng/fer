import axios from "axios";

const URL = import.meta.env.VITE_URL_APP;
class Http {
  instance;
  constructor() {
    this.instance = axios.create({
      baseURL: URL,
      timeout: 15 * 1000,
      headers: { "Content-Type": "application/json" },
    });
  }
}
const http = new Http().instance;
export default http;
