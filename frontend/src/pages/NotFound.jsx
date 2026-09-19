import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-96px)] items-center overflow-hidden bg-studio-black px-6 py-24 text-white lg:px-10">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-studio-red/[0.08] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-studio-red/40 to-transparent"
      />

      <div className="container-studio relative z-10">
        <div className="max-w-5xl">
          {/* Label */}
          <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
            <span className="h-px w-8 bg-studio-red" />
            Error 404
          </p>

          {/* Main heading */}
          <h1 className="font-display text-[clamp(5rem,24vw,18rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">
            404
          </h1>

          <div className="mt-10 max-w-2xl">
            <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              This frame
              <br />
              <span className="text-white/30">doesn&apos;t exist.</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
              Looks like this page has gone off script. The URL you entered
              doesn&apos;t lead to a page in Being IBAN Entertainments.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex min-h-12 items-center justify-center gap-3 bg-studio-red px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              <ArrowLeft
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back Home
            </Link>

            <Link
              to="/portfolio"
              className="group inline-flex min-h-12 items-center justify-center gap-3 border border-white/20 px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition-all duration-300 hover:border-white hover:text-white"
            >
              Explore Our Work
              <ArrowUpRight
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* Bottom metadata */}
        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>Being IBAN Entertainments</span>
          <span>Keep creating. Keep telling stories.</span>
        </div>
      </div>
    </main>
  );
}
