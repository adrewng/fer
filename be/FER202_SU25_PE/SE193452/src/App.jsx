import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import AllLesson from "./page/AllLesson";
import CompleteLesson from "./page/CompletedLesson";
import CreatedLesson from "./page/CreatedLesson";
import Home from "./page/Home";
import LessonDetail from "./page/LessonDetail";
import UpdateLesson from "./page/UpdateLesson";
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={"/"} element={<Home />} />
          <Route path={"/se193452/all-lessons"} element={<AllLesson />} />
          <Route
            path={"/se193452/completed-lessons"}
            element={<CompleteLesson />}
          />
          <Route path={"/se193452/create-lesson"} element={<CreatedLesson />} />
          <Route
            path={"/se193452/update-lesson/:id"}
            element={<UpdateLesson />}
          />
          <Route path={"/se193452/lesson/:id"} element={<LessonDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
