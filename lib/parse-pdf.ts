export type ParsedPdf = {
  pages: Array<{ page: number; text: string }>;
  totalPages: number;
};

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

type PdfParse = (
  buffer: Buffer,
  options?: {
    pagerender?: (pageData: PdfPageData) => Promise<string>;
  },
) => Promise<PdfParseResult>;

function renderPage(pageData: PdfPageData) {
  return pageData
    .getTextContent({
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    })
    .then((textContent) => {
      let lastY: number | undefined;
      let text = "";

      for (const item of textContent.items) {
        const y = item.transform?.[5];
        const value = item.str ?? "";
        text += lastY === undefined || y === lastY ? value : `\n${value}`;
        lastY = y;
      }

      return text.trim();
    });
}

export async function parsePdf(buffer: Buffer): Promise<ParsedPdf> {
  const mod = await import("pdf-parse");
  const pdfParse = (mod.default ?? mod) as PdfParse;
  const pages: ParsedPdf["pages"] = [];

  const result = await pdfParse(buffer, {
    pagerender: async (pageData) => {
      const text = (await renderPage(pageData)).replace(/\r\n/g, "\n").trim();
      pages.push({ page: pages.length + 1, text });
      return text;
    },
  });

  const cleanPages = pages.filter((p) => p.text.length > 0);
  if (cleanPages.length) return { pages: cleanPages, totalPages: result.numpages || cleanPages.length };

  const fallback = (result.text ?? "").replace(/\r\n/g, "\n").trim();
  return {
    pages: fallback ? [{ page: 1, text: fallback }] : [],
    totalPages: result.numpages || 1,
  };
}
