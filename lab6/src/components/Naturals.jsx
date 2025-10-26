import { useOutletContext } from "react-router-dom";

import Orchids from "./Orchids";

export default function Naturals(list, isLoading) {
  const { isDarkMode, handleOnClick, toggleDarkMode } = useOutletContext();
  const filteredListOfOrchids = isLoading
    ? []
    : list.list.filter((orchid) => orchid.isNatural);
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#212529",
        transition: "all 0.3s ease",
      }}
    >
      {isLoading && <p>Đang tải danh sách</p>}
      {!isLoading && (
        <Orchids
          handleOnClick={handleOnClick}
          isDarkMode={isDarkMode}
          handleOnToggle={toggleDarkMode}
          orchilds={filteredListOfOrchids}
        />
      )}
    </div>
  );
}
