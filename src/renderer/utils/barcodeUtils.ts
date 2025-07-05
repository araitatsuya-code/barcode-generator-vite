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
      // SVG用にCanvas経由でPNGを作成してからSVGに変換
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // 一時的なcanvasでバーコードサイズを取得
      const tempCanvas = document.createElement("canvas");
      JsBarcode(tempCanvas, barcodeData, {
        format: barcodeFormat,
        width: 1,
        height: 40,
        fontSize: 14,
        displayValue: true,
      });

      // 名前と備考がある場合の追加高さを計算
      const hasName = options.name && options.name.trim();
      const hasNote = options.note && options.note.trim();
      const additionalHeight = (hasName ? 25 : 0) + (hasNote ? 20 : 0) + (hasName || hasNote ? 10 : 0);
      
      // 最終canvasのサイズを設定
      canvas.width = Math.max(tempCanvas.width, 300);
      canvas.height = tempCanvas.height + additionalHeight;
      
      // 白い背景を描画
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // バーコードを中央に描画
        const barcodeX = (canvas.width - tempCanvas.width) / 2;
        ctx.drawImage(tempCanvas, barcodeX, 0);
        
        // 名前と備考を描画
        if (hasName || hasNote) {
          let textY = tempCanvas.height + 15;
          ctx.textAlign = "center";
          ctx.fillStyle = "black";
          
          if (hasName) {
            ctx.font = "bold 16px Arial";
            ctx.fillText(options.name, canvas.width / 2, textY);
            textY += 25;
          }
          
          if (hasNote) {
            ctx.font = "12px Arial";
            ctx.fillStyle = "#666666";
            ctx.fillText(options.note, canvas.width / 2, textY);
          }
        }
      }

      // CanvasからPNG dataURLを取得し、SVGとして埋め込み
      const dataURL = canvas.toDataURL("image/png");
      
      // クリーンなSVGを手動で作成
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;

      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const filename = hasName 
        ? `barcode-${options.name}-${barcodeData}.svg`
        : `barcode-${barcodeData}.svg`;
      link.download = filename;
      link.href = url;
      
      // リンクをDOMに追加してからクリック
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // PNG用にCanvasを使用してテキストも描画
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // 一時的なcanvasでバーコードサイズを取得
      const tempCanvas = document.createElement("canvas");
      JsBarcode(tempCanvas, barcodeData, {
        format: barcodeFormat,
        width: 1,
        height: 40,
        fontSize: 14,
        displayValue: true,
      });

      // 名前と備考がある場合の追加高さを計算
      const hasName = options.name && options.name.trim();
      const hasNote = options.note && options.note.trim();
      const additionalHeight = (hasName ? 25 : 0) + (hasNote ? 20 : 0) + (hasName || hasNote ? 10 : 0);
      
      // 最終canvasのサイズを設定
      canvas.width = Math.max(tempCanvas.width, 300);
      canvas.height = tempCanvas.height + additionalHeight;
      
      // 白い背景を描画
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // バーコードを中央に描画
        const barcodeX = (canvas.width - tempCanvas.width) / 2;
        ctx.drawImage(tempCanvas, barcodeX, 0);
        
        // 名前と備考を描画
        if (hasName || hasNote) {
          let textY = tempCanvas.height + 15;
          ctx.textAlign = "center";
          ctx.fillStyle = "black";
          
          if (hasName) {
            ctx.font = "bold 16px Arial";
            ctx.fillText(options.name, canvas.width / 2, textY);
            textY += 25;
          }
          
          if (hasNote) {
            ctx.font = "12px Arial";
            ctx.fillStyle = "#666666";
            ctx.fillText(options.note, canvas.width / 2, textY);
          }
        }
      }

      const link = document.createElement("a");
      const filename = hasName 
        ? `barcode-${options.name}-${barcodeData}.png`
        : `barcode-${barcodeData}.png`;
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.type = "image/png";
      
      // リンクをDOMに追加してからクリック
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("バーコード生成エラー:", error);
    alert("バーコードの生成に失敗しました。入力値を確認してください。");
  }
};
