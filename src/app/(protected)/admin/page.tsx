"use client";
import { useRegistration } from "@/store/registration.store";
import StatusCard from "../../components/StatusCard";
import DataTableRegistration from "./tableRegistruction";

export default function AdminHome() {
  const { setSearch } = useRegistration();

  return (
    <div className="justify-center items-center min-h-screen flex flex-col gap-10 ">
      <div>
        <div className="p-10 rounded-sx grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <StatusCard
            title="Pending"
            seat={20}
            status="PENDING"
            onClick={() => setSearch("PENDING")}
          />

          <StatusCard
            title="Confirmed"
            seat={10}
            status="CONFIRMED"
            onClick={() => setSearch("CONFIRMED")}
          />
        </div>
        <DataTableRegistration />
      </div>
    </div>
  );
}
