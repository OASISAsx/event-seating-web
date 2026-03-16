import {
  CheckCircle,
  CircleX,
  Clipboard,
  ClipboardClock,
  PersonStandingIcon,
  WatchIcon,
} from "lucide-react";
import { LoaderIcon } from "react-hot-toast";

type StatusCardProps = {
  title: string;
  seat: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  onClick?: () => void;
};

export default function StatusCard({
  title,
  seat,
  status,
  onClick,
}: StatusCardProps) {
  const isAvailable = status === "PENDING";

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer text-black shadow-md border  ${"bg-neutral-content"}`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          {title == "Pending" ? (
            <ClipboardClock color="gray" />
          ) : title == "Approved" ? (
            <CheckCircle color="green" />
          ) : (
            <CircleX color="red" />
          )}

          <div
            className={`badge ${isAvailable ? "badge-warning" : status === "CANCELLED" ? "badge-error" : "badge-success"}`}
          >
            {status}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{seat}</p>
        </div>
      </div>
    </div>
  );
}
