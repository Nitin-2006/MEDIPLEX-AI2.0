export interface DbUser {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Disease {
  id: number;
  name: string;
  overview: string;
  aliases: string[];
  symptoms: string[];
  prevention: string[];
  warning: string;
  isCustom: boolean;
  createdAt: string;
}

export interface Medicine {
  id: number;
  name: string;
  use: string;
  safety: string;
  createdAt: string;
}

export interface SupportMessage {
  id: number;
  name: string;
  email?: string | null;
  text: string;
  status: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  uid?: string | null;
  sender: "user" | "bot";
  text: string;
  createdAt: string;
}
