// hooks/useRegistrationSocket.ts
import { useEffect } from "react";

import { socket } from "@/src/lib/socket";
import { useRegistration } from "@/store/registration.store";

export const useRegistrationSocket = () => {
  useEffect(() => {
    const { addRegistration } = useRegistration.getState();
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("registration_created", (data) => {
      addRegistration(data); // 🔥 realtime
    });

    return () => {
      socket.off("registration_created");
    };
  }, []);
};
