"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTableUser } from "./dataTableUser";

export default function EventPage() {
  const router = useRouter();

  return (
    <div className=" min-h-screen bg-base-200">
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/seat_event.png)",
        }}
      >
        <div className="hero-overlay"></div>

        <div className="text-neutral-content text-center">
          <div className="max-w-md">
            <p className=" mb-5 text-5xl font-bold">SEAT EVENT</p>

            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button
              onClick={() => router.push("/user/eventRegistration")}
              className="text-1xl btn btn-primary"
            >
              Register
            </button>

            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
              <DataTableUser />
            </div>
          </div>
        </div>
      </div>
      <div className="hero"></div>
    </div>
  );
}
