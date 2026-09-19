import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import Reveal from "../components/ui/Reveal";
import ClientLogos from "../components/home/ClientLogos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "All",
  "Film",
  "Commercial",
  "Music Video",
  "Branded Content",
  "Animation",
];

const reviews = [
  {
    quote:
      "The team understood our vision from day one and transformed the idea into something far beyond what we imagined. The entire production felt professional, creative, and effortless.",
    name: "Aarav Mehta",
    role: "Brand Director",
    company: "Creative Brand",
    rating: 5,
  },
  {
    quote:
      "Working with Being Iban Entertainments was an incredible experience. Their attention to detail, cinematic approach, and commitment to the project really stood out.",
    name: "Riya Sen",
    role: "Content Producer",
    company: "Independent Production",
    rating: 5,
  },
  {
    quote:
      "From pre-production to the final delivery, the team was responsive, collaborative, and extremely creative. They brought a fresh perspective to our campaign.",
    name: "Kabir Sharma",
    role: "Marketing Head",
    company: "Lifestyle Brand",
    rating: 5,
  },
  {
    quote:
      "What impressed us most was their ability to balance creativity with production discipline. Every frame felt intentional and the final film looked incredibly polished.",
    name: "Ananya Roy",
    role: "Creative Lead",
    company: "Media Studio",
    rating: 5,
  },
];

