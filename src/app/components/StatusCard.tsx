type StatusCardProps = {
  title: string;
  seat: number;
  status: "available" | "full";
};

export default function StatusCard({ title, seat, status }: StatusCardProps) {
  const isAvailable = status === "available";

  return (
    <div
      className={`card text-white shadow-md border ${
        isAvailable ? "border-success" : "border-error"
      }`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-base">{title}</h2>

          <div
            className={`badge ${isAvailable ? "badge-success" : "badge-error"}`}
          >
            {isAvailable ? "Available" : "Full"}
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
