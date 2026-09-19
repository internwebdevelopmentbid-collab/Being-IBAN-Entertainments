import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   PAGE RESOLUTION
================================================== */

const getPageKey = (pathname) => {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/") {
    return "home";
  }

  if (normalizedPath.startsWith("/blog/")) {
    return "blog";
  }

  const segments = normalizedPath.split("/").filter(Boolean);

  return segments[0] || "home";
};

/* ==================================================
   COMPONENT
================================================== */

export default function PosterPopup() {
  const location = useLocation();

  const [poster, setPoster] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const page = getPageKey(location.pathname);

    setPoster(null);
    setVisible(false);

    const loadPoster = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/posters/active?page=${encodeURIComponent(page)}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error(`Poster request failed: ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!data?.poster?.image?.url) {
          setPoster(null);
          return;
        }

        setPoster(data.poster);

        /*
         * Show poster after 3 seconds.
         */

        timer = window.setTimeout(() => {
          if (!cancelled) {
            setVisible(true);
          }
        }, 3000);
      } catch (error) {
        console.error("Poster popup failed:", error);

        if (!cancelled) {
          setPoster(null);
          setVisible(false);
        }
      }
    };

    loadPoster();

    return () => {
      cancelled = true;

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [location.pathname]);

  /* ==================================================
     CLOSE
  ================================================== */

  const closePoster = () => {
    setVisible(false);
  };

  /* ==================================================
     BACKDROP CLICK
  ================================================== */

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closePoster();
    }
  };

  if (!poster || !visible) {
    return null;
  }

  const imageUrl = poster?.image?.url;
  const link = poster?.link?.trim();

  return (
    <div
      className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/80 px-3 py-5 backdrop-blur-sm sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label={poster.title || "Promotional poster"}
      onClick={handleBackdropClick}
    >
      {/* ==================================================
          POSTER CONTAINER
      ================================================== */}

      <div className="relative w-full max-w-[650px] sm:max-w-[680px] lg:max-w-[720px]">
        {/* ==================================================
            CLOSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={closePoster}
          aria-label="Close poster"
          className="absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center bg-black/85 text-white transition-all duration-200 hover:bg-red-500 sm:right-3 sm:top-3"
        >
          <X size={21} strokeWidth={1.8} />
        </button>

        {/* ==================================================
            IMAGE
        ================================================== */}

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden border border-white/10 bg-black shadow-[0_25px_100px_rgba(0,0,0,0.7)]"
          >
            <img
              src={imageUrl}
              alt={poster.title || "Promotional poster"}
              className="block max-h-[90vh] w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* ==================================================
                OPEN LINK INDICATOR
            ================================================== */}

            <span className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/85 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Open
              <ExternalLink size={12} strokeWidth={1.8} />
            </span>
          </a>
        ) : (
          <div className="overflow-hidden border border-white/10 bg-black shadow-[0_25px_100px_rgba(0,0,0,0.7)]">
            <img
              src={imageUrl}
              alt={poster.title || "Promotional poster"}
              className="block max-h-[90vh] w-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
