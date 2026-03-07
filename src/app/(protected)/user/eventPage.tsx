"use client";
import { useRouter } from "next/navigation";
import { DataTableUser } from "./dataTableUser";

export default function EventPage() {
  const router = useRouter();

  return (
    <>
      <div className="ep-root">
        {/* ── Hero ── */}
        <section className="ep-hero">
          <div className="ep-bg" />
          <div className="ep-overlay-1" />
          <div className="ep-overlay-2" />

          <div className="ep-content">
            {/* badge */}
            <div className="ep-badge">
              <span className="ep-badge-dot" />
              Grand Showcase · 2026
            </div>

            {/* title */}
            <h1 className="ep-title">
              SEAT
              <br />
              <span className="ep-title-accent">EVENT</span>
            </h1>

            {/* sub */}
            <p className="ep-sub">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>

            {/* CTA */}
            <button
              className="ep-btn"
              onClick={() => router.push("/user/eventRegistration")}
            >
              <span>Register Now</span>
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* scroll hint */}
          <div className="ep-scroll">
            <div className="ep-scroll-line" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ── Data Table Section ── */}
        <section className="ep-section">
          <div className="ep-section-inner">
            <div className="ep-section-label">
              <span className="ep-section-pill text-xs sm:text-sm md:text-base">
                ผู้เข้าร่วม
              </span>

              <h2 className="ep-section-title text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                รายชื่อผู้ลงทะเบียน
              </h2>
            </div>

            <div className="ep-table-wrap">
              <DataTableUser />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
