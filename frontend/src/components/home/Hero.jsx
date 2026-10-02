import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   DEFAULT HERO
================================================== */

const DEFAULT_HERO = {
  title: "Experience",
  subtitle: "the magic of",
  accent: "Storytelling.",
  description:
    "A grand movie premiere backdrop, with lights, a red carpet, and an audience.",

  video: {
    url: "",
    publicId: "",
    playbackUrl: "",
  },
};

/* ==================================================
   HERO
================================================== */

export default function Hero() {
  const [hero, setHero] = useState(DEFAULT_HERO);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  /* ==================================================
     FETCH HOME DATA
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
     VIDEO URL
     
     IMPORTANT:
     Use the stored URL directly.
     
     Do NOT prefer playbackUrl here.
  ================================================== */

  const videoUrl = hero?.video?.url || "";

  /* ==================================================
     HLS DETECTION
  ================================================== */

  const isHls = videoUrl.toLowerCase().includes(".m3u8");

  /* ==================================================
     HLS / VIDEO PLAYBACK
  ================================================== */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let hls = null;
    let destroyed = false;

    /* --------------------------------------------------
       CLEANUP
    -------------------------------------------------- */

    const cleanup = () => {
      destroyed = true;

      if (hls) {
        try {
          hls.destroy();
        } catch (error) {
          console.warn("Hero HLS cleanup error:", error);
        }

        hls = null;
      }

      if (hlsRef.current) {
        hlsRef.current = null;
      }

      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch (error) {
        console.warn("Hero video cleanup error:", error);
      }
    };

    /*
     * No video configured.
     */
    if (!videoUrl) {
      cleanup();
      return cleanup;
    }

    /*
     * Make sure the video element is configured
     * for autoplay/background playback.
     */
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    /* ==================================================
       HLS.JS
       
       Prefer hls.js whenever the browser supports it.
    ================================================== */

    if (isHls && Hls.isSupported()) {
      console.log("Hero: using hls.js");

      hls = new Hls({
        enableWorker: true,

        lowLatencyMode: false,

        backBufferLength: 30,

        maxBufferLength: 30,

        maxMaxBufferLength: 60,

        manifestLoadingMaxRetry: 5,

        manifestLoadingRetryDelay: 1000,

        levelLoadingMaxRetry: 5,

        levelLoadingRetryDelay: 1000,

        fragLoadingMaxRetry: 5,

        fragLoadingRetryDelay: 1000,

        startFragPrefetch: true,
      });

      hlsRef.current = hls;

      /* ------------------------------------------------
         MEDIA ATTACHED
      ------------------------------------------------ */

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (destroyed) return;

        console.log("Hero: HLS media attached");

        console.log("Hero: loading HLS source:", videoUrl);

        hls.loadSource(videoUrl);
      });

      /* ------------------------------------------------
         MANIFEST LOADING
      ------------------------------------------------ */

      hls.on(Hls.Events.MANIFEST_LOADING, (_event, data) => {
        console.log("Hero: loading HLS manifest:", data?.url);
      });

      /* ------------------------------------------------
         MANIFEST LOADED
      ------------------------------------------------ */

      hls.on(Hls.Events.MANIFEST_LOADED, (_event, data) => {
        console.log("Hero: HLS manifest loaded:", data?.url);
      });

      /* ------------------------------------------------
         MANIFEST PARSED
      ------------------------------------------------ */

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        if (destroyed) return;

        console.log("Hero: HLS manifest parsed");

        console.log("Hero: available HLS levels:", data?.levels?.length);

        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        video
          .play()
          .then(() => {
            if (!destroyed) {
              console.log("Hero: HLS video playing");
            }
          })
          .catch((error) => {
            console.warn("Hero autoplay prevented:", error);
          });
      });

      /* ------------------------------------------------
         SEGMENT LOADING
      ------------------------------------------------ */

      hls.on(Hls.Events.FRAG_LOADING, (_event, data) => {
        if (data?.frag?.url) {
          console.log("Hero: loading HLS segment:", data.frag.url);
        }
      });

      /* ------------------------------------------------
         SEGMENT LOADED
      ------------------------------------------------ */

      hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
        if (data?.frag?.url) {
          console.log("Hero: HLS segment loaded:", data.frag.url);
        }
      });

      /* ------------------------------------------------
         HLS ERROR
      ------------------------------------------------ */

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("Hero HLS error:", data);

        console.error("Hero HLS error type:", data?.type);

        console.error("Hero HLS error details:", data?.details);

        console.error("Hero HLS fatal:", data?.fatal);

        console.error("Hero HLS URL:", videoUrl);

        /*
         * Non-fatal errors do not require
         * intervention.
         */
        if (!data?.fatal) {
          return;
        }

        /* --------------------------------------------
             NETWORK ERROR
          -------------------------------------------- */

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          console.warn("Hero: HLS network error. Retrying...");

          try {
            hls.startLoad();
          } catch (error) {
            console.error("Hero: HLS startLoad failed:", error);
          }

          return;
        }

        /* --------------------------------------------
             MEDIA ERROR
          -------------------------------------------- */

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          console.warn("Hero: HLS media error. Attempting recovery...");

          try {
            hls.recoverMediaError();
          } catch (error) {
            console.error("Hero: HLS media recovery failed:", error);
          }

          return;
        }

        /* --------------------------------------------
             UNKNOWN FATAL ERROR
          -------------------------------------------- */

        console.error("Hero: unrecoverable HLS error.");

        try {
          hls.destroy();
        } catch (error) {
          console.error("Hero: failed to destroy HLS:", error);
        }

        if (hlsRef.current === hls) {
          hlsRef.current = null;
        }

        hls = null;
      });

      return cleanup;
    }

    /* ==================================================
       NATIVE HLS
       
       Safari / iOS fallback.
    ================================================== */

    if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Hero: using native HLS playback");

      console.log("Hero: native HLS URL:", videoUrl);

      const handleLoadedMetadata = () => {
        if (destroyed) return;

        console.log("Hero: native HLS metadata loaded");

        video
          .play()
          .then(() => {
            if (!destroyed) {
              console.log("Hero: native HLS video playing");
            }
          })
          .catch((error) => {
            console.warn("Hero native HLS autoplay prevented:", error);
          });
      };

      const handleCanPlay = () => {
        if (destroyed) return;

        console.log("Hero: native HLS can play");

        if (video.paused) {
          video.play().catch((error) => {
            console.warn("Hero native HLS play failed:", error);
          });
        }
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      video.addEventListener("canplay", handleCanPlay);

      video.src = videoUrl;

      video.load();

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);

        video.removeEventListener("canplay", handleCanPlay);

        cleanup();
      };
    }

    /* ==================================================
       NORMAL VIDEO
       
       MP4 / WebM / other browser-supported video.
    ================================================== */

    if (!isHls) {
      console.log("Hero: using normal video playback");

      console.log("Hero video URL:", videoUrl);

      const handleLoadedMetadata = () => {
        if (destroyed) return;

        console.log("Hero: normal video metadata loaded");

        video
          .play()
          .then(() => {
            if (!destroyed) {
              console.log("Hero: normal video playing");
            }
          })
          .catch((error) => {
            console.warn("Hero normal video autoplay prevented:", error);
          });
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      video.src = videoUrl;

      video.load();

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);

        cleanup();
      };
    }

    /* ==================================================
       HLS NOT SUPPORTED
    ================================================== */

    console.error("Hero: HLS is not supported in this browser.");

    return cleanup;
  }, [videoUrl, isHls]);

  /* ==================================================
     VIDEO ERROR HANDLER
  ================================================== */

  const handleVideoError = (event) => {
    const mediaError = event.currentTarget.error;

    console.error("Hero video error:", mediaError);

    console.error("Hero video URL:", videoUrl);

    console.error("Hero video is HLS:", isHls);

    if (mediaError) {
      console.error("Hero MediaError code:", mediaError.code);

      console.error("Hero MediaError message:", mediaError.message);

      switch (mediaError.code) {
        case 1:
          console.error("Hero MediaError: MEDIA_ERR_ABORTED");
          break;

        case 2:
          console.error("Hero MediaError: MEDIA_ERR_NETWORK");
          break;

        case 3:
          console.error("Hero MediaError: MEDIA_ERR_DECODE");
          break;

        case 4:
          console.error("Hero MediaError: MEDIA_ERR_SRC_NOT_SUPPORTED");
          break;

        default:
          console.error("Hero MediaError: unknown error");
      }
    }
  };

  /* ==================================================
     RENDER
  ================================================== */

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
          BACKGROUND VIDEO
      ================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          overflow-hidden
          bg-black
        "
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
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
            onLoadedMetadata={() => {
              console.log("Hero video metadata loaded");
            }}
            onCanPlay={() => {
              console.log("Hero video can play");
            }}
            onPlaying={() => {
              console.log("Hero video is playing");
            }}
            onWaiting={() => {
              console.log("Hero video waiting for data");
            }}
            onStalled={() => {
              console.warn("Hero video stalled");
            }}
            onEnded={() => {
              console.log("Hero video ended. Loop should restart it.");
            }}
            onError={handleVideoError}
          />
        ) : (
          /*
           * No poster.
           *
           * No fallback image.
           *
           * No video means black background.
           */
          <div className="absolute inset-0 bg-black" />
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
          z-[1]
          bg-black/40
        "
      />

      {/* Bottom gradient */}

      <div
        className="
          absolute
          inset-0
          z-[2]
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
          z-[3]
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

          <h1
            className="
              font-display
              font-black
              uppercase
              text-white

              text-[clamp(2.2rem,11vw,3.8rem)]
              leading-[0.86]
              tracking-[-0.045em]

              sm:text-[clamp(3rem,9vw,5.5rem)]
              sm:leading-[0.84]
              sm:tracking-[-0.05em]

              md:text-[clamp(4rem,8vw,7rem)]
              md:leading-[0.82]

              lg:text-[clamp(5rem,9vw,10rem)]
              lg:leading-[0.82]
              lg:tracking-[-0.06em]
            "
          >
            {/* LINE 1 */}

            <span className="block max-w-full">
              {hero?.title || "Experience"}
            </span>

            {/* LINE 2 */}

            <span className="block max-w-full">
              {hero?.subtitle || "the magic of"}
            </span>

            {/* LINE 3 */}

            <span className="block max-w-full text-studio-red">
              {hero?.accent || "Storytelling."}
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
          z-10
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
