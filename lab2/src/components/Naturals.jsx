import React from "react";
import { useOutletContext } from "react-router-dom";
import ListOfOrchids from "../shared/ListOfOrchids";
import Orchids from "./Orchids";

export default function Naturals() {
  const { isDarkMode, handleOnClick, toggleDarkMode } = useOutletContext();
  const filteredListOfOrchids = ListOfOrchids.filter(
    (orchid) => orchid.isNatural
  );
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#212529",
        transition: "all 0.3s ease",
      }}
    >
      <Orchids
        handleOnClick={handleOnClick}
        isDarkMode={isDarkMode}
        handleOnToggle={toggleDarkMode}
        ListOfOrchids={filteredListOfOrchids}
      />
    </div>
  );
}
