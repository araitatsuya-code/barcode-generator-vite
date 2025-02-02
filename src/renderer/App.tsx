import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BarcodeForm } from "./components/BarcodeForm";
import { BarcodeInputs } from "./components/BarcodeInputs";
import { useBarcodeSet } from "./hooks/useBarcodeSet";
import { useBarcodeGeneration } from "./hooks/useBarcodeGeneration";
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
    <div className="flex h-screen">
      <Sidebar
        isOpenSidebar={isOpenSidebar}
        barcodeSets={barcodeSets}
        exportBarcodeSets={exportBarcodeSets}
        importBarcodeSets={importBarcodeSets}
        loadBarcodeSet={loadBarcodeSet}
        deleteSet={deleteSet}
      />

      <div className="flex-1 min-h-screen">
        <Header
          setIsOpenSidebar={setIsOpenSidebar}
          isOpenSidebar={isOpenSidebar}
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
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              バーコードを追加
            </button>
            <button
              onClick={generateBarcodes}
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 ml-4"
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
