import React, { useState } from "react";
import JsBarcode from "jsbarcode";

const App = () => {
  const [barcodes, setBarcodes] = useState(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );

  const handleInputChange = (index: number, field: string, value: string) => {
    const newBarcodes = [...barcodes];
    if (field === "text") {
      // スペース、ハイフン、全角スペースを除去
      value = value.replace(/[\s\-　]/g, "");
    }
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
        height: 40,
        fontSize: 14,
        width: 1,
        displayValue: true,
      });
    });
  };

  const saveBarcode = (barcodeData: string, options: any) => {
    const canvas = document.createElement("canvas");

    try {
      JsBarcode(canvas, barcodeData, {
        format: options.format || "CODE128",
        width: 1,
        height: options.height || 40,
        fontSize: 14,
        displayValue: options.displayValue !== false,
        ...options,
      });

      const link = document.createElement("a");
      link.download = `barcode-${barcodeData}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("バーコード生成エラー:", error);
      alert("バーコードの生成に失敗しました。入力値を確認してください。");
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        バーコード作成アプリ
      </h1>
      <div className="space-y-2 max-w-4xl mx-auto">
        {barcodes.map((barcode, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded shadow-sm"
          >
            {/* 番号ラベル */}
            <div className="w-10 h-10 flex justify-center items-center bg-blue-500 text-white font-bold rounded">
              {index + 1}
            </div>

            <input
              type="text"
              placeholder="バーコード番号"
              value={barcode.text}
              className="border-2 p-3 rounded w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => handleInputChange(index, "text", e.target.value)}
            />
            <select
              value={barcode.type}
              onChange={(e) => handleInputChange(index, "type", e.target.value)}
              className="border-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ean13">JANコード</option>
              <option value="itf">ITFコード</option>
              <option value="databar">GS1データバー</option>
            </select>
            <button
              onClick={() =>
                saveBarcode(barcode.text, { format: barcode.type })
              }
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存
            </button>
            <div className="flex-1 flex justify-center">
              <canvas id={`barcode-${index}`}></canvas>
            </div>
          </div>
        ))}
      </div>

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
          生成
        </button>
      </div>
    </div>
  );
};

export default App;
