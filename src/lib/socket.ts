// lib/socket.ts
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API_URL_SOCKET, {
  transports: ["websocket"], // ลด fallback polling
});
