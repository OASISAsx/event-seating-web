import { io } from "socket.io-client";
import { getSocketBaseUrl } from "@/src/lib/socket-url";

export const socket = io(getSocketBaseUrl(), {
  transports: ["polling", "websocket"],
});
