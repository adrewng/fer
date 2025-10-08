import { Route, Routes } from "react-router-dom";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Naturals from "./components/Naturals";
import OrchidDetail from "./components/OrchidDetail";
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="naturals" element={<Naturals />} />
        <Route path="contact" element={<Contact />} />
        <Route path="detail/:id" element={<OrchidDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
