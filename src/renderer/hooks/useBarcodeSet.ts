import { useState, useEffect } from "react";
import { Barcode, BarcodeSet } from "../types";

export const useBarcodeSet = () => {
  const [barcodeSets, setBarcodeSets] = useState<BarcodeSet[]>([]);
  const [setName, setSetName] = useState("");

  useEffect(() => {
    const savedSets = localStorage.getItem("barcodeSets");
    if (savedSets) {
      setBarcodeSets(JSON.parse(savedSets));
    }
  }, []);

  const saveCurrentSet = (barcodes: Barcode[]) => {
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

  const importBarcodeSets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSets = JSON.parse(e.target?.result as string);
        if (!Array.isArray(importedSets)) {
          throw new Error("Invalid format");
        }

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
    event.target.value = "";
  };

  const deleteSet = (setId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (window.confirm("このバーコードセットを削除してもよろしいですか？")) {
      const updatedSets = barcodeSets.filter((set) => set.id !== setId);
      setBarcodeSets(updatedSets);
      localStorage.setItem("barcodeSets", JSON.stringify(updatedSets));
    }
  };

  return {
    barcodeSets,
    setName,
    setSetName,
    saveCurrentSet,
    exportBarcodeSets,
    importBarcodeSets,
    deleteSet,
  };
};
