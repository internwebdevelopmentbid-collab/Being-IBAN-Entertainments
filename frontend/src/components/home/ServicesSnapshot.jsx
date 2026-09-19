import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Reveal from "../ui/Reveal";

export default function ServicesSnapshot() {
  /* ==================================================
      API
  ================================================== */

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  /* ==================================================
      STATE
  ================================================== */

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==================================================
      GET IMAGE URL
  ================================================== */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // Supports:
    // images: ["https://..."]

    if (typeof image === "string") {
      return image;
    }

    // Supports:
    // images: [{ url: "...", publicId: "..." }]

    return image.url || "";
  };

  /* ==================================================
      FETCH ACTIVE SERVICES
  ================================================== */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/services/active`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch services");
        }

        setServices(data.services || []);
      } catch (error) {
        console.error("Fetch services snapshot error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  /* ==================================================
      LOADING
  ================================================== */

  if (loading) {
    return (
      <section className="bg-white px-6 py-20 text-black lg:px-10 lg:py-28">
        <div className="container-studio">
          <Reveal>
            <div className="mb-12 lg:mb-16">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
                What We Do
              </p>

              <h2 className="max-w-5xl font-display text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-8xl">
                One studio.
                <br />
                <span className="text-black/20">Every frame.</span>
              </h2>
            </div>
          </Reveal>

          <div className="flex min-h-[180px] items-center justify-center border-t border-black/20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-studio-red" />
          </div>
        </div>
      </section>
    );
  }

  /* ==================================================
      EMPTY
  ================================================== */

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-6 py-20 text-black lg:px-10 lg:py-28">
      <div className="container-studio">
        {/* ==================================================
            SECTION INTRO
        ================================================== */}

        <Reveal>
          <div className="mb-12 lg:mb-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
              What We Do
            </p>

            <h2 className="max-w-5xl font-display text-5xl font-black leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-8xl">
              One studio.
              <br />
              <span className="text-black/20">Every frame.</span>
            </h2>
          </div>
        </Reveal>

        {/* ==================================================
            SERVICES LIST
        ================================================== */}

        <div className="border-t border-black/20">
          {services.slice(0, 3).map((service, index) => {
            const imageUrl = service.images?.length
              ? getImageUrl(service.images[0])
              : "";

            return (
              <Reveal
                key={service._id || service.slug || service.title}
                delay={index * 0.08}
              >
                <Link
                  to="/services"
                  className="group relative grid grid-cols-12 items-center overflow-hidden border-b border-black/20 px-3 py-6 transition-all duration-500 hover:bg-black hover:text-white sm:px-5 sm:py-8 lg:py-9"
                >
                  {/* Red hover indicator */}

                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-0 bg-studio-red transition-all duration-500 group-hover:w-1"
                  />

                  {/* ==================================================
                      NUMBER
                  ================================================== */}

                  <span className="col-span-1 text-xs font-bold tracking-widest text-studio-red sm:col-span-1 sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* ==================================================
                      CONTENT
                  ================================================== */}

                  <div className="col-span-7 pr-3 sm:col-span-7 lg:col-span-8 lg:pr-8">
                    <h3 className="font-display text-xl font-black leading-[0.95] tracking-[-0.03em] text-studio-red transition-transform duration-500 group-hover:translate-x-1 sm:text-2xl md:text-3xl lg:text-4xl">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-black/45 transition-colors duration-500 group-hover:text-white/45 sm:mt-3 sm:text-sm">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* ==================================================
                      ARROW
                  ================================================== */}

                  <div className="col-span-1 flex justify-end">
                    <div className="flex h-9 w-9 items-center justify-center border border-black/20 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white group-hover:text-black sm:h-11 sm:w-11">
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.8}
                        className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* ==================================================
            ALL SERVICES CTA
        ================================================== */}

        {services.length > 3 && (
          <Reveal delay={0.2}>
            <Link
              to="/services"
              className="group mt-8 inline-flex items-center gap-3 border-b border-black pb-2 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:border-studio-red hover:text-studio-red"
            >
              See All Services
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
