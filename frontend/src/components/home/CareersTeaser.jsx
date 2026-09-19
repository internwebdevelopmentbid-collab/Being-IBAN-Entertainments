import { Link } from "react-router-dom";

export default function CareersTeaser() {
  return (
    <section className="bg-studio-red px-6 py-24 text-white lg:px-10 lg:py-32">
      <div className="container-studio flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            Careers
          </p>

          <h2 className="max-w-4xl font-display text-6xl font-bold leading-[0.85] tracking-tight md:text-8xl">
            Join our
            <br />
            crew.
          </h2>
        </div>

        <div className="max-w-md">
          <p className="mb-8 text-lg leading-relaxed text-white/70">
            For makers, storytellers, designers, technologists and
            problem-solvers who want to make ambitious work.
          </p>

          <Link
            to="/careers"
            className="group inline-flex items-center gap-4 border border-black bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-black hover:bg-black hover:text-studio-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
          >
            <span>See Open Roles</span>

            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
