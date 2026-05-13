export type ParsedPdf = {
  pages: Array<{ page: number; text: string }>;
  totalPages: number;
};

export async function parsePdf(buffer: Buffer): Promise<ParsedPdf> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  try {
    const textResult = await parser.getText();
    const pages = textResult.pages
      .map((p) => ({ page: p.num, text: (p.text ?? "").replace(/\r\n/g, "\n").trim() }))
      .filter((p) => p.text.length > 0);

    return { pages, totalPages: textResult.total || pages.length || 1 };
  } finally {
    await parser.destroy();
  }
}
