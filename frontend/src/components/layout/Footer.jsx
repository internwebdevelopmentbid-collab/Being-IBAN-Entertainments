import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-900 px-6 pb-8 pt-24 text-white lg:px-10">
      {/* ==================================================
          LARGE BLACK BRAND WATERMARK
      ================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1rem] left-0 z-0 w-full select-none text-right font-display text-[15vw] font-black leading-[0.78] tracking-[-0.09em] text-black/40 sm:text-[12vw] lg:bottom-[-3rem] lg:text-[9vw]"
      >
        BEING IBAN
        <br />
        ENTERTAINMENTS
      </div>

      {/* ==================================================
          SUBTLE BACKGROUND DEPTH
      ================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-gray-800/40 via-transparent to-black/30"
      />

      {/* Red ambient glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/[0.06] blur-3xl"
      />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="container-studio relative z-10">
        {/* ==================================================
            MAIN FOOTER
        ================================================== */}

        <div className="grid gap-14 border-b border-white/10 pb-20 md:grid-cols-2 lg:grid-cols-4">
          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="lg:col-span-2">
            <img
              src="/images/logo.png"
              alt="Being IBAN Entertainments"
              className="h-45 w-auto object-contain lg:h-50"
            />

            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
              We create films, campaigns, experiences and visual worlds designed
              to move audiences.
            </p>

            <Link
              to="/contact"
              className="group mt-9 inline-flex items-center gap-3 border-b-2 border-white pb-2.5 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:border-red-600 hover:text-red-500"
            >
              Start a conversation
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {/* ==================================================
              EXPLORE
          ================================================== */}

          <div>
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.3em] text-white/35">
              Explore
            </p>

            <div className="flex flex-col gap-4">
              <Link
                to="/about"
                className="group flex items-center text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="mr-3 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-5" />
                About Us
              </Link>

              <Link
                to="/services"
                className="group flex items-center text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="mr-3 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-5" />
                Services
              </Link>

              <Link
                to="/portfolio"
                className="group flex items-center text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="mr-3 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-5" />
                Portfolio
              </Link>

              <Link
                to="/careers"
                className="group flex items-center text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="mr-3 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-5" />
                Careers
              </Link>

              <Link
                to="/blog"
                className="group flex items-center text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="mr-3 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-5" />
                Blog
              </Link>
            </div>
          </div>

          {/* ==================================================
              CONNECT
          ================================================== */}

          <div>
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.3em] text-white/35">
              Connect
            </p>

            <div className="flex flex-col gap-4">
              {/* EMAIL */}

              <a
                href="mailto:contact@beingibanentertainments.com"
                className="text-base font-medium text-white/60 transition-colors duration-300 hover:text-red-500"
              >
                contact@beingibanentertainments.com
              </a>

              {/* FACEBOOK */}

              <a
                href="https://www.facebook.com/beingibanentertainments/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <Facebook
                  size={18}
                  strokeWidth={1.8}
                  className="transition-colors group-hover:text-[#1877F2]"
                />
                Facebook
              </a>

              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/beingibanentertainments/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <Instagram
                  size={18}
                  strokeWidth={1.8}
                  className="transition-colors group-hover:text-[#8a49a1]"
                />
                Instagram
              </a>

              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/company/being-iban-entertainments/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-base font-medium text-white/60 transition-colors duration-300 hover:text-white"
              >
                <Linkedin
                  size={18}
                  strokeWidth={1.8}
                  className="transition-colors group-hover:text-[#0a66c2]"
                />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* ==================================================
            BOTTOM BAR
        ================================================== */}

        <div className="relative flex flex-col justify-between gap-5 pt-7 text-xs font-semibold uppercase tracking-wider text-white/35 sm:text-sm md:flex-row md:items-center">
          <p>
            This Website is © 2025 under Being Iban Entertainments. Alright
            Reserved.
          </p>

          <div className="flex gap-7">
            <Link
              to="/privacy"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
