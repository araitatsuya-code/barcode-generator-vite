import React from "react";
import { FaList } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  setIsOpenSidebar: (isOpen: boolean) => void;
  isOpenSidebar: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  setIsOpenSidebar,
  isOpenSidebar,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-md">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">バーコード作成</h1>
            <span className="text-blue-200 dark:text-gray-400 text-xs">
              簡単・便利なバーコード生成ツール
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
            <button
              onClick={() => setIsOpenSidebar(!isOpenSidebar)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <FaList />
              <span>保存したセット</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
