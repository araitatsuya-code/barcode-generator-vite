import React from "react";
import { FaSave } from "react-icons/fa";

interface BarcodeFormProps {
  setName: string;
  setSetName: (name: string) => void;
  saveCurrentSet: () => void;
}

export const BarcodeForm: React.FC<BarcodeFormProps> = ({
  setName,
  setSetName,
  saveCurrentSet,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="セット名"
        value={setName}
        onChange={(e) => setSetName(e.target.value)}
        className="border-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          border-gray-300 dark:border-gray-600"
      />
      <button
        onClick={saveCurrentSet}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 
          dark:bg-green-600 dark:hover:bg-green-700
          flex items-center space-x-2 transition-colors"
      >
        <FaSave />
        <span>セットを保存</span>
      </button>
    </div>
  );
};
