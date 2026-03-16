type StatusCardProps = {
  title: string;
  seat: number;
  status: "PENDING" | "CONFIRMED";
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
      className={`card cursor-pointer text-black shadow-md border  ${
        isAvailable ? "bg-warning" : "bg-success"
      }`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-base">{title}</h2>

          <div
            className={`badge ${isAvailable ? "badge-warning" : "badge-success"}`}
          >
            {status}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-500">Seats</p>
          <p className="text-2xl font-bold">{seat}</p>
        </div>
      </div>
    </div>
  );
}
