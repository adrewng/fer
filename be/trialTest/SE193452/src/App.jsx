import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Contact from "./page/Contact";
import CreateStudent from "./page/CreateStudent";
import Dashboard from "./page/Dashboard";
import Home from "./page/Home";
import StudentDetail from "./page/StudentDetail";
import UpdateStudent from "./page/UpdateStudent";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/management" element={<Dashboard />} />
        <Route path="/student/:id" element={<StudentDetail />} />
        <Route path="/createStudent/:id" element={<CreateStudent />} />
        <Route path="/updateStudent/:id" element={<UpdateStudent />} />
        <Route path="/TruongNNSE193452/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
