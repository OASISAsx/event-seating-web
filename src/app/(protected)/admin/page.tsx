import StatusCard from "../../components/StatusCard";
import DataTableRegistration from "./tableRegistruction";

export default async function AdminHome() {
  return (
    <div className="p-20">
      <div className="p-10 rounded-sx grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral">
        <StatusCard title="Workshop AI" seat={12} status="available" />

        <StatusCard title="Workshop Next.js" seat={0} status="full" />
      </div>
      <div>
        <DataTableRegistration />
      </div>
    </div>
  );
}
