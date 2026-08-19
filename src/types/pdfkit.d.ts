declare module "pdfkit" {
  import { Stream } from "stream";
  class PDFDocument extends Stream {
    constructor(options?: Record<string, unknown>);
    addPage(options?: Record<string, unknown>): PDFDocument;
    text(text: string, x?: number, y?: number, options?: Record<string, unknown>): PDFDocument;
    fontSize(size: number): PDFDocument;
    fillColor(color: string): PDFDocument;
    strokeColor(color: string): PDFDocument;
    stroke(): PDFDocument;
    moveTo(x: number, y: number): PDFDocument;
    lineTo(x: number, y: number): PDFDocument;
    rect(x: number, y: number, w: number, h: number): PDFDocument;
    fill(color?: string): PDFDocument;
    end(): void;
    on(event: string, callback: (chunk: Buffer) => void): this;
  }
  export default PDFDocument;
}
