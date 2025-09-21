import { useState } from "react";
import OrchidModal from "./components/OrchidModal";
import Orchids from "./components/Orchids";

function App() {
  const [orchid, setOrchid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleOnClick = (orchid) => {
    setOrchid(orchid);
    setShowModal(true);
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#212529",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Orchids
        handleOnClick={handleOnClick}
        isDarkMode={isDarkMode}
        handleOnToggle={toggleDarkMode}
      />
      <OrchidModal
        isDarkMode={isDarkMode}
        orchid={orchid}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
