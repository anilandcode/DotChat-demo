import { create } from "zustand";
import type { Message } from "./types";
import type { ModelChoice } from "./providers";

type StoreState = {
  activeDocumentId: string | null;
  model: ModelChoice;
  messages: Message[];
  setActiveDocumentId: (id: string | null) => void;
  setModel: (model: ModelChoice) => void;
  addMessage: (m: Message) => void;
  clearMessages: () => void;
};

export const useDocChatStore = create<StoreState>((set) => ({
  activeDocumentId: null,
  model: "kimi",
  messages: [],
  setActiveDocumentId: (id) => set({ activeDocumentId: id }),
  setModel: (model) => set({ model }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  clearMessages: () => set({ messages: [] }),
}));
