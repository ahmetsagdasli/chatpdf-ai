export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Document {
  id: string;
  name: string;
  content: string;
}