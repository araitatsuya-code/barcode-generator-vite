import JsBarcode from "jsbarcode";

// options の型を定義
interface BarcodeOptions {
  format?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
  [key: string]: any;
}

// バーコードタイプのマッピングを追加
const barcodeTypeMap: Record<string, string> = {
  ean13: "ean13",
  itf: "itf",
  databar: "code128", // GS1データバーはcode128として処理
};

export const calculateEAN13CheckDigit = (code: string): string => {
  const digits = code.slice(0, 12).split("").map(Number);
  let sum = 0;

  digits.forEach((digit, index) => {
    sum += digit * (index % 2 === 0 ? 1 : 3);
  });

  const checkDigit = (10 - (sum % 10)) % 10;
  return code.slice(0, 12) + checkDigit;
};

export const validateEAN13CheckDigit = (code: string): boolean => {
  const correctCode = calculateEAN13CheckDigit(code);
  return code === correctCode;
};

export const saveBarcode = (
  barcodeData: string,
  options: BarcodeOptions,
  format: "png" | "svg"
) => {
  if (!barcodeData.trim()) {
    alert("バーコード番号を入力してください。");
    return;
  }

  try {
    // バーコードタイプの変換
    const barcodeFormat = options.format
      ? barcodeTypeMap[options.format]
      : "code128";

    if (format === "svg") {
      const svg = document.createElement("svg");
      JsBarcode(svg, barcodeData, {
        format: barcodeFormat,
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
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcodeData, {
        format: barcodeFormat,
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
