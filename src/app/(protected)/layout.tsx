import { Toaster } from "react-hot-toast";
import Navbar from "../components/NavBar";
import { useSession } from "next-auth/react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" />

      {children}
    </>
  );
}
