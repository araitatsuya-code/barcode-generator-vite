import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BarcodeForm } from "./components/BarcodeForm";
import { BarcodeInputs } from "./components/BarcodeInputs";
import { Barcode, BarcodeSet } from "./types";
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

const App = () => {
  const [barcodes, setBarcodes] = useState<Barcode[]>(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );
  const [showBarcodes, setShowBarcodes] = useState(false);
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
    setShowBarcodes(true);

    // バーコードの生成を遅延実行
    setTimeout(() => {
      set.barcodes.forEach((barcode, index) => {
        if (barcode.text) {
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

  const handleInputChange = (
    index: number,
    field: "text" | "type",
    value: string
  ) => {
    const newBarcodes = [...barcodes];
    if (field === "text") {
      // スペース、ハイフン、全角スペースを除去
      value = value.replace(/[\s\-　]/g, "");
      // EAN-13の場合、13桁入力された時点でチェックディジットを検証
      if (value.length === 13 && newBarcodes[index].type === "ean13") {
        if (!validateEAN13CheckDigit(value)) {
          const correctValue = calculateEAN13CheckDigit(value);
          alert(
            `チェックディジットが正しくありません。\n` +
              `入力値: ${value}\n` +
              `正しい値: ${correctValue}`
          );
        }
      }
    }
    newBarcodes[index][field] = value;
    setBarcodes(newBarcodes);
  };

  const addBarcodeField = () => {
    setBarcodes([...barcodes, { text: "", type: "ean13" }]);
  };

  // EAN-13のチェックデジットを計算する関数
  const calculateEAN13CheckDigit = (code: string): string => {
    // 最初の12桁を使用
    const digits = code.slice(0, 12).split("").map(Number);
    let sum = 0;

    digits.forEach((digit, index) => {
      // 偶数位置は3倍、奇数位置は1倍
      sum += digit * (index % 2 === 0 ? 1 : 3);
    });

    const checkDigit = (10 - (sum % 10)) % 10;
    return code.slice(0, 12) + checkDigit;
  };

  // チェックディジットの検証
  const validateEAN13CheckDigit = (code: string): boolean => {
    const correctCode = calculateEAN13CheckDigit(code);
    return code === correctCode;
  };

  const generateBarcodes = () => {
    setShowBarcodes(true);

    setTimeout(() => {
      barcodes.forEach((barcode, index) => {
        if (barcode.text) {
          try {
            const canvas = document.getElementById(`barcode-${index}`);
            if (!canvas) {
              console.error(`Canvas element not found: barcode-${index}`);
              return;
            }
            // バーコードのバリデーション
            if (barcode.type === "ean13") {
              if (barcode.text.length !== 13) {
                throw new Error(
                  `EAN-13は13桁である必要があります: ${barcode.text}`
                );
              }
              // チェックデジットの検証と修正
              const correctEAN13 = calculateEAN13CheckDigit(barcode.text);
              if (barcode.text !== correctEAN13) {
                const userConfirmed = window.confirm(
                  `バーコード${
                    index + 1
                  }のチェックディジットが正しくありません。\n` +
                    `現在の値: ${barcode.text}\n` +
                    `正しい値: ${correctEAN13}\n\n` +
                    `正しい値に修正しますか？`
                );
                if (userConfirmed) {
                  const newBarcodes = [...barcodes];
                  newBarcodes[index].text = correctEAN13;
                  setBarcodes(newBarcodes);
                  barcode.text = correctEAN13;
                } else {
                  throw new Error(
                    `チェックディジットが正しくありません。\n` +
                      `正しい値は ${correctEAN13} です。`
                  );
                }
              }
            }
            JsBarcode(`#barcode-${index}`, barcode.text, {
              format: barcode.type,
              height: 80,
              fontSize: 16,
              width: 2,
              displayValue: true,
              valid: (valid: boolean) => {
                if (!valid) {
                  console.error(`不正なバーコード値: ${barcode.text}`);
                }
              },
            });
          } catch (error) {
            console.error(`バーコード生成エラー (${index + 1}番目):`, error);
            // エラーメッセージを表示
            const errorMessage =
              error instanceof Error
                ? error.message
                : "不明なエラーが発生しました";
            alert(
              `バーコード${index + 1}の生成に失敗しました: ${errorMessage}`
            );
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
            saveCurrentSet={saveCurrentSet}
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
