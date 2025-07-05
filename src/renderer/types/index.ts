export interface Barcode {
  text: string;
  type: string;
  name?: string;  // バーコードの名前（オプション）
  note?: string;  // バーコードの備考（オプション）
}

export interface BarcodeSet {
  id: string;
  name: string;
  barcodes: Barcode[];
  createdAt: string;
}
