import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import ArtToolDetailPage from "./page/ArtToolDetailPage";
import ArtToolsPage from "./page/ArtToolsPage";
import Contact from "./page/Contact";
import CreateItemPage from "./page/CreatePage";
import EditArtToolPage from "./page/EditArtToolPage";
import HomePage from "./page/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/item/:id" element={<ItemDetailPage />} /> */}
        <Route path="/TruongNNSE193452" element={<ArtToolsPage />} />
        <Route path="/artTool/:id" element={<ArtToolDetailPage />} />
        <Route path="/createArtTool" element={<CreateItemPage />} />
        <Route path="/updateArtTool/:id" element={<EditArtToolPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
