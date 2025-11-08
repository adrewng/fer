import http from "../utils/http.js";

export const artToolsApi = {
  getAll() {
    return http.get("/");
  },
  getItemDetail(id) {
    return http.get(`/${id}`);
  },
  add(data) {
    return http.post("/", data);
  },
  updateItem(id, data) {
    return http.put(`/${id}`, data);
  },
  delete(id) {
    return http.delete(`/${id}`);
  },
};

export default artToolsApi;
