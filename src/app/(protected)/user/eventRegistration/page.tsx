"use client";
import { useEvent } from "@/store/event.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import DialogCreate from "./dialogCreate";

export default function EventPage() {
  const { events, fetchEvent, loading } = useEvent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return (
    <div className="p-10 font-bold">
      <div className="divider text-3xl">Event List</div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <span className="loading loading-ring loading-xl"></span>}

        {events.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-sm">
            <figure className="relative h-88">
              <Image
                src="/seat_event.png"
                alt="Shoes"
                fill
                className="object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>

              <p>{item.description}</p>

              <div className="card-actions justify-end">
                <button
                  onClick={() => setIsOpen(true)}
                  className="btn btn-primary"
                >
                  Register Event
                </button>
              </div>
            </div>
            <DialogCreate
              fetchData={item}
              dialog={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
