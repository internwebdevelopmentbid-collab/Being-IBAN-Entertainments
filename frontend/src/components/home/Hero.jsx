import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_HERO = {
  title: "Experience",
  subtitle: "the magic of",
  description:
    "A grand movie premiere backdrop, with lights, a red carpet, and an audience.",

  video: {
    url: "",
    publicId: "",
    playbackUrl: "",
  },

  poster: {
    url: "/images/hero.jpg",
    publicId: "",
  },
};

export default function Hero() {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const videoRef = useRef(null);

  /* ==================================================
     FETCH HERO DATA
  ================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchHome = async () => {
      try {
        const response = await fetch(`${API_URL}/api/home`);

        if (!response.ok) {
          throw new Error(`Failed to fetch home data: ${response.status}`);
        }

        const data = await response.json();

        if (!mounted) return;

        if (data?.success && data?.home?.hero) {
          const apiHero = data.home.hero;

          setHero({
            ...DEFAULT_HERO,
            ...apiHero,

            video: {
              ...DEFAULT_HERO.video,
              ...(apiHero.video || {}),
            },

            poster: {
              ...DEFAULT_HERO.poster,
              ...(apiHero.poster || {}),
            },
          });
        }
      } catch (error) {
        console.error("Failed to load homepage hero:", error);
      }
    };

    fetchHome();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==================================================
     VIDEO / POSTER
  ================================================== */

  const videoUrl = hero?.video?.url || hero?.video?.playbackUrl || "";

  const posterUrl = hero?.poster?.url || "/images/hero.jpg";

  /* ==================================================
     HLS VIDEO PLAYBACK
  ================================================== */

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoUrl) return;

    // Safari and browsers with native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;

      video.play().catch((error) => {
        console.warn("Hero video autoplay prevented:", error);
      });

      return;
    }

    // Chrome / Edge / Firefox via hls.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((error) => {
          console.warn("Hero video autoplay prevented:", error);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("Hero HLS error:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;

            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    }

    console.error("HLS is not supported in this browser.");
  }, [videoUrl]);

  return (
    <section
      className="
        relative
        flex
        min-h-[100svh]
        items-end
        overflow-hidden
        bg-black
      "
    >
      {/* ==================================================
          PAGE LOAD INTRO
      ================================================== */}

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 1.1,
          delay: 1.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-black
        "
        aria-hidden="true"
      >
        <div className="overflow-hidden px-6">
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="text-center"
          >
            {/* BRAND TEXT */}

            <motion.p
              initial={{
                opacity: 0,
                letterSpacing: "0.05em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: "0.3em",
              }}
              transition={{
                duration: 0.8,
                delay: 0.45,
              }}
              className="
                mb-5
                text-[9px]
                font-bold
                uppercase
                text-white/40

                sm:text-xs
              "
            >
              Being IBAN Entertainment
            </motion.p>

            {/* INTRO TITLE */}

            <div className="overflow-hidden">
              <motion.h2
                initial={{
                  y: "100%",
                }}
                animate={{
                  y: 0,
                }}
                transition={{
                  duration: 1,
                  delay: 0.55,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="
                  font-display
                  text-[clamp(2.8rem,10vw,7rem)]
                  font-black
                  uppercase
                  leading-[0.82]
                  tracking-[-0.06em]
                  text-white
                "
              >
                Stories
                <br />
                <span className="text-studio-red">that move.</span>
              </motion.h2>
            </div>
          </motion.div>
        </div>

        {/* RED LOADING LINE */}

        <motion.div
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: 1,
          }}
          transition={{
            duration: 1.4,
            delay: 0.4,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[18%]
            left-1/2
            h-px
            w-32
            origin-left
            -translate-x-1/2
            bg-studio-red

            sm:w-48
          "
        />
      </motion.div>

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="absolute inset-0">
        {/* POSTER / FALLBACK IMAGE */}

        <img
          src={posterUrl}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            opacity-60
          "
        />

        {videoUrl && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={posterUrl}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-60
            "
            onLoadedData={() => {
              console.log("Hero video loaded:", videoUrl);
            }}
            onError={(event) => {
              console.error("Hero video error:", event.currentTarget.error);
              console.error("Hero video URL:", videoUrl);
            }}
          />
        )}
      </div>

      {/* ==================================================
          OVERLAYS
      ================================================== */}

      {/* Overall dark overlay */}

      <div
        className="
          absolute
          inset-0
          bg-black/40
        "
      />

      {/* Bottom gradient */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black
          via-black/30
          to-transparent
        "
      />

      {/* Left gradient */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/80
          via-black/30
          to-transparent
        "
      />

      {/* ==================================================
          HERO CONTENT
      ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 2.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          w-full
          px-6
          pb-10

          sm:px-7
          sm:pb-14

          md:px-8
          md:pb-20

          lg:px-6
          lg:pb-24
        "
      >
        <div className="w-full">
          {/* ==================================================
              EYEBROW
          ================================================== */}

          <div
            className="
              mb-7
              flex
              items-center
              gap-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white/55

              sm:mb-8
              sm:text-[10px]

              md:mb-9
              md:text-xs
            "
          >
            <span
              className="
                h-px
                w-9
                shrink-0
                bg-studio-red

                sm:w-10
                md:w-11
              "
            />

            <span>Being IBAN Entertainment</span>
          </div>

          {/* ==================================================
              MAIN HEADING
          ================================================== */}

          <h1 className=" font-display font-black uppercase text-white /* Mobile */ text-[clamp(2.2rem,11vw,3.8rem)] leading-[0.86] tracking-[-0.045em] /* Small tablets */ sm:text-[clamp(3rem,9vw,5.5rem)] sm:leading-[0.84] sm:tracking-[-0.05em] /* Tablets */ md:text-[clamp(4rem,8vw,7rem)] md:leading-[0.82] /* Desktop */ lg:text-[clamp(5rem,9vw,10rem)] lg:leading-[0.82] lg:tracking-[-0.06em] ">
            {/* LINE 1 */}
            <span className="block max-w-full ">
              {hero?.title || "Experience"}
            </span>

            {/* LINE 2 */}
            <span
              className="
      block
      max-w-full
      
    "
            >
              {hero?.subtitle || "the magic of"}
            </span>

            {/* LINE 3 */}
            <span className="block max-w-full  text-studio-red">
              Storytelling.
            </span>
          </h1>

          {/* ==================================================
              DESCRIPTION + CTA
          ================================================== */}

          <div
            className="
              mt-12
              flex
              flex-col
              gap-8

              sm:mt-14

              md:mt-16

              lg:flex-row
              lg:items-end
              lg:justify-between
              lg:gap-10
            "
          >
            {/* DESCRIPTION */}

            <p
              className="
                max-w-[680px]
                text-xs
                leading-6
                text-white/65

                sm:text-sm
                sm:leading-6

                md:text-base

                lg:text-[15px]
              "
            >
              {hero?.description ||
                "A grand movie premiere backdrop, with lights, a red carpet, and an audience."}
            </p>

            {/* ==================================================
                CTA BUTTONS
            ================================================== */}

            <div
              className="
                flex
                w-full
                flex-col
                gap-3

                sm:w-auto
                sm:flex-row
              "
            >
              {/* VIEW OUR WORK */}

              <Link
                to="/portfolio"
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-4
                  border
                  border-white/20
                  px-7
                  py-4
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  transition-all
                  duration-300

                  hover:border-studio-red
                  hover:bg-studio-red

                  sm:min-w-[220px]
                "
              >
                <span>View Our Work</span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />
              </Link>

              {/* OUR SERVICES */}

              <Link
                to="/services"
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-4
                  border
                  border-white/20
                  px-7
                  py-4
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  transition-all
                  duration-300

                  hover:border-studio-red
                  hover:bg-studio-red

                  sm:min-w-[205px]
                "
              >
                <span>Our Services</span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          SCROLL INDICATOR
      ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 2.8,
        }}
        className="
          absolute
          bottom-6
          right-5
          hidden
          items-center
          gap-3
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-white/40

          sm:right-7
          md:right-10
          lg:flex
        "
      >
        <span>Scroll</span>

        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
