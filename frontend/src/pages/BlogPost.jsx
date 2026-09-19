import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(parsed);
}

export default function BlogPost() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/blog/slug/${encodeURIComponent(slug)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load post");
        }

        setPost(data.post || data);
      } catch (error) {
        console.error("Failed to load blog post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <section className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-px w-16 bg-studio-red" />

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
              Loading Story
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!post) {
    return (
      <main className="flex min-h-screen items-center bg-black px-6 text-white lg:px-10">
        <div className="container-studio">
          <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-studio-red">
            404 / Story Not Found
          </p>

          <h1 className="mt-6 max-w-5xl font-display text-6xl font-black leading-[0.82] tracking-[-0.06em] sm:text-8xl lg:text-[9rem]">
            This story
            <br />
            disappeared.
          </h1>

          <p className="mt-8 max-w-md text-sm leading-7 text-white/40">
            The article you are looking for may have been removed or is no
            longer available.
          </p>

          <Link
            to="/blog"
            className="group mt-10 inline-flex items-center gap-3 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-studio-red hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Journal
          </Link>
        </div>
      </main>
    );
  }

  const image = post.coverImage?.url || "";
  const date = formatDate(post.publishedAt || post.createdAt);

  return (
    <main className="overflow-hidden bg-white text-black">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[78vh] overflow-hidden bg-black text-white sm:min-h-[88vh] lg:min-h-screen">
        {/* Background */}
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

        {/* Red atmospheric glow */}
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-studio-red/20 blur-[140px]" />

        {/* Decorative ring */}
        <div className="absolute -right-32 bottom-20 hidden h-80 w-80 rounded-full border border-white/10 lg:block" />

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="absolute left-0 right-0 top-0 z-20 px-6 pt-8 lg:px-10 lg:pt-10">
          <div className="container-studio flex items-center justify-between">
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft
                size={15}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Journal
            </Link>

            <div className="text-right">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">
                Being IBAN
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/50">
                Entertainments
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div className="relative z-10 flex min-h-[78vh] items-end px-5 pb-16 pt-36 sm:min-h-[88vh] sm:px-6 sm:pb-20 sm:pt-40 lg:min-h-screen lg:px-10 lg:pb-24 lg:pt-48">
          <div className="container-studio w-full">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <div className="min-w-0 max-w-6xl">
                {/* Category + date */}
                <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-7">
                  <p className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-[9px] sm:tracking-[0.35em]">
                    <span className="h-px w-5 bg-studio-red sm:w-8" />

                    {post.category || "Insights"}
                  </p>

                  {date && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/25" />

                      <span className="text-[8px] uppercase tracking-[0.15em] text-white/45 sm:text-[9px] sm:tracking-[0.2em]">
                        {date}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="max-w-[95vw] break-words font-display text-[2.4rem] font-black leading-[0.9] tracking-[-0.055em] sm:max-w-[90vw] sm:text-[4.5rem] sm:leading-[0.86] md:max-w-5xl md:text-7xl lg:max-w-7xl lg:text-[8.5rem] lg:leading-[0.82] xl:text-[9.5rem]">
                  {post.title}
                </h1>
              </div>

              {/* Article number */}
              <div className="hidden text-right lg:block">
                <span className="font-display text-[8rem] font-black leading-none tracking-[-0.08em] text-white/10">
                  01
                </span>

                <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/30">
                  Story
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom information bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:px-10">
          <div className="container-studio flex items-center justify-between border-t border-white/15 py-5">
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">
              Being IBAN Journal
            </span>

            <span className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">
              Scroll
              <span className="h-px w-10 bg-white/20" />
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARTICLE SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-white px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
        {/* =====================================================
            VERTICAL WATERMARK
        ===================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 z-0 hidden -translate-y-1/2 select-none font-display text-[5rem] font-black uppercase leading-none tracking-[-0.06em] text-black/[0.035] [writing-mode:vertical-rl] lg:block xl:right-8 xl:text-[6rem]"
        >
          BEING IBAN ENTERTAINMENTS
        </div>

        {/* =====================================================
            LARGE RED CIRCLES
        ===================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-20 h-[380px] w-[380px] rounded-full bg-studio-red/[0.055] lg:h-[520px] lg:w-[520px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-40 h-[300px] w-[300px] rounded-full border-[45px] border-studio-red/[0.035] lg:h-[420px] lg:w-[420px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-studio-red/[0.045] lg:h-[500px] lg:w-[500px]"
        />

        {/* Small red circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-studio-red/30 lg:h-4 lg:w-4"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[20%] right-[18%] h-8 w-8 rounded-full border border-studio-red/20 lg:h-12 lg:w-12"
        />

        {/* =====================================================
            ARTICLE GRID
        ===================================================== */}

        <div className="container-studio relative z-10">
          <div className="grid gap-14 lg:grid-cols-[220px_1fr] lg:gap-20">
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/30">
                  In this story
                </p>

                <div className="mt-5 h-px w-10 bg-black/10" />

                <p className="mt-5 max-w-[180px] text-xs leading-6 text-black/45">
                  Creative insights, production perspectives, and stories from
                  Being IBAN Entertainments.
                </p>

                <p className="mt-12 font-display text-7xl font-black leading-none tracking-[-0.08em] text-black/[0.045]">
                  01
                </p>

                <div className="mt-4 h-px w-16 bg-black/10" />

                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.25em] text-black/25">
                  Journal
                </p>
              </div>
            </aside>

            {/* =================================================
                MAIN ARTICLE
            ================================================= */}

            <article className="relative min-w-0 max-w-4xl">
              {/* Cover image */}
              {image && (
                <figure className="group relative overflow-hidden bg-neutral-100">
                  <img
                    src={image}
                    alt={post.title}
                    className="h-auto w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02] sm:max-h-[70vh] sm:min-h-[420px] lg:h-[620px] lg:max-h-none lg:min-h-0 xl:h-[700px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-white/70">
                    <span className="h-px w-7 bg-white/60" />
                    Being IBAN
                  </div>
                </figure>
              )}

              {/* =================================================
                  LEAD
              ================================================= */}

              {post.excerpt && (
                <div className="relative my-16 sm:my-20 lg:my-24">
                  <span className="absolute -left-2 -top-10 font-display text-8xl font-black leading-none text-studio-red/[0.07] sm:-left-5 sm:-top-14 sm:text-[10rem]">
                    “
                  </span>

                  <p className="relative max-w-4xl font-display text-2xl font-medium leading-[1.3] tracking-[-0.025em] text-black sm:text-3xl lg:text-4xl">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* =================================================
                  CONTENT
              ================================================= */}

              {post.content && (
                <div className="max-w-3xl">
                  {post.content
                    .split(/\n+/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph, index) => {
                      const isQuote =
                        paragraph.startsWith('"') ||
                        paragraph.startsWith("“") ||
                        paragraph.startsWith("'");

                      if (index === 0) {
                        return (
                          <p
                            key={index}
                            className="mb-10 font-display text-xl font-medium leading-[1.5] tracking-[-0.02em] text-black sm:text-2xl lg:text-[1.7rem] lg:leading-[1.55]"
                          >
                            <span className="text-studio-red">
                              {paragraph.charAt(0)}
                            </span>

                            {paragraph.slice(1)}
                          </p>
                        );
                      }

                      if (isQuote) {
                        return (
                          <blockquote
                            key={index}
                            className="relative my-12 border-l-2 border-black/10 bg-black/[0.025] px-6 py-7 font-display text-xl font-medium leading-[1.45] tracking-[-0.02em] text-black sm:px-8 sm:text-2xl lg:my-16 lg:text-3xl"
                          >
                            <span className="absolute -left-3 -top-5 font-display text-5xl text-studio-red/60">
                              “
                            </span>

                            {paragraph.replace(/^["“]|["”]$/g, "")}
                          </blockquote>
                        );
                      }

                      return (
                        <p
                          key={index}
                          className="mb-8 text-[16px] leading-[1.9] text-black/65 sm:text-[17px] lg:text-[18px]"
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                </div>
              )}

              {/* =================================================
                  ARTICLE FOOTER
              ================================================= */}

              <div className="mt-20 border-t border-black/10 pt-8 sm:mt-28">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/30">
                      Published
                    </p>

                    <p className="mt-2 text-sm text-black/60">
                      {date || "Being IBAN Journal"}
                    </p>
                  </div>

                  <Link
                    to="/blog"
                    className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:text-studio-red"
                  >
                    Explore More Stories
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          MORE STORIES
      ===================================================== */}

      <section className="relative overflow-hidden bg-black px-6 py-24 text-white sm:py-28 lg:px-10 lg:py-36">
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-studio-red/10 blur-[130px]" />

        <div className="pointer-events-none absolute -bottom-20 right-0 font-display text-[12rem] font-black leading-none tracking-[-0.1em] text-white/[0.025] sm:text-[20rem]">
          02
        </div>

        <div className="container-studio relative z-10">
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.35em] text-studio-red">
                <span className="h-px w-8 bg-studio-red" />
                Keep Exploring
              </p>

              <h2 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[0.84] tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[7rem]">
                More stories.
                <br />
                More ideas.
              </h2>
            </div>

            <Link
              to="/blog"
              className="group flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 hover:border-studio-red hover:bg-studio-red sm:h-32 sm:w-32"
            >
              <ArrowRight
                size={28}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:translate-x-2"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-studio-red px-6 py-24 text-white sm:py-28 lg:px-10 lg:py-36">
        <div className="container-studio relative z-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/60">
            Have a project?
          </p>

          <h2 className="mt-6 max-w-5xl font-display text-5xl font-black leading-[0.82] tracking-[-0.06em] sm:text-7xl md:text-8xl lg:text-[8rem]">
            Let's create
            <br />
            something
            <br />
            unforgettable.
          </h2>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-between gap-10 bg-black px-7 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
            >
              Start a Project
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

            <p className="max-w-sm text-xs leading-6 text-white/55">
              Films. Music. Brands. Digital experiences. Creative production.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
