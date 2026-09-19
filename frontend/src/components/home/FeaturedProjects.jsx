import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects/featured`);

        if (!response.ok) {
          throw new Error("Failed to fetch featured projects");
        }

        const result = await response.json();

        if (result.success) {
          setFeaturedProjects(result.projects || []);
        } else {
          setFeaturedProjects([]);
        }
      } catch (error) {
        console.error("Featured projects error:", error);
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-studio-black
        px-4
        py-16
        sm:px-6
        sm:py-20
        md:px-8
        md:py-28
        lg:px-10
        lg:py-40
      "
    >
      <div className="container-studio w-full">
        <div
          className="
            mb-10
            flex
            flex-col
            justify-between
            gap-6
            sm:mb-12
            sm:gap-8
            md:mb-14
            lg:mb-16
            lg:flex-row
            lg:items-end
          "
        >
          <Reveal>
            <SectionHeading
              eyebrow="Selected Work"
              title={
                <>
                  A journey
                  <br />
                  <span className="text-white/30">through stories.</span>
                </>
              }
              light
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              to="/portfolio"
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-2
                border-b
                border-white/40
                pb-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-white
                transition-all
                duration-300
                hover:border-studio-red
                hover:text-studio-red
                sm:text-xs
                lg:text-sm
              "
            >
              <span>View All Work</span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                  sm:h-[17px]
                  sm:w-[17px]
                "
              />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div
            className="
              border
              border-white/10
              bg-white/[0.02]
              px-5
              py-16
              text-center
              sm:px-6
              sm:py-20
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-white/30
                sm:text-xs
              "
            >
              Loading selected work...
            </p>
          </div>
        ) : featuredProjects.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:gap-5
              md:grid-cols-2
              md:gap-6
              lg:grid-cols-12
            "
          >
            {featuredProjects
              .slice()
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .slice(0, 4)
              .map((project, index) => {
                const gridClass =
                  index === 0
                    ? "lg:col-span-7"
                    : index === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-6";

                // NEW FIELD
                const imageUrl = project.coverImage?.url || "";

                // NEW FIELD
                const externalLink = project.projectLink?.trim() || "";

                const projectUrl = externalLink || `/portfolio/${project.slug}`;

                return (
                  <div
                    key={project._id || project.slug || project.title}
                    className={`min-w-0 ${gridClass}`}
                  >
                    <Reveal delay={index * 0.08}>
                      <Link
                        to={projectUrl}
                        target={externalLink ? "_blank" : undefined}
                        rel={externalLink ? "noopener noreferrer" : undefined}
                        className="
                          group
                          relative
                          block
                          overflow-hidden
                          border
                          border-white/10
                          bg-black
                          transition-all
                          duration-500
                          hover:border-red-500/40
                        "
                      >
                        <div
                          className="
                            relative
                            aspect-[4/3]
                            w-full
                            overflow-hidden
                            sm:aspect-[16/10]
                            lg:aspect-[4/3]
                          "
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={project.title || "Project"}
                              loading={index > 1 ? "lazy" : "eager"}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700
                                ease-out
                                md:group-hover:scale-105
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                bg-white/[0.03]
                              "
                            >
                              <span
                                className="
                                  text-[10px]
                                  uppercase
                                  tracking-[0.2em]
                                  text-white/20
                                "
                              >
                                No Image
                              </span>
                            </div>
                          )}

                          <div
                            className="
                              absolute
                              inset-0
                              bg-black/10
                              transition-all
                              duration-500
                              md:bg-black/0
                              md:group-hover:bg-black/25
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-x-0
                              bottom-0
                              h-[65%]
                              bg-gradient-to-t
                              from-black
                              via-black/60
                              to-transparent
                              sm:h-[60%]
                            "
                          />

                          <div
                            className="
                              absolute
                              right-4
                              top-4
                              h-3
                              w-3
                              border-r-2
                              border-t-2
                              border-studio-red
                              opacity-0
                              transition-all
                              duration-500
                              md:right-5
                              md:top-5
                              md:group-hover:opacity-100
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-x-0
                              bottom-0
                              z-10
                              p-4
                              pt-20
                              sm:p-6
                              sm:pt-28
                              md:p-7
                              md:pt-32
                              lg:p-6
                              lg:pt-28
                              xl:p-8
                              xl:pt-36
                            "
                          >
                            <div
                              className="
                                mb-1.5
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-1
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                sm:mb-2
                                sm:text-[9px]
                                sm:tracking-[0.18em]
                                md:text-xs
                                md:tracking-[0.2em]
                              "
                            >
                              {project.year && (
                                <span className="text-white/40">
                                  {project.year}
                                </span>
                              )}

                              {project.year && project.type && (
                                <span className="text-white/20">·</span>
                              )}

                              {project.type && (
                                <span className="text-studio-red">
                                  {project.type}
                                </span>
                              )}
                            </div>

                            <h3
                              className="
                                max-w-full
                                font-display
                                text-lg
                                font-bold
                                leading-tight
                                tracking-tight
                                text-white
                                sm:text-2xl
                                md:text-3xl
                              "
                            >
                              {project.title}
                            </h3>

                            {(project.shortDescription ||
                              project.description) && (
                              <p
                                className="
                                  mt-2
                                  line-clamp-2
                                  max-w-xl
                                  text-[10px]
                                  leading-relaxed
                                  text-white/50
                                  sm:mt-3
                                  sm:text-xs
                                  md:text-sm
                                "
                              >
                                {project.shortDescription ||
                                  project.description}
                              </p>
                            )}
                          </div>

                          <div
                            className="
                              absolute
                              right-4
                              top-4
                              z-20
                              flex
                              h-9
                              w-9
                              translate-y-0
                              items-center
                              justify-center
                              border
                              border-white/20
                              bg-black/30
                              text-white
                              backdrop-blur-md
                              sm:right-5
                              sm:top-5
                              sm:h-10
                              sm:w-10
                              md:h-11
                              md:w-11
                              md:translate-y-2
                              md:opacity-0
                              md:transition-all
                              md:duration-500
                              md:group-hover:translate-y-0
                              md:group-hover:border-studio-red
                              md:group-hover:bg-studio-red
                              md:group-hover:opacity-100
                            "
                          >
                            <ArrowUpRight
                              size={17}
                              strokeWidth={1.7}
                              className="
                                transition-transform
                                duration-300
                                md:group-hover:-translate-y-0.5
                                md:group-hover:translate-x-0.5
                              "
                            />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  </div>
                );
              })}
          </div>
        ) : (
          <div
            className="
              border
              border-white/10
              bg-white/[0.02]
              px-5
              py-16
              text-center
              sm:px-6
              sm:py-20
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-white/30
                sm:text-xs
              "
            >
              Projects coming soon.
            </p>
          </div>
        )}

        {featuredProjects.length > 0 && (
          <div
            className="
              mt-8
              flex
              justify-start
              sm:mt-10
              lg:hidden
            "
          >
            <Link
              to="/portfolio"
              className="
                group
                inline-flex
                min-h-[46px]
                items-center
                gap-3
                border
                border-white/15
                px-4
                py-3
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                duration-300
                hover:border-studio-red
                hover:bg-studio-red
                sm:min-h-[50px]
                sm:px-5
                sm:py-3.5
                sm:text-[10px]
              "
            >
              <span>Explore Portfolio</span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-1
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
