import { io } from "socket.io-client";
import { getSocketBaseUrl, getSocketPath } from "@/src/lib/socket-url";

export const socket = io(getSocketBaseUrl(), {
  path: getSocketPath(),
  transports: ["websocket"],
  withCredentials: true,
});
