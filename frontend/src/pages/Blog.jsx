import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   HELPERS
================================================== */

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(parsedDate);
}

/* ==================================================
   BLOG
================================================== */

export default function Blog() {
  const [heroImage, setHeroImage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==================================================
     FETCH HERO IMAGE
  ================================================== */

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/media?page=blog&type=cover`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blog hero image.");
        }

        const result = await response.json();

        const media = Array.isArray(result.data) ? result.data : [];

        const activeCover = media.find(
          (item) =>
            item.page === "blog" &&
            item.type === "cover" &&
            item.active !== false &&
            item.url,
        );

        if (activeCover?.url) {
          setHeroImage(activeCover.url);
        }
      } catch (err) {
        console.error("Failed to load blog hero image:", err);
      }
    };

    fetchHeroImage();
  }, []);

  /* ==================================================
     FETCH BLOG POSTS
  ================================================== */

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/blog`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch blog posts.");
        }

        const publishedPosts = Array.isArray(result.posts) ? result.posts : [];

        setPosts(publishedPosts);
      } catch (err) {
        console.error("Failed to load blog posts:", err);

        setError(err.message || "Failed to load blog posts.");

        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="bg-white text-black">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative flex min-h-[75vh] items-end overflow-hidden bg-black px-6 pb-16 pt-32 sm:min-h-[78vh] sm:pb-20 lg:px-10 lg:pb-28 lg:pt-40">
        {/* Background */}
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Being IBAN Entertainments"
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-black" />
          )}

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
        </div>

        {/* Decorative line */}
        <div className="absolute left-6 top-1/2 hidden h-px w-24 bg-white/20 lg:left-10 lg:block" />

        {/* Hero content */}
        <div className="container-studio relative z-10 w-full">
          <div className="max-w-6xl">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-studio-red sm:text-xs">
              <span className="h-px w-8 bg-studio-red" />
              Insights
            </p>

            <h1 className="font-display text-[3.25rem] font-black leading-[0.86] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl lg:text-[8.5rem]">
              Stories
              <br />
              <span className="text-white/35">from Being IBAN.</span>
            </h1>

            <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-7">
                Behind the scenes, creative perspectives, production insights,
                and stories from the world of Being IBAN Entertainments.
              </p>

              <div className="hidden text-right sm:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">
                  Journal
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {posts.length > 0
                    ? `${posts.length} stories`
                    : "Creative stories"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-7 right-6 hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 lg:flex">
          Scroll to explore
          <span className="h-px w-12 bg-white/20" />
        </div>
      </section>

      {/* ==================================================
          BLOG CONTENT
      ================================================== */}

      <section className="relative bg-white px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
        <div className="container-studio">
          {/* Section header */}
          <div className="mb-12 flex flex-col gap-6 border-b border-black/10 pb-7 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red">
                <span className="h-px w-6 bg-studio-red" />
                From our journal
              </p>

              <h2 className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Top Stories
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-black/45">
              Explore ideas, experiences, and perspectives from our creative
              world.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden border border-black/10"
                >
                  <div className="aspect-[4/3] animate-pulse bg-black/5" />

                  <div className="space-y-4 p-6 sm:p-7">
                    <div className="h-3 w-24 animate-pulse bg-black/10" />
                    <div className="h-8 w-4/5 animate-pulse bg-black/10" />
                    <div className="h-16 w-full animate-pulse bg-black/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="border border-black/10 px-6 py-20 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-studio-red">
                Something went wrong
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/50">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && posts.length === 0 && (
            <div className="border border-black/10 px-6 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/10">
                <span className="h-2 w-2 rounded-full bg-studio-red" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-black/40">
                No stories available yet
              </p>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/40">
                New stories and creative insights will appear here soon.
              </p>
            </div>
          )}

          {/* Blog cards */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const image = post.coverImage?.url || "";
                const date = post.publishedAt || post.createdAt;

                return (
                  <Link
                    key={post._id || post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                      {image ? (
                        <img
                          src={image}
                          alt={post.title || "Blog post"}
                          loading={index > 2 ? "lazy" : "eager"}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
                          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/25">
                            Being IBAN
                          </span>
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      <div className="absolute inset-0 bg-studio-red/0 transition-colors duration-500 group-hover:bg-studio-red/5" />

                      {/* Number */}
                      <div className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center bg-black px-2 text-[10px] font-bold tracking-[0.15em] text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Arrow */}
                      <div className="absolute bottom-4 right-4 flex h-12 w-12 translate-y-3 items-center justify-center bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight size={19} strokeWidth={1.7} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col border-x border-b border-black/10 px-5 pb-6 pt-5 transition-all duration-500 group-hover:border-black/20 sm:px-6 sm:pb-7 sm:pt-6">
                      {/* Meta */}
                      <div className="flex items-center justify-between gap-4">
                        <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-studio-red">
                          {post.category || "Entertainment"}
                        </p>

                        {formatDate(date) && (
                          <p className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-black/30">
                            {formatDate(date)}
                          </p>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="mt-5 font-display text-2xl font-black leading-[0.98] tracking-[-0.035em] transition-colors duration-300 group-hover:text-studio-red sm:text-[1.7rem]">
                        {post.title || "Untitled Story"}
                      </h2>

                      {/* Excerpt */}
                      <p className="mt-5 line-clamp-3 flex-1 text-sm leading-6 text-black/50">
                        {post.excerpt ||
                          "Discover the latest stories, ideas, and creative work from Being IBAN Entertainments."}
                      </p>

                      {/* Bottom */}
                      <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">
                        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-black/45 transition-colors duration-300 group-hover:text-black">
                          Read Story
                        </span>

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.8}
                          className="text-black/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-studio-red"
                        />
                      </div>

                      {/* Read time */}
                      {post.readTime > 0 && (
                        <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-black/25">
                          {post.readTime} min read
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
