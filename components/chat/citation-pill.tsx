"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CitationPill(props: {
  filename: string;
  page: number | null;
  snippet: string;
}) {
  const { filename, page, snippet } = props;

  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className="editorial-label rounded-none border px-2.5 py-1 transition-colors duration-150 hover:border-[var(--black)]"
        style={{
          background: "var(--accent-soft)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
      >
        {page ? `Page ${page}` : "Source"} / {filename}
      </PopoverTrigger>
      <PopoverContent className="w-[min(360px,calc(100vw-32px))]">
        <div className="space-y-2">
          <div className="text-xs" style={{ color: "var(--foreground-2)" }}>
            {filename} {page ? `- page ${page}` : ""}
          </div>
          <div className="text-sm whitespace-pre-wrap">{snippet}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
