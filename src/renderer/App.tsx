import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BarcodeForm } from "./components/BarcodeForm";
import { BarcodeInputs } from "./components/BarcodeInputs";
import { useBarcodeSet } from "./hooks/useBarcodeSet";
import { useBarcodeGeneration } from "./hooks/useBarcodeGeneration";
import { useDarkMode } from "./hooks/useDarkMode";
import { saveBarcode } from "./utils/barcodeUtils";
import {
  FaFilePdf,
  FaFileImage,
  FaSave,
  FaList,
  FaFileExport,
  FaFileImport,
  FaTrash,
} from "react-icons/fa";

const App = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const {
    barcodeSets,
    setName,
    setSetName,
    saveCurrentSet,
    exportBarcodeSets,
    importBarcodeSets,
    deleteSet,
  } = useBarcodeSet();

  const {
    barcodes,
    showBarcodes,
    handleInputChange,
    loadBarcodeSet,
    handleBulkTypeChange,
    clearAllBarcodes,
    addBarcodeField,
    generateBarcodes,
  } = useBarcodeGeneration();

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar
        isOpenSidebar={isOpenSidebar}
        barcodeSets={barcodeSets}
        exportBarcodeSets={exportBarcodeSets}
        importBarcodeSets={importBarcodeSets}
        loadBarcodeSet={loadBarcodeSet}
        deleteSet={deleteSet}
      />

      <div className="flex-1 min-h-screen bg-white dark:bg-gray-900">
        <Header
          setIsOpenSidebar={setIsOpenSidebar}
          isOpenSidebar={isOpenSidebar}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <div className="container mx-auto py-4">
          <BarcodeForm
            setName={setName}
            setSetName={setSetName}
            saveCurrentSet={() => saveCurrentSet(barcodes)}
          />

          <BarcodeInputs
            barcodes={barcodes}
            showBarcodes={showBarcodes}
            handleInputChange={handleInputChange}
            handleBulkTypeChange={handleBulkTypeChange}
            clearAllBarcodes={clearAllBarcodes}
            saveBarcode={saveBarcode}
          />

          <div className="text-center mt-6">
            <button
              onClick={addBarcodeField}
              className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded 
                hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              バーコードを追加
            </button>
            <button
              onClick={generateBarcodes}
              className="bg-indigo-500 dark:bg-indigo-600 text-white px-6 py-2 rounded 
                hover:bg-indigo-600 dark:hover:bg-indigo-700 ml-4 transition-colors"
            >
              バーコードを作成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
