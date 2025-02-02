import React from "react";
import { FaList } from "react-icons/fa";

interface HeaderProps {
  setIsOpenSidebar: (isOpen: boolean) => void;
  isOpenSidebar: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  setIsOpenSidebar,
  isOpenSidebar,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">バーコード作成</h1>
            <span className="text-blue-200 text-xs">
              簡単・便利なバーコード生成ツール
            </span>
          </div>
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
  );
};
