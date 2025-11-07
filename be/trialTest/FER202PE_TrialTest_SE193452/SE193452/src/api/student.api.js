import http from "../util/http";

const studentApi = {
  getStudents() {
    return http.get("", {
      params: {
        sortBy: "name",
        order: "asc",
      },
    });
  },
  getStudent(id) {
    return http.get(`/${id}`);
  },
  createStudent(data) {
    return http.post("/", data);
  },
  updateStudent(id, data) {
    return http.put(`/${id}`, data);
  },
  deleteStudent(id) {
    return http.delete(`/${id}`);
  },
};
export default studentApi;
