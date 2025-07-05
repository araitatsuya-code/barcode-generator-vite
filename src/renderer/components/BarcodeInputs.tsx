import React from "react";
import { FaFileImage, FaFilePdf, FaTrash } from "react-icons/fa";
import { Barcode } from "../types";

interface BarcodeInputsProps {
  barcodes: Barcode[];
  showBarcodes: boolean;
  handleInputChange: (
    index: number,
    field: "text" | "type" | "name" | "note",
    value: string
  ) => void;
  handleBulkTypeChange: (newType: string) => void;
  clearAllBarcodes: () => void;
  deleteBarcodeField: (index: number) => void;
  saveBarcode: (
    barcodeData: string,
    options: any,
    format: "png" | "svg"
  ) => void;
}

export const BarcodeInputs: React.FC<BarcodeInputsProps> = ({
  barcodes,
  showBarcodes,
  handleInputChange,
  handleBulkTypeChange,
  clearAllBarcodes,
  deleteBarcodeField,
  saveBarcode,
}) => {
  return (
    <>
      <div className="flex justify-end mb-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllBarcodes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-4
              dark:bg-blue-600 dark:hover:bg-red-700 transition-colors"
          >
            一括クリア
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            一括変更：
          </span>
          <select
            onChange={(e) => handleBulkTypeChange(e.target.value)}
            className="border-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-600"
          >
            <option value="">選択してください</option>
            <option value="ean13">JANコード</option>
            <option value="itf">ITFコード</option>
            <option value="databar">GS1データバー</option>
          </select>
        </div>
      </div>
      <div className="space-y-2 max-w-4xl mx-auto">
        {barcodes.map((barcode, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800 
              shadow-sm rounded"
          >
            <div
              className="w-10 h-10 flex justify-center items-center bg-blue-500 
              dark:bg-blue-600 text-white font-bold rounded"
            >
              {index + 1}
            </div>

            <div className="flex-1">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="バーコード番号"
                    value={barcode.text}
                    className="border-2 p-2.5 rounded w-48 sm:w-64 
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600"
                    onChange={(e) => handleInputChange(index, "text", e.target.value)}
                  />
                  <select
                    value={barcode.type}
                    onChange={(e) => handleInputChange(index, "type", e.target.value)}
                    className="border-2 p-2.5 rounded 
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600"
                  >
                    <option value="ean13">JANコード</option>
                    <option value="itf">ITFコード</option>
                    <option value="databar">GS1データバー</option>
                  </select>
                  {barcodes.length > 1 && (
                    <button
                      onClick={() => deleteBarcodeField(index)}
                      className="bg-gray-400 dark:bg-gray-500 text-white px-3 py-2.5 rounded 
                        hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                      title="このバーコードを削除"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="名前（オプション）"
                    value={barcode.name || ""}
                    className="border-2 p-2 rounded w-48 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600"
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="備考（オプション）"
                    value={barcode.note || ""}
                    className="border-2 p-2 rounded flex-1 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-300
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600"
                    onChange={(e) => handleInputChange(index, "note", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {showBarcodes && barcode.text && (
              <>
                <div className="flex-1 flex flex-col items-center space-y-2">
                  <div className="flex flex-col items-center">
                    <canvas id={`barcode-${index}`} className="bg-white"></canvas>
                    {(barcode.name || barcode.note) && (
                      <div className="mt-2 text-center">
                        {barcode.name && (
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {barcode.name}
                          </div>
                        )}
                        {barcode.note && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {barcode.note}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        saveBarcode(
                          barcode.text,
                          { 
                            format: barcode.type,
                            name: barcode.name,
                            note: barcode.note
                          },
                          "png"
                        )
                      }
                      className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded 
                        hover:bg-blue-600 dark:hover:bg-blue-700
                        flex items-center space-x-1 text-sm transition-colors"
                      title="PNGとして保存"
                    >
                      <FaFileImage />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() =>
                        saveBarcode(
                          barcode.text,
                          { 
                            format: barcode.type,
                            name: barcode.name,
                            note: barcode.note
                          },
                          "svg"
                        )
                      }
                      className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded 
                        hover:bg-green-600 dark:hover:bg-green-700
                        flex items-center space-x-1 text-sm transition-colors"
                      title="SVGとして保存"
                    >
                      <FaFilePdf />
                      <span>SVG</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
