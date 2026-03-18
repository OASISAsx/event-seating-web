"use client";
import { useEvent } from "@/store/event.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import DialogCreate from "./dialogCreate";
import { Events } from "@/types/event.interface";
import Skeleton from "@/src/app/components/Skeleton";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventPage() {
  const { events, fetchEvent, loading } = useEvent();
  const [isOpen, setIsOpen] = useState(false);
  const [itemSelect, setItemSelect] = useState<Events | null>(null);
  const route = useRouter();
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const selectItem = (item: Events) => {
    if (item) {
      setItemSelect(item);
      setIsOpen(true);
    }
  };

  return (
    <div className="p-4 font-bold">
      <button className="btn btn-base-content btn-sm rounded-3xl">
        <MoveLeft size={20} onClick={() => route.push("/")} />
      </button>

      <div className="divider text-3xl font-bold tracking-wide text-primary">
        <h1 className="text-3xl font-semibold">
          <span className="badge badge-xl badge-neutral"> Event List</span>
        </h1>
      </div>
      {loading && <Skeleton />}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((item) => (
          <div key={item.id} className="card bg-neutral-content shadow-sm">
            <figure className="relative h-88">
              <Image
                src="/seat_event.png"
                alt="seat_event"
                fill
                className="object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title text-black">{item.name}</h2>

              <p className="text-gray-600">{item.description}</p>

              <div className="card-actions justify-end">
                <button
                  onClick={() => selectItem(item)}
                  className="btn btn-primary rounded-3xl "
                >
                  Select Event
                </button>
              </div>
            </div>
          </div>
        ))}
        <DialogCreate
          fetchData={itemSelect}
          dialog={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}
