"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocChatStore } from "@/lib/store";
import type { ModelChoice } from "@/lib/providers";

export function ModelPicker() {
  const model = useDocChatStore((s) => s.model);
  const setModel = useDocChatStore((s) => s.setModel);

  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-xs sm:block" style={{ color: "var(--foreground-2)" }}>
        Model
      </div>
      <Select value={model} onValueChange={(v) => setModel(v as ModelChoice)}>
        <SelectTrigger className="min-w-[180px] sm:min-w-[240px]">
          <SelectValue placeholder="Choose model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kimi">Kimi K2.6 - primary chat</SelectItem>
          <SelectItem value="deepseek">DeepSeek V4 Pro - compare</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
