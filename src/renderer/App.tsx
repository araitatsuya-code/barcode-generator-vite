import React, { useState } from "react";
import JsBarcode from "jsbarcode";

const App = () => {
  const [barcodes, setBarcodes] = useState(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );

  const handleInputChange = (index: number, field: string, value: string) => {
    const newBarcodes = [...barcodes];
    newBarcodes[index][field] = value;
    setBarcodes(newBarcodes);
  };

  const addBarcodeField = () => {
    setBarcodes([...barcodes, { text: "", type: "ean13" }]);
  };

  const generateBarcodes = () => {
    barcodes.forEach((barcode, index) => {
      JsBarcode(`#barcode-${index}`, barcode.text, {
        format: barcode.type,
        displayValue: true,
      });
    });
  };

  const saveBarcode = (index: number) => {
    const canvas = document.querySelector(
      `#barcode-${index}`
    ) as HTMLCanvasElement;
    if (canvas) {
      const a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = `${barcodes[index].text || "barcode"}.png`;
      a.click();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        バーコード作成アプリ
      </h1>
      <div className="space-y-4 max-w-4xl mx-auto">
        {barcodes.map((barcode, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 bg-gray-50 rounded shadow-sm"
          >
            <input
              type="text"
              placeholder="バーコード番号"
              value={barcode.text}
              className="border p-2 rounded w-48 sm:w-64"
              onChange={(e) => handleInputChange(index, "text", e.target.value)}
            />
            <select
              value={barcode.type}
              onChange={(e) => handleInputChange(index, "type", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="ean13">JANコード</option>
              <option value="itf">ITFコード</option>
              <option value="databar">GS1データバー</option>
            </select>
            <button
              onClick={() => saveBarcode(index)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存
            </button>
            <canvas id={`barcode-${index}`} className="hidden"></canvas>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
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
          生成
        </button>
      </div>
    </div>
  );
};

export default App;
