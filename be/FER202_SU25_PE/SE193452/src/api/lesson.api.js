import http from "../utils/http.js";
const lessonApi = {
  getAll() {
    return http.get("/");
  },
  getDetail(id) {
    return http.get(`/${id}`);
  },
  createLesson(body) {
    return http.post("/", body);
  },
  updateLesson(id, body) {
    return http.put(`/${id}`, body);
  },
  deleteLesson(id) {
    return http.delete(`/${id}`);
  },
};
export default lessonApi;
