export interface Barcode {
  text: string;
  type: string;
}

export interface BarcodeSet {
  id: string;
  name: string;
  barcodes: Barcode[];
  createdAt: string;
}
