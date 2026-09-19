import { useEffect, useState } from "react";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";

export default function About() {
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  const [heroImage, setHeroImage] = useState("/images/studio.jpg");

  /* ==================================================
     FETCH ACTIVE MEMBERS
  ================================================== */

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setTeamLoading(true);
        setTeamError("");

        const response = await fetch("/api/members/active");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch members");
        }

        setTeam(result.members || []);
      } catch (error) {
        console.error("Fetch active members error:", error);
        setTeamError(error.message);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ==================================================
     FETCH ABOUT COVER IMAGE FROM MEDIA LIBRARY
  ================================================== */

  useEffect(() => {
    const fetchAboutCoverImage = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${apiUrl}/api/media?page=about&type=cover`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch About cover image",
          );
        }

        if (
          result.success &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const activeImage =
            result.data.find((media) => media.active !== false) ||
            result.data[0];

          if (activeImage?.url) {
            setHeroImage(activeImage.url);
          }
        }
      } catch (error) {
        console.error("Fetch About cover image error:", error);
      }
    };

    fetchAboutCoverImage();
  }, []);

  const values = [
    {
      title: "Cinematic Excellence",
      image: "/images/about_1.png",
      text: "High-quality production with cutting-edge technology.",
    },
    {
      title: "Creative Innovation",
      image: "/images/about_2.png",
      text: "Fresh, unique storytelling with diverse narratives.",
    },
    {
      title: "Global Reach",
      image: "/images/about_3.png",
      text: "Content that resonates with audiences worldwide.",
    },
    {
      title: "Creative Synergy",
      image: "/images/about_4.png",
      text: "Partnerships with top-tier talent in the industry.",
    },
  ];

  return (
    <>
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-studio-black px-6 pb-20 pt-32 sm:min-h-[72vh] lg:min-h-[78vh] lg:px-10 lg:pb-28 lg:pt-40">
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
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs">
            About Us
          </p>

          <h1 className="max-w-5xl font-display text-[3.2rem] font-black leading-[0.82] tracking-[-0.055em] sm:text-5xl md:text-7xl lg:text-8xl">
            Bringing Stories to Life, <br />
            <span className="text-white/30">One Frame at a Time.</span>
          </h1>
        </div>
      </section>

      {/* ==================================================
          OUR MISSION
      ================================================== */}

      <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="container-studio grid gap-16 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Our Mission"
              title={
                <>
                  Stories that <br />
                  <span className="text-black/25">move.</span>
                </>
              }
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6 text-lg leading-relaxed text-black/60">
              <p>
                At Being Iban Entertainments, our mission is to craft compelling
                and thought-provoking stories that captivate, inspire, and
                entertain audiences worldwide. We are committed to pushing the
                boundaries of creativity, embracing innovative storytelling
                techniques, and delivering cinematic experiences that leave a
                lasting impact. By nurturing fresh talent and collaborating with
                industry pioneers, we aim to set new standards in the
                entertainment industry.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================================================
          DIVIDER
      ================================================== */}

      <div className="bg-white px-6 lg:px-10">
        <div className="container-studio">
          <hr className="border-0 border-t border-black/15" />
        </div>
      </div>

      {/* ==================================================
          OUR VISION
      ================================================== */}

      <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="container-studio grid gap-16 lg:grid-cols-2">
          <Reveal delay={0.15}>
            <div className="ml-auto max-w-xl space-y-6 text-right text-lg leading-relaxed text-black/60">
              <p>
                We envision Being Iban Entertainments as a powerhouse of
                creativity, recognized for its artistic excellence and
                commitment to storytelling. Our goal is to become a global
                leader in film, television, and digital content production,
                bringing stories to life that resonate across cultures and
                generations. By continuously evolving with emerging trends and
                technologies, we strive to bridge the gap between traditional
                narratives and modern cinematic innovation.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="lg:text-right">
              <SectionHeading
                eyebrow="Our Vision"
                title={
                  <>
                    Stories without <br />
                    <span className="text-black/25">boundaries.</span>
                  </>
                }
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================================================
          LEADERSHIP
      ================================================== */}

      <section className="bg-studio-black px-6 py-28 lg:px-10 lg:py-40">
        <div className="container-studio">
          <Reveal>
            <SectionHeading
              eyebrow="Leadership"
              title={
                <>
                  The Minds <br />
                  behind the Magic.
                </>
              }
              light
            />
          </Reveal>

          {/* TEAM GRID */}

          {teamLoading ? (
            <div className="mt-20 py-16 text-center text-sm text-white/40">
              Loading our team...
            </div>
          ) : teamError ? (
            <div className="mt-20 py-16 text-center text-sm text-white/40">
              Unable to load team members.
            </div>
          ) : team.length === 0 ? (
            <div className="mt-20 py-16 text-center text-sm text-white/40">
              No team members available.
            </div>
          ) : (
            <div className="mt-20 grid gap-8 md:grid-cols-3">
              {team.map((person, index) => (
                <Reveal key={person._id} delay={index * 0.1}>
                  <div>
                    {/* IMAGE */}

                    <div className="aspect-[3/4] overflow-hidden bg-white/5">
                      <img
                        src={person.image?.url}
                        alt={person.name}
                        className="h-full w-full object-cover grayscale transition duration-700 hover:scale-105 hover:grayscale-0"
                      />
                    </div>

                    {/* DESIGNATION */}

                    <p className="mt-6 text-xs uppercase tracking-wider text-studio-red">
                      {person.designation}
                    </p>

                    {/* NAME */}

                    <h3 className="mt-2 font-display text-2xl font-bold text-white">
                      {person.name}
                    </h3>

                    {/* BIO */}

                    <p className="mt-3 text-sm leading-relaxed text-white/40">
                      {person.bio}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          OUR UTOPIAN DREAM
      ================================================== */}

      <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="container-studio">
          <Reveal>
            <SectionHeading
              eyebrow="Our Utopian Dream"
              title={
                <>
                  Artist&apos;s <br />
                  <span className="text-black/25">Lala Land.</span>
                </>
              }
            />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-20 max-w-5xl space-y-6 text-lg leading-relaxed text-black/60">
              <p>
                Being Iban Entertainments fulfills the utopian artistic dream by
                creating a space where creativity is not bound by limitations of
                resources, hierarchy, or conventional norms. Instead, it
                envisions an ecosystem where young artists can freely express
                their individuality while being supported with professional
                guidance and modern tools of storytelling. The utopian artistic
                dream is about merging imagination with reality, and Being Iban
                Entertainments does exactly that by transforming raw ideas into
                polished artistic experiences that resonate with audiences.
              </p>

              <p>
                It fosters collaboration over competition, giving every voice
                equal importance and nurturing diversity in expression. In doing
                so, it not only empowers artists to chase their passions without
                fear but also builds a collective artistic community that
                reflects inclusivity, innovation, and boundless creative freedom
                — the very essence of a true artistic utopia.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================================================
          WHY WORK WITH US
      ================================================== */}

      <section className="bg-white px-6 py-28 text-black lg:px-10 lg:py-40">
        <div className="container-studio">
          <Reveal>
            <SectionHeading
              eyebrow="Why Work With Us"
              title={
                <>
                  Why Choose <br />
                  <span className="text-black/25">Being Iban?</span>
                </>
              }
            />
          </Reveal>

          <div className="mt-20 grid border-t border-black/15 md:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.08}>
                <div className="group border-b border-black/15 p-8 md:p-12">
                  <div className="flex items-start justify-between">
                    <div className="flex h-20 w-20 items-center justify-center">
                      <img
                        src={value.image}
                        alt=""
                        className="h-16 w-16 object-contain transition-all duration-500 group-hover:scale-150"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(5255%) hue-rotate(350deg) brightness(91%) contrast(113%)",
                        }}
                      />
                    </div>

                    <span className="font-display text-sm font-black text-studio-red">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-8 font-display text-3xl font-bold tracking-[-0.02em]">
                    {value.title}
                  </h3>

                  <p className="mt-4 max-w-md text-base leading-relaxed text-black/50">
                    {value.text}
                  </p>

                  <div className="mt-7 h-[2px] w-8 bg-studio-red transition-all duration-500 group-hover:w-16" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
