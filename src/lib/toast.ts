import { toast } from "react-hot-toast";

const style = {
  borderRadius: "10px",
  background: "#fff",
  color: "#000",
};

export const Toast = {
  success: (msg: string) => toast.success(msg, { style }),
  error: (msg: string) => toast.error(msg, { style }),
  info: (msg: string) => toast(msg, { icon: "👏", style }),
};
