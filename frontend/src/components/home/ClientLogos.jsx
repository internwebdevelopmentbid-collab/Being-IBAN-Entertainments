import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_URL = "/api/sponsors/active";

export default function ClientLogos() {
  const [sponsors, setSponsors] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch sponsors.");
        }

        setSponsors(result.sponsors || []);
      } catch (error) {
        console.error("Failed to load sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, []);

  if (loading || sponsors.length === 0) {
    return null;
  }

  const scrollingSponsors = [...sponsors, ...sponsors];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-studio-black py-14 sm:py-16 lg:py-20">
      {/* =========================================================
          TOP FILM PERFORATIONS
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex h-5 items-start justify-around overflow-hidden opacity-20"
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <span
            key={`top-${index}`}
            className="mt-1.5 h-2 w-4 shrink-0 rounded-[1px] bg-white sm:h-2.5 sm:w-5"
          />
        ))}
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="container-studio relative z-10">
        <div className="mb-10 px-6 sm:mb-12 lg:px-10">
          <p className="flex items-center justify-center gap-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/35 sm:text-xs">
            <span className="h-px w-8 bg-studio-red sm:w-12" />
            Supported Brand Partners
            <span className="h-px w-8 bg-studio-red sm:w-12" />
          </p>
        </div>
      </div>

      {/* =========================================================
          FILM STRIP
      ========================================================= */}

      <div className="relative">
        {/* LEFT FADE */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 bg-gradient-to-r from-studio-black via-studio-black/80 to-transparent sm:w-28 lg:w-48"
        />

        {/* RIGHT FADE */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-studio-black via-studio-black/80 to-transparent sm:w-28 lg:w-48"
        />

        {/* =====================================================
            MOVING TRACK
        ===================================================== */}

        <motion.div
          className="flex w-max items-center"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {scrollingSponsors.map((sponsor, index) => {
            const website = sponsor.website?.trim();

            const logo = sponsor.logo?.url;

            /*
             * Each sponsor is rendered as a clickable link
             * when a website exists in the database.
             */

            return (
              <div
                key={`${sponsor._id}-${index}`}
                className="group relative flex h-28 w-44 shrink-0 items-center justify-center border-r border-white/[0.06] px-6 sm:h-32 sm:w-56 sm:px-8 lg:h-36 lg:w-64"
              >
                {/* TOP LINE */}

                <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-white/[0.04]" />

                {/* BOTTOM LINE */}

                <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-white/[0.04]" />

                {/* =================================================
                    SPONSOR LINK
                ================================================= */}

                {website && logo ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${sponsor.name} website`}
                    className="flex h-full w-full items-center justify-center outline-none"
                  >
                    <img
                      src={logo}
                      alt={sponsor.name}
                      className="
                        max-h-10
                        max-w-[125px]
                        object-contain
                        opacity-30
                        grayscale
                        transition-all
                        duration-500
                        ease-out
                        group-hover:scale-105
                        group-hover:opacity-100
                        group-hover:grayscale-0
                        sm:max-h-12
                        sm:max-w-[150px]
                        lg:max-h-14
                        lg:max-w-[175px]
                      "
                    />
                  </a>
                ) : logo ? (
                  /*
                   * If no website is stored in the database,
                   * show the logo normally but don't make it clickable.
                   */

                  <img
                    src={logo}
                    alt={sponsor.name}
                    className="
                      max-h-10
                      max-w-[125px]
                      object-contain
                      opacity-30
                      grayscale
                      transition-all
                      duration-500
                      ease-out
                      group-hover:scale-105
                      group-hover:opacity-100
                      group-hover:grayscale-0
                      sm:max-h-12
                      sm:max-w-[150px]
                      lg:max-h-14
                      lg:max-w-[175px]
                    "
                  />
                ) : null}

                {/* =================================================
                    HOVER FRAME
                ================================================= */}

                <span className="pointer-events-none absolute inset-2 border border-studio-red/0 transition-all duration-500 group-hover:border-studio-red/30" />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* =========================================================
          BOTTOM FILM PERFORATIONS
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex h-5 items-end justify-around overflow-hidden opacity-20"
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <span
            key={`bottom-${index}`}
            className="mb-1.5 h-2 w-4 shrink-0 rounded-[1px] bg-white sm:h-2.5 sm:w-5"
          />
        ))}
      </div>
    </section>
  );
}
