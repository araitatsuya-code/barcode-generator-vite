import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { Barcode } from "../types";

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

export const saveBarcodesPDF = (barcodes: Barcode[]) => {
  // 有効なバーコードのみをフィルタリング
  const validBarcodes = barcodes.filter(barcode => barcode.text.trim());
  
  if (validBarcodes.length === 0) {
    alert("出力するバーコードがありません。");
    return;
  }

  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;
    
    // バーコード数に応じてサイズを調整
    const barcodeCount = validBarcodes.length;
    const availableHeight = pageHeight - (margin * 2);
    
    // 1個なら大きく、複数なら小さく調整
    let barcodeHeight: number;
    let barcodeWidth: number;
    let fontSize: number;
    let canvasHeight: number;
    let canvasWidth: number;
    
    if (barcodeCount === 1) {
      // 1個の場合は大きめに
      barcodeHeight = 80;
      barcodeWidth = 160;
      fontSize = 18;
      canvasHeight = 100;
      canvasWidth = 3;
    } else if (barcodeCount <= 3) {
      // 2-3個の場合は中サイズ
      barcodeHeight = 60;
      barcodeWidth = 140;
      fontSize = 16;
      canvasHeight = 80;
      canvasWidth = 2.5;
    } else {
      // 4個以上の場合は小さめに
      barcodeHeight = 45;
      barcodeWidth = 120;
      fontSize = 14;
      canvasHeight = 60;
      canvasWidth = 2;
    }
    
    const textHeight = 25;
    const itemSpacing = barcodeCount === 1 ? 20 : (barcodeCount <= 3 ? 15 : 10);
    const totalItemHeight = barcodeHeight + textHeight + itemSpacing;

    validBarcodes.forEach((barcode, index) => {
      // 新しいページが必要かチェック
      if (currentY + totalItemHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      // バーコードタイプの変換
      const barcodeFormat = barcode.type
        ? barcodeTypeMap[barcode.type]
        : "code128";

      // 一時的なcanvasでバーコードを生成
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcode.text, {
        format: barcodeFormat,
        width: canvasWidth,
        height: canvasHeight,
        fontSize: fontSize,
        displayValue: true,
      });

      // バーコードをPDFに追加
      const barcodeDataURL = canvas.toDataURL("image/png");
      const barcodeX = (pageWidth - barcodeWidth) / 2;
      
      pdf.addImage(barcodeDataURL, "PNG", barcodeX, currentY, barcodeWidth, barcodeHeight);
      currentY += barcodeHeight + 5;

      // 名前と備考を追加（フォントサイズも調整）
      const nameFontSize = barcodeCount === 1 ? 14 : (barcodeCount <= 3 ? 12 : 10);
      const noteFontSize = barcodeCount === 1 ? 12 : (barcodeCount <= 3 ? 10 : 8);
      
      if (barcode.name && barcode.name.trim()) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(nameFontSize);
        pdf.text(barcode.name, pageWidth / 2, currentY, { align: "center" });
        currentY += barcodeCount === 1 ? 10 : 8;
      }

      if (barcode.note && barcode.note.trim()) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(noteFontSize);
        pdf.text(barcode.note, pageWidth / 2, currentY, { align: "center" });
        currentY += barcodeCount === 1 ? 10 : 8;
      }

      currentY += itemSpacing;
    });

    // PDFを保存
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    pdf.save(`barcodes-${timestamp}.pdf`);
  } catch (error) {
    console.error("PDF生成エラー:", error);
    alert("PDFの生成に失敗しました。");
  }
};
