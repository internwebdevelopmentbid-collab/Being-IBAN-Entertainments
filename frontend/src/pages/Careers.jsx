import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, BriefcaseBusiness } from "lucide-react";

export default function Careers() {
  const departments = [
    "All",
    "Production",
    "Post Production",
    "Design",
    "Creative",
  ];

  const [active, setActive] = useState("All");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [heroImage, setHeroImage] = useState("");

  /* =====================================================
     BACKEND API URL
  ====================================================== */

  const API_URL = import.meta.env.VITE_API_URL || "";

  /* =====================================================
     FETCH PUBLISHED JOBS
  ====================================================== */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/jobs/published`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch jobs");
        }

        setJobs(result.jobs || []);
      } catch (err) {
        console.error("Failed to fetch careers:", err);

        setError(err.message || "Unable to load available jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_URL]);

  /* =====================================================
     FETCH CAREERS HERO IMAGE
  ====================================================== */

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/media?page=careers&type=cover`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch careers hero image",
          );
        }

        const media = result.media || result.data || [];

        if (media.length > 0) {
          setHeroImage(media[0].url);
        }
      } catch (err) {
        console.error("Failed to fetch careers hero image:", err);
      }
    };

    fetchHeroImage();
  }, [API_URL]);

  /* =====================================================
     FILTER JOBS
  ====================================================== */

  const filteredJobs =
    active === "All" ? jobs : jobs.filter((job) => job.department === active);

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative flex min-h-[68vh] items-end overflow-hidden bg-black sm:min-h-[72vh] lg:min-h-[75vh]">
        {heroImage && (
          <img
            src={heroImage}
            alt="Studio team"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 container-studio px-5 pb-10 sm:px-7 sm:pb-16 md:px-10 md:pb-20 lg:pb-28">
          <p className="mb-4 flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.25em] text-studio-red sm:mb-5 sm:text-xs sm:tracking-[0.3em]">
            <span className="h-px w-6 bg-studio-red sm:w-10" />
            Careers
          </p>

          <h1
            className="
              max-w-[900px]
              font-display
              text-[2.15rem]
              font-black
              uppercase
              leading-[0.88]
              tracking-[-0.055em]

              xs:text-[2.4rem]
              sm:text-[3.5rem]
              md:text-[5rem]
              lg:text-8xl
              xl:text-9xl
            "
          >
            Join
            <br />
            <span className="text-white/30">
              Being Iban
              <br className="sm:hidden" />
              <span className="sm:inline"> </span>
              Entertainments.
            </span>
          </h1>

          <p className="mt-5 max-w-[330px] text-[11px] leading-5 text-white/50 sm:mt-7 sm:max-w-xl sm:text-base sm:leading-relaxed lg:text-lg">
            For makers, storytellers, designers, technologists and
            problem-solvers.
          </p>
        </div>
      </section>

      {/* =====================================================
          LIFE AT BEING IBAN
      ====================================================== */}

      <section className="bg-white px-6 py-20 text-black sm:py-24 lg:px-10 lg:py-40">
        <div className="container-studio">
          <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
            <span className="h-px w-8 bg-studio-red" />
            Life At Being Iban Entertainment
          </p>

          <h2 className="max-w-5xl font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl md:text-7xl">
            Make ambitious work
            <br />
            with ambitious people.
          </h2>

          <p className="mt-8 max-w-5xl text-sm leading-7 text-black/60 sm:mt-10 sm:text-base sm:leading-relaxed md:text-lg">
            At Being IBAN Entertainments, life is more than just work—it’s about
            passion, creativity, and collaboration. We believe in building an
            environment where ideas flow freely, individuality is celebrated,
            and every team member contributes to shaping stories that inspire
            communities. Here, you’ll find the perfect balance of professional
            growth and artistic freedom, with opportunities to explore new
            skills, experiment with fresh concepts, and bring bold visions to
            life. Whether you’re behind the camera, curating strategies, or
            crafting content, you’ll be part of a culture that values
            imagination, innovation, and inclusivity. Together, we don’t just
            create media—we create experiences, memories, and a legacy of
            storytelling.
          </p>

          <div className="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Global projects",
              "Creative growth",
              "New technology",
              "Collaborative culture",
            ].map((item, index) => (
              <div
                key={item}
                className="group border border-black/10 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold tracking-widest text-studio-red">
                    0{index + 1}
                  </span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.7}
                    className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-studio-red"
                  />
                </div>

                <h3 className="mt-12 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em] sm:text-2xl">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          OPEN ROLES
      ====================================================== */}

      <section className="bg-studio-black px-6 py-20 lg:px-10 lg:py-32">
        <div className="container-studio">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
                <span className="h-px w-8 bg-studio-red" />
                Open Roles
              </p>

              <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl md:text-7xl">
                Find your place.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/40">
              Find a role where your ideas, skills, and creative energy can help
              shape the next generation of stories.
            </p>
          </div>

          {/* =================================================
              DEPARTMENT FILTERS
          ================================================== */}

          <div className="mt-10 flex gap-2 overflow-x-auto pb-3 sm:mt-12">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => setActive(department)}
                className={`whitespace-nowrap px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 sm:text-xs ${
                  active === department
                    ? "bg-studio-red text-white"
                    : "border border-white/15 text-white/45 hover:border-white/40 hover:text-white"
                }`}
              >
                {department}
              </button>
            ))}
          </div>

          {/* =================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="mt-10 border border-white/10 px-6 py-20 text-center">
              <p className="text-sm text-white/40">Loading open roles...</p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="mt-10 border border-red-500/20 bg-red-500/5 px-6 py-20 text-center">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* =================================================
              JOB LIST
          ================================================== */}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job, index) => (
                <article
                  key={job._id}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden border border-white/10 bg-white/[0.025] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-7"
                >
                  {/* NUMBER + ICON */}

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold tracking-widest text-studio-red">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/30 transition-all duration-300 group-hover:border-studio-red group-hover:text-studio-red">
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.7}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  {/* DEPARTMENT */}

                  <div className="mt-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-studio-red">
                      {job.department || "Creative"}
                    </p>
                  </div>

                  {/* TITLE */}

                  <h3 className="mt-4 font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-3xl">
                    {job.title}
                  </h3>

                  {/* DESCRIPTION */}

                  {job.description && (
                    <p className="mt-5 line-clamp-3 text-xs leading-6 text-white/40">
                      {job.description}
                    </p>
                  )}

                  <div className="flex-1" />

                  {/* JOB META */}

                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">
                        <MapPin size={12} />
                        Location
                      </div>

                      <p className="text-xs leading-5 text-white/55">
                        {job.location || "Kolkata"}
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">
                        <BriefcaseBusiness size={12} />
                        Type
                      </div>

                      <p className="text-xs leading-5 text-white/55">
                        {job.employmentType || "Full-time"}
                      </p>
                    </div>
                  </div>

                  {/* APPLICATION BUTTON */}

                  {job.applicationUrl ? (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex w-full items-center justify-between border border-white/15 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-studio-red hover:bg-studio-red"
                    >
                      <span>Apply Now</span>

                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </a>
                  ) : job.applicationEmail ? (
                    <a
                      href={`mailto:${job.applicationEmail}?subject=Application for ${encodeURIComponent(
                        job.title || "",
                      )}`}
                      className="mt-6 flex w-full items-center justify-between border border-white/15 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-studio-red hover:bg-studio-red"
                    >
                      <span>Apply Now</span>

                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 flex w-full cursor-not-allowed items-center justify-between border border-white/10 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25"
                    >
                      <span>Application Unavailable</span>
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="mt-10 border border-white/10 px-6 py-20 text-center">
              <p className="text-sm text-white/40">
                No open roles available
                {active !== "All" ? ` in ${active}.` : "."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          GENERAL CAREERS CTA
      ====================================================== */}

      <section className="bg-studio-red px-6 py-16 text-white sm:py-20 lg:px-10 lg:py-24">
        <div className="container-studio flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white/55 sm:text-xs">
              Don't see your role?
            </p>

            <h2 className="max-w-3xl font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              We are always looking
              <br />
              for great talent.
            </h2>
          </div>

          <a
            href="/contact"
            className="group inline-flex items-center gap-4 border border-black bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-black hover:text-studio-red"
          >
            <span>Send Your Portfolio</span>

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>
    </>
  );
}
