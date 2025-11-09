import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import AddLesson from "./page/AddLesson";
import AllLesson from "./page/AllLesson";
import CompletedLesson from "./page/CompletedLesson";
import Home from "./page/Home";
import LessonDetail from "./page/LessonDetail";
import UpdateLesson from "./page/UpdateLesson";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/se193452/all-lessons" element={<AllLesson />} />
          <Route
            path="/se193452/completed-lessons"
            element={<CompletedLesson />}
          />
          <Route path="/se193452/lesson/:id" element={<LessonDetail />} />
          <Route path="/se19342/update-lesson/:id" element={<UpdateLesson />} />
          <Route path="/se193452/add-lesson" element={<AddLesson />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
