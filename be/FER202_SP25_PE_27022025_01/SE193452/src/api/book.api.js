import http from "../util/http.js";
export const bookApi = {
  getAll() {
    return http.get("/");
  },
  getItemDetail(id) {
    return http.get(`/${id}`);
  },
  createItem(data) {
    return http.post("/", data);
  },
  updateItem(id, data) {
    return http.put(`/${id}`, data);
  },
  deleteItem(id) {
    return http.delete(`/${id}`);
  },
};

export default bookApi;
