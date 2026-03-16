"use client";
import { useRegistration } from "@/store/registration.store";
import StatusCard from "../../components/StatusCard";
import DataTableRegistration from "./tableRegistruction";
import Navbar from "../../components/NavBar";

export default function AdminHome() {
  const { setStatus, mainStatus } = useRegistration();
  console.log("🚀 ~ file: page.tsx:8 ~ AdminHome ~ mainStatus:", mainStatus);
  return (
    <div className="justify-center items-center min-h-screen flex flex-col gap-10 ">
      <Navbar />
      <div className="bg-base-300 rounded-2xl">
        <div className="p-10 rounded-sx grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <StatusCard
            title="Pending"
            seat={mainStatus?.PENDING?.status || 0}
            status="PENDING"
            onClick={() => setStatus("PENDING")}
          />

          <StatusCard
            title="Approved"
            seat={mainStatus?.CONFIRMED?.status || 0}
            status="CONFIRMED"
            onClick={() => setStatus("CONFIRMED")}
          />
        </div>
        <DataTableRegistration />
      </div>
    </div>
  );
}
