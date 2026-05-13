declare module "pdf-parse" {
  type PdfParseResult = {
    numpages?: number;
    text?: string;
  };

  type PdfPageData = {
    getTextContent: (options: {
      normalizeWhitespace: boolean;
      disableCombineTextItems: boolean;
    }) => Promise<{ items: Array<{ str?: string; transform?: number[] }> }>;
  };

  type PdfParseOptions = {
    pagerender?: (pageData: PdfPageData) => Promise<string>;
    max?: number;
    version?: string;
  };

  export default function pdfParse(buffer: Buffer, options?: PdfParseOptions): Promise<PdfParseResult>;
}
