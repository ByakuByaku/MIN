export interface User {
  id: string;
  nick: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string;
}