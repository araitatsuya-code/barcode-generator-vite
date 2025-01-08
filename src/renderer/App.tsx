import React, { useState } from "react";
import JsBarcode from "jsbarcode";
import { FaFilePdf, FaFileImage } from "react-icons/fa";

const App = () => {
  const [barcodes, setBarcodes] = useState(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );
  const [showBarcodes, setShowBarcodes] = useState(false);

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
    setShowBarcodes(true);

    // setShowBarcodesの状態が反映された後にバーコードを生成するため、
    // setTimeout を使用して非同期処理にする
    setTimeout(() => {
      barcodes.forEach((barcode, index) => {
        if (barcode.text) {
          // 入力値がある場合のみバーコードを生成
          try {
            JsBarcode(`#barcode-${index}`, barcode.text, {
              format: barcode.type,
              height: 80,
              fontSize: 16,
              width: 2,
              displayValue: true,
            });
          } catch (error) {
            console.error(`バーコード生成エラー (${index + 1}番目):`, error);
          }
        }
      });
    }, 0);
  };

  const saveBarcode = (
    barcodeData: string,
    options: any,
    format: "png" | "svg"
  ) => {
    if (!barcodeData.trim()) {
      alert("バーコード番号を入力してください。");
      return;
    }

    try {
      if (format === "svg") {
        // SVG形式での保存
        const svg = document.createElement("svg");
        JsBarcode(svg, barcodeData, {
          format: options.format || "CODE128",
          width: 1,
          height: 40,
          fontSize: 14,
          displayValue: true,
          ...options,
        });

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.download = `barcode-${barcodeData}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // PNG形式での保存（既存のコード）
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, barcodeData, {
          format: options.format || "CODE128",
          width: 1,
          height: 40,
          fontSize: 14,
          displayValue: true,
          ...options,
        });

        const link = document.createElement("a");
        link.download = `barcode-${barcodeData}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("バーコード生成エラー:", error);
      alert("バーコードの生成に失敗しました。入力値を確認してください。");
    }
  };

  const handleBulkTypeChange = (newType: string) => {
    const newBarcodes = barcodes.map((barcode) => ({
      ...barcode,
      type: newType,
    }));
    setBarcodes(newBarcodes);
  };

  const clearAllBarcodes = () => {
    const clearedBarcodes = barcodes.map((barcode) => ({
      ...barcode,
      text: "",
    }));
    setBarcodes(clearedBarcodes);
    setShowBarcodes(false);
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold text-center mb-6">バーコード作成</h1>
      <div className="flex justify-end mb-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllBarcodes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-4"
          >
            一括クリア
          </button>
          <span className="text-sm text-gray-600">一括変更：</span>
          <select
            onChange={(e) => handleBulkTypeChange(e.target.value)}
            className="border-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            className="flex items-center space-x-2 p-2 bg-gray-50 shadow-sm h-25"
          >
            <div className="w-10 h-10 flex justify-center items-center bg-blue-500 text-white font-bold rounded">
              {index + 1}
            </div>

            <input
              type="text"
              placeholder="バーコード番号"
              value={barcode.text}
              className="border-2 p-2.5 rounded w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => handleInputChange(index, "text", e.target.value)}
            />
            <select
              value={barcode.type}
              onChange={(e) => handleInputChange(index, "type", e.target.value)}
              className="border-2 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ean13">JANコード</option>
              <option value="itf">ITFコード</option>
              <option value="databar">GS1データバー</option>
            </select>

            {showBarcodes && barcode.text && (
              <>
                <button
                  onClick={() =>
                    saveBarcode(barcode.text, { format: barcode.type }, "png")
                  }
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  保存
                </button>
                <div className="flex-1 flex justify-center items-center space-x-2">
                  <canvas id={`barcode-${index}`}></canvas>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() =>
                        saveBarcode(
                          barcode.text,
                          { format: barcode.type },
                          "png"
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center space-x-1 text-sm"
                      title="PNGとして保存"
                    >
                      <FaFileImage />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() =>
                        saveBarcode(
                          barcode.text,
                          { format: barcode.type },
                          "svg"
                        )
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center space-x-1 text-sm"
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
  );
};

export default App;
