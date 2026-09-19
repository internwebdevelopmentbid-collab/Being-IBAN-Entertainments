import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

import Reveal from "../components/ui/Reveal";
import ClientLogos from "@/components/home/ClientLogos";

export default function Services() {
  /* ==================================================
      API
  ================================================== */

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  /* ==================================================
      STATE
  ================================================== */

  const [serviceShowcase, setServiceShowcase] = useState([]);

  const [activeService, setActiveService] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const [heroImage, setHeroImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==================================================
      GET IMAGE URL
  ================================================== */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (typeof image === "string") {
      return image;
    }

    return image.url || "";
  };

  /* ==================================================
      FETCH SERVICES
  ================================================== */

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/services/active`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch services");
        }

        setServiceShowcase(data.services || []);
      } catch (err) {
        console.error("Fetch services error:", err);

        setError(err.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  /* ==================================================
      FETCH SERVICES HERO IMAGE
  ================================================== */

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/media?page=services&type=cover`,
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch services hero image",
          );
        }

        if (data.data?.length > 0) {
          setHeroImage(data.data[0].url);
        }
      } catch (err) {
        console.error("Fetch services hero image error:", err);
      }
    };

    fetchHeroImage();
  }, [API_URL]);

  /* ==================================================
      CURRENT SERVICE
  ================================================== */

  const currentService = serviceShowcase[activeService];

  /* ==================================================
      RESET IMAGE WHEN SERVICE CHANGES
  ================================================== */

  useEffect(() => {
    setActiveImage(0);
  }, [activeService]);

  /* ==================================================
      AUTOMATIC IMAGE SLIDER
  ================================================== */

  useEffect(() => {
    if (!currentService?.images?.length) {
      return;
    }

    if (currentService.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImage((current) => {
        return (current + 1) % currentService.images.length;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activeService, currentService?.images?.length]);

  /* ==================================================
      LOADING
  ================================================== */

  if (loading) {
    return (
      <>
        <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-studio-black px-6 pb-16 pt-28 sm:min-h-[65vh] lg:min-h-[70vh] lg:px-10 lg:pb-20 lg:pt-32">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Being Iban Entertainments Studio"
              className="h-full w-full object-cover object-center opacity-50"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="container-studio relative z-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
              Capabilities
            </p>

            <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-9xl">
              End-to-end
              <br />
              <span className="text-white/30">creative.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[12px] leading-6 text-white/60 sm:mt-8 sm:text-base sm:leading-relaxed">
              From the first idea to the final delivery, our multidisciplinary
              team brings creative, production and technology together.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-16 text-black lg:px-10 lg:py-20">
          <div className="container-studio flex min-h-[240px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-black/10 border-t-studio-red" />

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-black/50">
                Loading services...
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ==================================================
      ERROR
  ================================================== */

  if (error) {
    return (
      <>
        <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-studio-black px-6 pb-16 pt-28 sm:min-h-[65vh] lg:min-h-[70vh] lg:px-10 lg:pb-20 lg:pt-32">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Being Iban Entertainments Studio"
              className="h-full w-full object-cover object-center opacity-50"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="container-studio relative z-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
              Capabilities
            </p>

            <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-9xl">
              End-to-end
              <br />
              <span className="text-white/30">creative.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[12px] leading-6 text-white/60 sm:mt-8 sm:text-base sm:leading-relaxed">
              From the first idea to the final delivery, our multidisciplinary
              team brings creative, production and technology together.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-16 text-black lg:px-10 lg:py-20">
          <div className="container-studio">
            <div className="border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-studio-red">
                Services
              </p>

              <h2 className="mt-3 font-display text-3xl font-black">
                Unable to load services
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-black/50">
                {error}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ==================================================
      EMPTY
  ================================================== */

  if (serviceShowcase.length === 0) {
    return (
      <>
        <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-studio-black px-6 pb-16 pt-28 sm:min-h-[65vh] lg:min-h-[70vh] lg:px-10 lg:pb-20 lg:pt-32">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Being Iban Entertainments Studio"
              className="h-full w-full object-cover object-center opacity-50"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="container-studio relative z-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
              Capabilities
            </p>

            <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-9xl">
              End-to-end
              <br />
              <span className="text-white/30">creative.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[12px] leading-6 text-white/60 sm:mt-8 sm:text-base sm:leading-relaxed">
              From the first idea to the final delivery, our multidisciplinary
              team brings creative, production and technology together.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-16 text-black lg:px-10 lg:py-20">
          <div className="container-studio">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-studio-red">
              Services
            </p>

            <h2 className="mt-3 font-display text-4xl font-black">
              No services available.
            </h2>

            <p className="mt-4 max-w-xl text-black/50">
              There are currently no active services to display.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-studio-black px-6 pb-16 pt-28 sm:min-h-[65vh] lg:min-h-[70vh] lg:px-10 lg:pb-20 lg:pt-32">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Being Iban Entertainments Studio"
            className="h-full w-full object-cover object-center opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container-studio relative z-10">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
            Capabilities
          </p>

          <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-9xl">
            End-to-end
            <br />
            <span className="text-white/30">creative.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[12px] leading-6 text-white/60 sm:mt-8 sm:text-base sm:leading-relaxed">
            From the first idea to the final delivery, our multidisciplinary
            team brings creative, production and technology together.
          </p>
        </div>
      </section>

      <ClientLogos />

      {/* ==================================================
          SERVICE SHOWCASE
      ================================================== */}

      <section className="bg-studio-black px-6 py-20 lg:px-10 lg:py-28">
        <div className="container-studio">
          <Reveal>
            <div className="max-w-4xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
                Explore Our Expertise
              </p>

              <h2 className="font-display text-5xl font-black leading-[0.88] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
                Built for
                <br />
                <span className="text-white/25">every story.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/45 sm:text-lg">
                Explore our core creative capabilities and discover how we
                approach different forms of storytelling, production and visual
                communication.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid border-t border-white/10 lg:grid-cols-4">
            {serviceShowcase.map((service, index) => {
              const active = activeService === index;

              return (
                <button
                  key={service._id || service.slug || service.title}
                  type="button"
                  onClick={() => setActiveService(index)}
                  className={`group relative border-b border-white/10 p-6 text-left transition-all duration-500 lg:min-h-[240px] lg:border-b-0 lg:border-r lg:p-7 ${
                    active
                      ? "bg-white text-black"
                      : "bg-transparent text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`font-display text-sm font-black ${
                      active
                        ? "text-studio-red"
                        : "text-white/25 group-hover:text-studio-red"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3
                    className={`mt-12 max-w-xs font-display text-2xl font-black leading-[0.95] tracking-[-0.03em] md:text-3xl ${
                      active ? "text-black" : "text-white"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={`mt-4 max-w-xs text-sm leading-relaxed ${
                      active ? "text-black/50" : "text-white/35"
                    }`}
                  >
                    {service.shortDescription}
                  </p>

                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-studio-red transition-all duration-500 ${
                      active ? "w-full" : "w-0 group-hover:w-1/2"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {currentService && (
            <Reveal key={activeService} delay={0.05}>
              <div className="mt-5 overflow-hidden border border-white/10 bg-white/[0.03]">
                <div className="grid lg:grid-cols-12">
                  <div className="flex flex-col justify-between p-7 md:p-10 lg:col-span-5 lg:p-11">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-studio-red">
                        {String(activeService + 1).padStart(2, "0")} /
                        Capability
                      </p>

                      <h3 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[0.9] tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
                        {currentService.showcaseTitle || currentService.title}
                      </h3>

                      <p className="mt-6 text-base leading-relaxed text-white/45 md:text-lg">
                        {currentService.description}
                      </p>

                      {currentService.brochure && (
                        <a
                          href={currentService.brochure}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-6 inline-flex items-center justify-center gap-3 border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-studio-red hover:bg-studio-red"
                        >
                          <Download
                            size={17}
                            strokeWidth={1.8}
                            className="transition-transform duration-300 group-hover:translate-y-0.5"
                          />

                          <span>Download Brochure</span>
                        </a>
                      )}
                    </div>

                    {currentService.features?.length > 0 && (
                      <div className="mt-10">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white/30">
                          What We Offer
                        </p>

                        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                          {currentService.features.map((feature, index) => (
                            <div
                              key={feature}
                              className="flex items-start gap-3 border-b border-white/10 pb-2.5"
                            >
                              <span className="mt-1 text-xs font-bold text-studio-red">
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              <span className="text-sm text-white/65">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative min-h-[400px] overflow-hidden bg-black lg:col-span-7 lg:min-h-[600px]">
                    {currentService.images?.length > 0 ? (
                      currentService.images.map((image, index) => {
                        const imageUrl = getImageUrl(image);

                        if (!imageUrl) {
                          return null;
                        }

                        return (
                          <img
                            key={`${imageUrl}-${index}`}
                            src={imageUrl}
                            alt={`${currentService.title} ${index + 1}`}
                            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                              activeImage === index
                                ? "scale-100 opacity-100"
                                : "scale-105 opacity-0"
                            }`}
                            onError={() => {
                              console.error(
                                "Failed to load service image:",
                                imageUrl,
                              );
                            }}
                          />
                        );
                      })
                    ) : (
                      <div className="flex h-full min-h-[400px] items-center justify-center">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                          No images available
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                    {currentService.images?.length > 0 && (
                      <div className="absolute left-6 top-6 border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-md">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                          Selected Frames
                        </span>
                      </div>
                    )}

                    {currentService.images?.length > 0 && (
                      <div className="absolute bottom-6 right-6 flex items-center gap-3">
                        <span className="text-xs font-bold text-white">
                          {String(activeImage + 1).padStart(2, "0")}
                        </span>

                        <span className="h-px w-10 bg-white/30" />

                        <span className="text-xs font-bold text-white/40">
                          {String(currentService.images.length).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>
                    )}

                    {currentService.images?.length > 0 && (
                      <div className="absolute bottom-6 left-6 flex max-w-[60%] gap-2 overflow-x-auto">
                        {currentService.images.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            aria-label={`Show image ${index + 1}`}
                            onClick={() => setActiveImage(index)}
                            className={`h-1 shrink-0 transition-all duration-500 ${
                              activeImage === index
                                ? "w-10 bg-studio-red"
                                : "w-4 bg-white/30 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ==================================================
          CONTACT CTA
      ================================================== */}

      <section className="relative overflow-hidden bg-white px-6 py-20 lg:px-10 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -top-48 h-[550px] w-[550px] rounded-full bg-red-600/[0.06] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-red-600/[0.04] blur-3xl"
        />

        <div className="container-studio relative">
          <div className="max-w-5xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
              Have a project in mind?
            </p>

            <h2 className="font-display text-5xl font-black leading-[0.88] tracking-[-0.05em] text-black md:text-7xl lg:text-8xl">
              Let&apos;s
              <br />
              <span className="text-black/25">get in touch.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/50 sm:text-lg">
              Tell us about your idea, your project, or simply what you&apos;re
              looking to create. We&apos;d love to hear from you.
            </p>

            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-5 border border-black bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-studio-red hover:bg-studio-red"
            >
              <span>Start a Conversation</span>

              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          PROCESS
      ================================================== */}

      <section className="bg-studio-black px-6 py-20 lg:px-10 lg:py-28">
        <div className="container-studio">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
            Our Process
          </p>

          <h2 className="font-display text-5xl font-black leading-[0.9] tracking-[-0.03em] text-white md:text-7xl">
            From idea
            <br />
            <span className="text-white/30">to impact.</span>
          </h2>

          <div className="mt-14 grid border-t border-white/10 md:grid-cols-5">
            {["Discover", "Concept", "Produce", "Post", "Deliver"].map(
              (step, index) => (
                <div
                  key={step}
                  className="group border-b border-white/10 p-6 transition-colors duration-300 hover:bg-white/[0.03] md:border-r"
                >
                  <span className="font-display text-lg font-black text-studio-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-9 font-display text-2xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1">
                    {step}
                  </h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
