import { ArrowUpRight } from "lucide-react";

const SISTER_COMPANY_URL = "https://beingibandigital.in/";

export default function SisterCompany() {
  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden border border-white/10 bg-white/[0.02]">
          {/* Red accent */}

          <div className="absolute left-0 top-0 h-full w-[2px] bg-[#754c16]" />

          <div className="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[180px_1fr_auto] lg:gap-14 lg:p-14">
            {/* LOGO */}

            <div className="flex justify-start">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black sm:h-40 sm:w-40">
                <img
                  src="/images/Being_Iban_Digital.png"
                  alt="Being Iban Digital"
                  className="h-full w-full object-contain p-5"
                />
              </div>
            </div>

            {/* CONTENT */}

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#754c16]">
                Sister Company
              </p>

              <h2 className="mt-4 max-w-3xl font-display text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Being
                <span className="text-[#754c16]"> Iban</span>
                <span> Digital</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                Being Iban Digital turns ideas into digital experiences that
                move people. Born from the creative vision of Being Iban
                Entertainments, we combine technology, strategy, design,
                branding, and performance marketing to build bold digital
                identities and experiences that make businesses impossible to
                ignore.
              </p>
            </div>

            {/* CTA */}

            <div className="lg:justify-self-end">
              <a
                href={SISTER_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-3 border border-[#754c16] bg-[#754c16] px-6 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition"
              >
                Visit Being Iban Digital
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </div>

          {/* Footer strip */}

          <div className="flex items-center justify-between border-t border-white/10 px-7 py-4 sm:px-10 lg:px-14">
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">
              Being Iban Group
            </span>

            <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
              Digital & Technology
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
