import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import OrchidModal from "./OrchidModal";

export default function Layout() {
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
    <div>
      <Header isDarkMode={isDarkMode} />
      <Outlet
        context={{
          toggleDarkMode,
          handleOnClick,
          isDarkMode,
        }}
      />
      <OrchidModal
        orchid={orchid}
        show={showModal}
        onClose={() => setShowModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
