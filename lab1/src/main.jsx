import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Orchids from "./components/Orchids";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <Orchids />
    {/* <p>Adrew</p> */}
  </StrictMode>
);