const createSlug = (project) => {
  if (project.slug) {
    return project.slug;
  }

  return project.title
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const [activeGallery, setActiveGallery] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /*
   * =========================================================
   * BACKEND PROJECT DATA
   * =========================================================
   */

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  /*
   * =========================================================
   * BACKEND MEDIA DATA
   *
   * Portfolio media comes from:
   *
   * GET /api/media?page=portfolio
   *
   * type:
   * - cover
   * - gallery
   * =========================================================
   */

  const [portfolioMedia, setPortfolioMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [mediaError, setMediaError] = useState("");

  /*
   * =========================================================
   * FETCH PROJECTS
   * =========================================================
   */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const response = await fetch(`${API_URL}/api/projects`);

        const result = await response.json();

        console.log("Portfolio projects response:", result);

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch projects");
        }

        if (!result.success) {
          throw new Error(result?.message || "Failed to fetch projects");
        }

        /*
         * Backend:
         *
         * project.coverImage.url
         * project.projectLink
         *
         * Existing Portfolio UI:
         *
         * project.image
         * project.link
         *
         * Keep the existing UI working by mapping the
         * backend response.
         */

        const formattedProjects = (result.projects || [])
          .filter((project) => project.status === "published")
          .map((project) => ({
            ...project,

            id: project._id,

            image: project.coverImage?.url || "",

            link: project.projectLink?.trim() || `/portfolio/${project.slug}`,

            slug: createSlug(project),
          }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Portfolio projects error:", error);

        setProjects([]);
        setProjectsError(error.message || "Unable to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  /*
   * =========================================================
   * FETCH PORTFOLIO MEDIA
   * =========================================================
   */

  useEffect(() => {
    const fetchPortfolioMedia = async () => {
      try {
        setLoadingMedia(true);
        setMediaError("");

        const response = await fetch(`${API_URL}/api/media?page=portfolio`);

        const result = await response.json();

        console.log("Portfolio media response:", result);

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch portfolio media");
        }

        if (!result.success) {
          throw new Error(result?.message || "Failed to fetch portfolio media");
        }

        /*
         * The controller should return:
         *
         * {
         *   success: true,
         *   media: [...]
         * }
         *
         * Keep support for data.media as well so the
         * frontend remains tolerant of the response shape.
         */

        const media = Array.isArray(result.media)
          ? result.media
          : Array.isArray(result.data)
            ? result.data
            : [];

        setPortfolioMedia(
          media.filter(
            (item) =>
              item && item.active !== false && item.page === "portfolio",
          ),
        );
      } catch (error) {
        console.error("Portfolio media error:", error);

        setPortfolioMedia([]);
        setMediaError(error.message || "Unable to load portfolio media");
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchPortfolioMedia();
  }, []);

  /*
   * =========================================================
   * PORTFOLIO COVER IMAGE
   * =========================================================
   */

  const portfolioCover = useMemo(() => {
    return portfolioMedia.find((item) => item.type === "cover");
  }, [portfolioMedia]);

  /*
   * =========================================================
   * PORTFOLIO GALLERY
   * =========================================================
   */

  const gallery = useMemo(() => {
    return portfolioMedia
      .filter((item) => item.type === "gallery")
      .sort((a, b) => {
        const orderA = typeof a.order === "number" ? a.order : 0;

        const orderB = typeof b.order === "number" ? b.order : 0;

        return orderA - orderB;
      });
  }, [portfolioMedia]);

  /*
   * =========================================================
   * RESET GALLERY INDEX WHEN MEDIA CHANGES
   * =========================================================
   */

  useEffect(() => {
    if (activeGallery >= gallery.length) {
      setActiveGallery(0);
    }
  }, [gallery.length, activeGallery]);

  /*
   * =========================================================
   * FILTER PROJECTS
   * =========================================================
   */

  const filteredProjects = useMemo(() => {
    if (active === "All") {
      return projects;
    }

    return projects.filter(
      (project) => project.category === active || project.type === active,
    );
  }, [active, projects]);

  /*
   * =========================================================
   * AUTOMATIC GALLERY
   * =========================================================
   */

  useEffect(() => {
    if (gallery.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveGallery((current) => (current + 1) % gallery.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [gallery.length]);

  return (
    <div className="bg-black text-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative flex min-h-[70vh] items-end overflow-hidden px-6 pb-20 pt-32 md:px-12 lg:px-20">
        <div className="absolute inset-0">
          {portfolioCover?.url && (
            <img
              src={portfolioCover.url}
              alt={portfolioCover.alt || "Being Iban Entertainments Portfolio"}
              className="h-full w-full object-cover opacity-40"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Our Portfolio
            </p>

            <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Work that
              <span className="text-red-500"> makes noise.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
              A collection of films, commercials, music videos, branded content
              and visual experiences created by Being Iban Entertainments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          IMAGE GALLERY
      ====================================================== */}

      <section className="bg-black px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="relative min-h-[500px] overflow-hidden bg-zinc-900 md:min-h-[650px] lg:col-span-9">
                {!loadingMedia &&
                  !mediaError &&
                  gallery.map((item, index) => (
                    <img
                      key={item._id || item.publicId || item.url || index}
                      src={item.url}
                      alt={item.alt || `Portfolio gallery ${index + 1}`}
                      className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                        activeGallery === index
                          ? "scale-100 opacity-100"
                          : "scale-105 opacity-0"
                      }`}
                    />
                  ))}
              </div>

              <div className="lg:col-span-3">
                <div className="gallery-scrollbar grid max-h-[650px] grid-cols-2 gap-4 overflow-y-auto pr-1 lg:grid-cols-1">
                  {!loadingMedia &&
                    !mediaError &&
                    gallery.map((item, index) => {
                      const isActive = activeGallery === index;

                      return (
                        <button
                          key={item._id || item.publicId || item.url || index}
                          type="button"
                          onClick={() => setActiveGallery(index)}
                          aria-label={`Show gallery image ${index + 1}`}
                          className={`group relative min-h-[150px] overflow-hidden transition-all duration-500 lg:min-h-[150px] ${
                            isActive
                              ? "ring-2 ring-red-500"
                              : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.alt || `Gallery thumbnail ${index + 1}`}
                            className={`h-full w-full object-cover transition duration-700 ${
                              isActive ? "scale-105" : "group-hover:scale-105"
                            }`}
                          />

                          <div
                            className={`absolute inset-0 transition-all duration-300 ${
                              isActive
                                ? "bg-black/0"
                                : "bg-black/30 group-hover:bg-black/10"
                            }`}
                          />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 flex items-center gap-3">
            {gallery.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show gallery image ${index + 1}`}
                onClick={() => setActiveGallery(index)}
                className={`h-[2px] transition-all duration-500 ${
                  activeGallery === index
                    ? "w-16 bg-red-500"
                    : "w-8 bg-white/20 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECTS
      ====================================================== */}

      <section className="bg-zinc-950 px-6 py-24 md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                Selected Projects
              </p>

              <h2 className="max-w-4xl font-display text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-7xl">
                Work built
                <br />
                <span className="text-white/25">with purpose.</span>
              </h2>
            </div>
          </Reveal>

          {/* =================================================
              CATEGORY FILTERS
          ================================================== */}

          <Reveal>
            <div className="mb-10 md:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((current) => !current)}
                aria-expanded={filtersOpen}
                className="flex w-full items-center justify-between border border-white/15 bg-black px-5 py-4 text-left transition-all duration-300 hover:border-white/30"
              >
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                    Filter Projects
                  </span>

                  <span className="mt-1 block text-sm font-semibold text-white">
                    {active}
                  </span>
                </div>

                <ChevronDown
                  size={20}
                  strokeWidth={1.7}
                  className={`text-red-500 transition-transform duration-300 ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  filtersOpen
                    ? "mt-2 max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border border-white/10 bg-zinc-950 p-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActive(category);
                        setFiltersOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all duration-300 ${
                        active === category
                          ? "bg-red-500 text-white"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span>{category}</span>

                      {active === category && (
                        <span className="text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-14 hidden flex-wrap gap-3 md:flex">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  className={`border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                    active === category
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-white/15 bg-transparent text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          {/* =================================================
              PROJECT LOADING
          ================================================== */}

          {loadingProjects && (
            <div className="border border-white/10 bg-black py-20 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Loading projects...
              </p>
            </div>
          )}

          {/* =================================================
              PROJECT ERROR
          ================================================== */}

          {!loadingProjects && projectsError && (
            <div className="border border-red-500/20 bg-black py-20 text-center">
              <p className="text-sm text-red-400">{projectsError}</p>
            </div>
          )}

          {/* =================================================
              PROJECT CARDS
          ================================================== */}

          {!loadingProjects &&
            !projectsError &&
            filteredProjects.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2">
                {filteredProjects.map((project, index) => {
                  const slug = createSlug(project);

                  const projectUrl = project.link || `/portfolio/${slug}`;

                  const isExternal =
                    project.link && /^https?:\/\//i.test(project.link);

                  return (
                    <Reveal
                      key={
                        project._id ||
                        project.id ||
                        project.slug ||
                        project.title
                      }
                      delay={index * 0.08}
                    >
                      <div className="group block overflow-hidden border border-white/10 bg-black transition-all duration-500 hover:border-red-500/40">
                        {/* IMAGE */}

                        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-zinc-900 md:min-h-[420px]">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div className="flex h-full min-h-[320px] w-full items-center justify-center">
                              <span className="text-xs uppercase tracking-[0.2em] text-white/20">
                                No Image
                              </span>
                            </div>
                          )}

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                          {/* CATEGORY */}

                          <div className="absolute left-5 top-5 border border-white/15 bg-black/70 px-4 py-2 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                              {project.category || project.type || "Project"}
                            </span>
                          </div>

                          {/* PROJECT LINK */}

                          <a
                            href={projectUrl}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            aria-label={`Open ${project.title}`}
                            className="absolute right-5 top-5 flex h-10 w-10 translate-y-2 items-center justify-center border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-md transition-all duration-500 hover:border-red-500 hover:bg-red-500 group-hover:translate-y-0 group-hover:opacity-100"
                          >
                            <ArrowUpRight size={17} strokeWidth={1.8} />
                          </a>
                        </div>

                        {/* CARD CONTENT */}

                        <div className="p-7 md:p-9">
                          <div className="flex items-start justify-between gap-6">
                            <div>
                              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                                {String(index + 1).padStart(2, "0")}
                              </p>

                              <h3 className="font-display text-3xl font-black leading-[0.95] tracking-[-0.03em] text-white md:text-4xl">
                                {project.title}
                              </h3>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-all duration-300 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-white">
                              <ArrowUpRight size={19} strokeWidth={1.8} />
                            </div>
                          </div>

                          {/* DESCRIPTION */}

                          {(project.shortDescription ||
                            project.description) && (
                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
                              {project.shortDescription || project.description}
                            </p>
                          )}

                          {/* PROJECT INFORMATION */}

                          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              {project.year && (
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                                  {project.year}
                                </span>
                              )}

                              {project.year && project.type && (
                                <span className="text-white/15">·</span>
                              )}

                              {project.type && (
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                                  {project.type}
                                </span>
                              )}
                            </div>

                            <a
                              href={projectUrl}
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer" : undefined}
                              className="text-xs font-bold uppercase tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-red-500"
                            >
                              View Project
                            </a>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!loadingProjects &&
            !projectsError &&
            filteredProjects.length === 0 && (
              <div className="border border-white/10 bg-black py-20 text-center">
                <p className="text-white/50">
                  No projects found in this category.
                </p>
              </div>
            )}
        </div>
      </section>

      <ClientLogos />

      {/* =====================================================
          REVIEWS
      ====================================================== */}

      <section className="relative overflow-hidden bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-red-600/[0.06] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-600/[0.04] blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                  Client Stories
                </p>

                <h2 className="max-w-4xl font-display text-5xl font-black leading-[0.88] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
                  Words from
                  <br />
                  <span className="text-white/25">the people.</span>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-relaxed text-white/40 md:text-base">
                Great creative work is built through collaboration. Here&apos;s
                what some of our clients have to say about working with us.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review, index) => (
              <Reveal key={review.name} delay={index * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-500/[0.08] blur-3xl transition-all duration-700 group-hover:bg-red-500/[0.14]"
                  />

                  <div className="relative z-10 flex items-start justify-between gap-6">
                    <span className="font-display text-xs font-black tracking-[0.15em] text-white/20 transition-colors duration-300 group-hover:text-red-500">
                      0{index + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      {Array.from({
                        length: review.rating,
                      }).map((_, starIndex) => (
                        <span key={starIndex} className="text-sm text-red-500">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-10">
                    <span
                      aria-hidden="true"
                      className="absolute -left-1 -top-8 font-display text-6xl font-black leading-none text-red-500/20"
                    >
                      “
                    </span>

                    <p className="relative font-display text-lg font-medium leading-[1.5] tracking-[-0.015em] text-white/70 transition-colors duration-300 group-hover:text-white/90 sm:text-xl lg:text-2xl">
                      {review.quote}
                    </p>
                  </div>

                  <div className="relative z-10 mt-10 flex items-end justify-between gap-6 border-t border-white/10 pt-6">
                    <div>
                      <h3 className="font-display text-sm font-bold text-white sm:text-base">
                        {review.name}
                      </h3>

                      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35 sm:text-xs">
                        {review.role}
                      </p>

                      <p className="mt-1 text-xs text-red-500/80">
                        {review.company}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-white/30 transition-all duration-300 group-hover:border-red-500/50 group-hover:bg-red-500 group-hover:text-white">
                      ↗
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-500 group-hover:w-full"
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="border-t border-white/10 bg-black px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Have a project?
            </p>

            <h2 className="text-4xl font-bold md:text-6xl">
              Let&apos;s create something
              <span className="text-red-500"> unforgettable.</span>
            </h2>

            <Link
              to="/contact"
              className="mt-10 inline-flex bg-red-500 px-8 py-4 font-semibold transition hover:bg-red-600"
            >
              Start a Project →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
