import { useOutletContext } from "react-router-dom";

import Orchids from "./Orchids";

export default function Home(list, isLoading) {
  const { isDarkMode, handleOnClick, toggleDarkMode } = useOutletContext();
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
          orchilds={list.list}
        />
      )}
    </div>
  );
}
