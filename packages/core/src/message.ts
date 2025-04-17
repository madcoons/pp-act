import type { MessageAction } from "./message-action.js";

export interface Message {
  id: string;
  actions: MessageAction[];
}
