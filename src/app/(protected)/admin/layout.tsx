import { Toaster } from "react-hot-toast";
import Navbar from "../../components/NavBar";

export default function AddminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
