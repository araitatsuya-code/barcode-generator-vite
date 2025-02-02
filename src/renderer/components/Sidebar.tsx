import React from "react";
import { FaFileExport, FaFileImport, FaTrash } from "react-icons/fa";
import { BarcodeSet } from "../types";

interface SidebarProps {
  isOpenSidebar: boolean;
  barcodeSets: BarcodeSet[];
  exportBarcodeSets: () => void;
  importBarcodeSets: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loadBarcodeSet: (set: BarcodeSet) => void;
  deleteSet: (setId: string, event: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenSidebar,
  barcodeSets,
  exportBarcodeSets,
  importBarcodeSets,
  loadBarcodeSet,
  deleteSet,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpenSidebar ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-gray-800 text-white transition-transform duration-200 ease-in-out z-10`}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">保存したセット</h2>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={exportBarcodeSets}
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center space-x-1 text-sm"
            title="エクスポート"
          >
            <FaFileExport />
            <span>エクスポート</span>
          </button>
          <label className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center space-x-1 text-sm cursor-pointer">
            <FaFileImport />
            <span>インポート</span>
            <input
              type="file"
              accept=".json"
              onChange={importBarcodeSets}
              className="hidden"
            />
          </label>
        </div>
        <div className="space-y-2">
          {barcodeSets.map((set) => (
            <div
              key={set.id}
              className="p-2 hover:bg-gray-700 cursor-pointer rounded group"
              onClick={() => loadBarcodeSet(set)}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{set.name}</div>
                <button
                  onClick={(e) => deleteSet(set.id, e)}
                  className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="削除"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(set.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
