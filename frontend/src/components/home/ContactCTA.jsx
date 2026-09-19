import { Link } from "react-router-dom";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-32 lg:px-10 lg:py-48">
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-studio-red/20 blur-[120px]" />

      <div className="relative z-10 container-studio text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
          Start Something
        </p>

        <h2 className="mx-auto max-w-5xl font-display text-6xl font-bold leading-[0.85] tracking-tight md:text-9xl">
          Got a project
          <br />
          in mind<span className="text-studio-red">?</span>
        </h2>

        <Link
          to="/contact"
          className="mt-12 inline-flex px-8 py-5 text-sm font-bold bg-studio-red uppercase tracking-wider text-black transition hover:text-white"
        >
          Contact Us →
        </Link>
      </div>
    </section>
  );
}
