import React, { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";
import {
  FaFilePdf,
  FaFileImage,
  FaSave,
  FaList,
  FaFileExport,
  FaFileImport,
  FaTrash,
} from "react-icons/fa";

// 新しい型定義
interface BarcodeSet {
  id: string;
  name: string;
  barcodes: {
    text: string;
    type: string;
  }[];
  createdAt: string;
}

const App = () => {
  const [barcodes, setBarcodes] = useState(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );
  const [showBarcodes, setShowBarcodes] = useState(false);
  // 新しいstate
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [barcodeSets, setBarcodeSets] = useState<BarcodeSet[]>([]);
  const [setName, setSetName] = useState("");

  // LocalStorageからバーコードセットを読み込む
  useEffect(() => {
    const savedSets = localStorage.getItem("barcodeSets");
    if (savedSets) {
      setBarcodeSets(JSON.parse(savedSets));
    }
  }, []);

  // バーコードセットを保存
  const saveCurrentSet = () => {
    if (!setName.trim()) {
      alert("セット名を入力してください。");
      return;
    }

    const newSet: BarcodeSet = {
      id: Date.now().toString(),
      name: setName,
      barcodes: barcodes,
      createdAt: new Date().toISOString(),
    };

    const updatedSets = [...barcodeSets, newSet];
    setBarcodeSets(updatedSets);
    localStorage.setItem("barcodeSets", JSON.stringify(updatedSets));
    setSetName("");
    alert("バーコードセットを保存しました。");
  };

  // バーコードセットを読み込む
  const loadBarcodeSet = (set: BarcodeSet) => {
    setBarcodes(set.barcodes);
    setShowBarcodes(false);
  };

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

  // バーコードセットをエクスポート
  const exportBarcodeSets = () => {
    try {
      const dataStr = JSON.stringify(barcodeSets, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `barcode-sets-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("エクスポートエラー:", error);
      alert("エクスポートに失敗しました。");
    }
  };

  // バーコードセットをインポート
  const importBarcodeSets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSets = JSON.parse(e.target?.result as string);
        // バリデーション
        if (!Array.isArray(importedSets)) {
          throw new Error("Invalid format");
        }

        // 既存のセットと結合
        const updatedSets = [...barcodeSets, ...importedSets];
        setBarcodeSets(updatedSets);
        localStorage.setItem("barcodeSets", JSON.stringify(updatedSets));
        alert("インポートが完了しました。");
      } catch (error) {
        console.error("インポートエラー:", error);
        alert(
          "インポートに失敗しました。正しいファイル形式か確認してください。"
        );
      }
    };
    reader.readAsText(file);
    // input要素をリセット
    event.target.value = "";
  };

  // バーコードセットを削除
  const deleteSet = (setId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // クリックイベントの伝播を停止

    if (window.confirm("このバーコードセットを削除してもよろしいですか？")) {
      const updatedSets = barcodeSets.filter((set) => set.id !== setId);
      setBarcodeSets(updatedSets);
      localStorage.setItem("barcodeSets", JSON.stringify(updatedSets));
    }
  };

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
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

      {/* メインコンテンツ */}
      <div className="flex-1 min-h-screen">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">バーコード作成</h1>
            <button
              onClick={() => setIsOpenSidebar(!isOpenSidebar)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
            >
              <FaList />
              <span>保存したセット</span>
            </button>
          </div>

          {/* セット保存フォーム */}
          <div className="flex items-center space-x-2 mb-4 max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="セット名"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              className="border-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={saveCurrentSet}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2"
            >
              <FaSave />
              <span>セットを保存</span>
            </button>
          </div>

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
                  onChange={(e) =>
                    handleInputChange(index, "text", e.target.value)
                  }
                />
                <select
                  value={barcode.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
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
                        saveBarcode(
                          barcode.text,
                          { format: barcode.type },
                          "png"
                        )
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
      </div>
    </div>
  );
};

export default App;
