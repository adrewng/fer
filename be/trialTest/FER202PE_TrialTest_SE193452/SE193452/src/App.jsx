import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Contact from "./page/Contact";
import DashBoard from "./page/Dashboard";
import Detail from "./page/Detail";
import Home from "./page/Home";
function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" index element={<Home />}></Route>
          <Route path="/management" element={<DashBoard />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/student/:id" element={<Detail />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
