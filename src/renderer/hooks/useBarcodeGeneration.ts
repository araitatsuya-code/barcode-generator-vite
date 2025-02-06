import { useState } from "react";
import JsBarcode from "jsbarcode";
import { Barcode, BarcodeSet } from "../types";
import {
  calculateEAN13CheckDigit,
  validateEAN13CheckDigit,
} from "../utils/barcodeUtils";

// バーコードタイプの定義を追加
type BarcodeType = "ean13" | "itf" | "code128";

// バーコードタイプのマッピングを追加
const barcodeTypeMap: Record<string, BarcodeType> = {
  ean13: "ean13",
  itf: "itf",
  databar: "code128", // GS1データバーはcode128として処理
};

export const useBarcodeGeneration = () => {
  const [barcodes, setBarcodes] = useState<Barcode[]>(
    Array.from({ length: 5 }, () => ({ text: "", type: "ean13" }))
  );
  const [showBarcodes, setShowBarcodes] = useState(false);

  const handleInputChange = (
    index: number,
    field: "text" | "type",
    value: string
  ) => {
    const newBarcodes = [...barcodes];
    if (field === "text") {
      value = value.replace(/[\s\-　]/g, "");
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

  const loadBarcodeSet = (set: BarcodeSet) => {
    setBarcodes(set.barcodes);
    setShowBarcodes(true);

    setTimeout(() => {
      set.barcodes.forEach((barcode, index) => {
        if (barcode.text) {
          try {
            // バーコードタイプの変換を追加
            const format = barcodeTypeMap[barcode.type] || "code128";

            JsBarcode(`#barcode-${index}`, barcode.text, {
              format: format,
              height: 80,
              fontSize: 16,
              width: 2,
              displayValue: true,
            });
          } catch (error) {
            console.error(`バーコード生成エラー (${index + 1}番目):`, error);
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

  const addBarcodeField = () => {
    setBarcodes([...barcodes, { text: "", type: "ean13" }]);
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

            // バーコードタイプの変換
            const format = barcodeTypeMap[barcode.type] || "code128";

            JsBarcode(`#barcode-${index}`, barcode.text, {
              format: format, // 変換したフォーマットを使用
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

  return {
    barcodes,
    showBarcodes,
    handleInputChange,
    loadBarcodeSet,
    handleBulkTypeChange,
    clearAllBarcodes,
    addBarcodeField,
    generateBarcodes,
  };
};
