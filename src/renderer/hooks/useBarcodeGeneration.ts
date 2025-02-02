import { useState } from "react";
import JsBarcode from "jsbarcode";
import { Barcode, BarcodeSet } from "../types";
import {
  calculateEAN13CheckDigit,
  validateEAN13CheckDigit,
} from "../utils/barcodeUtils";

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
    // ... 既存のgenerateBarcodesロジック ...
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
