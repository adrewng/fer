import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Naturals from "./components/Naturals";
import OrchidDetail from "./components/OrchidDetail";
import OrchidForm from "./components/OrchidForm";
import { fetchOrchilds } from "./slices/orchildSlice";

function App() {
  const { list, isLoading } = useSelector((state) => state.orchild);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrchilds());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={<Home list={list ?? []} isLoading={isLoading} />}
          />
          <Route
            path="naturals"
            element={<Naturals list={list ?? []} isLoading={isLoading} />}
          />
          {/* ROUTE TẠO LAN MỚI */}
          <Route path="create" element={<OrchidForm />} />

          <Route path="contact" element={<Contact />} />
          <Route path="detail/:id" element={<OrchidDetail />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
