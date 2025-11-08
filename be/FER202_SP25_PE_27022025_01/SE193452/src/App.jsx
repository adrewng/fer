import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import AllBookPage from "./page/AllBookPage";
import BookDetailPage from "./page/BookDetailPage";
import CreateBookPage from "./page/CreateBookPage";
import ReadingPage from "./page/ReadingPage";
import UnReadBookPage from "./page/UnReadBookPage";
import UpdateBookPage from "./page/UpdateBookPage";
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ReadingPage />} />
        <Route path="/TruongNNSE193452/AllBooks" element={<AllBookPage />} />
        <Route
          path="/TruongNNSE193452/UnReadBooks"
          element={<UnReadBookPage />}
        />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/createBook" element={<CreateBookPage />} />
        <Route path="/updateBook/:id" element={<UpdateBookPage />} />
      </Route>
    </Routes>
  );
}

export default App;
