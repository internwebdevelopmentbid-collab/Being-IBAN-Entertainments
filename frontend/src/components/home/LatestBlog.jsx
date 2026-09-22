import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Reveal from "../ui/Reveal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LatestBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog`);

        if (!response.ok) {
          throw new Error("Failed to fetch latest blog posts.");
        }

        const result = await response.json();

        const publishedPosts = result.posts || [];

        setPosts(publishedPosts.slice(0, 3));
      } catch (error) {
        console.error("Failed to load latest blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="container-studio">
          <div className="mb-16">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
              From The Studio
            </p>

            <h2 className="font-display text-5xl font-bold md:text-7xl">
              Latest stories.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/3] bg-black/5" />

                <div className="pt-6">
                  <div className="h-3 w-24 bg-black/10" />
                  <div className="mt-4 h-8 w-4/5 bg-black/10" />
                  <div className="mt-4 h-4 w-full bg-black/10" />
                  <div className="mt-2 h-4 w-3/4 bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
      <div className="container-studio">
        <div className="mb-16 flex items-end justify-between">
          <Reveal>
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
                From The Studio
              </p>

              <h2 className="font-display text-5xl font-bold md:text-7xl">
                Latest stories.
              </h2>
            </div>
          </Reveal>

          <Link
            to="/blog"
            className="hidden border-b border-black pb-2 text-sm font-bold uppercase md:block"
          >
            Read All →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-black/40">No published stories yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post._id || post.slug} delay={index * 0.1}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-black/5">
                    {post.coverImage?.url && (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-studio-red">
                      {post.category || "Studio"}
                    </p>

                    <h3 className="mt-3 font-display text-2xl font-bold">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-black/50">
                        {post.excerpt}
                      </p>
                    )}

                    <p className="mt-5 text-xs uppercase tracking-wider text-black/40">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : ""}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
