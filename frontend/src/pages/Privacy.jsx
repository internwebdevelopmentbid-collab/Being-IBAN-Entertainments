import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Who We Are",
    content: (
      <p>
        Being Iban Entertainments (“we”, “our”, “us”) is an entertainment
        production company based in Kolkata, West Bengal, India. We specialize
        in creating high-quality films, short films, web series, television
        content, and offer creative consulting services in cinematography,
        lighting, story development and more.
      </p>
    ),
  },
  {
    number: "02",
    title: "Scope of This Policy",
    content: (
      <p>
        This Privacy Policy applies to any personal data you provide through our
        websites, forms, email communications, consultations, services inquiry
        processes, or other interactions.
      </p>
    ),
  },
  {
    number: "03",
    title: "Personal Information We Collect",
    content: (
      <>
        <p className="mb-6">
          Depending on how you interact with us, we may collect:
        </p>

        <ul>
          <li>
            <strong>Identity &amp; Contact:</strong> Name, email, phone number,
            organization.
          </li>
          <li>
            <strong>Project Inquiry Details:</strong> Story outline, project
            requirements, messages.
          </li>
          <li>
            <strong>Device &amp; Usage Data:</strong> IP address, browser type,
            pages visited, cookies/analytics.
          </li>
          <li>
            <strong>Optional Metadata:</strong> Portfolio files, messages, mood
            boards, or scripts submitted voluntarily.
          </li>
        </ul>

        <p className="mt-6">
          We do <strong>not</strong> knowingly collect personal data from
          children under 13.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "How We Use Your Data",
    content: (
      <>
        <p className="mb-6">Your personal information is used for:</p>

        <ul>
          <li>Responding to your inquiries, proposals, or service requests.</li>
          <li>Quoting and contracting for creative or production services.</li>
          <li>Communicating project updates, scheduling, or follow-up.</li>
          <li>
            Administering our Site and improving our services with analytics.
          </li>
        </ul>

        <p className="mt-6">
          We retain information only as long as necessary to fulfill these
          purposes or as required by law.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "How We Share Your Data",
    content: (
      <>
        <p className="mb-6">We may share personal information with:</p>

        <ul>
          <li>
            <strong>Trusted Third-Party Providers:</strong> e.g. email, forms
            hosting, analytics, payment processors.
          </li>
          <li>
            <strong>Legal Authorities:</strong> if required by law or to protect
            our rights/confidentiality.
          </li>
          <li>
            <strong>Mergers or Acquisitions:</strong> in the event of business
            restructuring.
          </li>
        </ul>

        <p className="mt-6">
          We will <strong>never sell or rent</strong> your personal data for
          advertising or unrelated purposes.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Cookies & Tracking",
    content: (
      <>
        <p className="mb-6">
          We may use cookies and analytics tools (e.g. Google Analytics) to:
        </p>

        <ul>
          <li>Improve site experience and navigation.</li>
          <li>Understand user behavior and metrics.</li>
          <li>Offer tailored content or communications.</li>
        </ul>

        <p className="mt-6">
          You can disable cookies in your browser, but this may impact site
          functionality.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Your Rights & Choices",
    content: (
      <>
        <p className="mb-6">You have the right to:</p>

        <ul>
          <li>Access, correct, update, or delete your personal information.</li>
          <li>
            Withdraw consent where applicable (without affecting past
            processing).
          </li>
          <li>
            Opt out of promotional emails at any time (via unsubscribe or
            contact).
          </li>
          <li>
            Request restriction or portability of your data, where applicable by
            law.
          </li>
        </ul>

        <p className="mt-6">
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:contact@beingibanentertainments.com"
            className="font-semibold text-black underline decoration-black/20 underline-offset-4 transition-colors hover:text-studio-red"
          >
            contact@beingibanentertainments.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Security Measures",
    content: (
      <p>
        We implement reasonable technical, administrative, and physical
        safeguards to protect your data from unauthorized access or disclosure.
        However, no internet-based system can offer absolute security, and
        liability is limited accordingly.
      </p>
    ),
  },
  {
    number: "09",
    title: "Data Retention",
    content: (
      <>
        <p className="mb-6">
          We retain personal information only as long as needed to:
        </p>

        <ul>
          <li>Respond to your inquiries or contractual obligations.</li>
          <li>Meet legal, accounting, or administrative requirements.</li>
        </ul>

        <p className="mt-6">
          Once data is no longer necessary, we securely delete or anonymize it.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Third-Party Links",
    content: (
      <p>
        Our Site may link to external websites (such as Vimeo, LinkedIn, or
        social media platforms). This Privacy Policy does <strong>not</strong>{" "}
        apply to third-party sites. Please review their privacy policies
        separately.
      </p>
    ),
  },
  {
    number: "11",
    title: "International Transfers",
    content: (
      <p>
        If you are outside India, your data may be transferred securely to our
        office or service providers in India or other countries. We ensure
        appropriate safeguards for such transfers as required by applicable law.
      </p>
    ),
  },
  {
    number: "12",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy over time. We will post the revised
        version on our Site with an updated “Last Updated” date. Continued use
        of our Site after updates constitutes acceptance.
      </p>
    ),
  },
  {
    number: "13",
    title: "Contact Us",
    content: (
      <>
        <p className="mb-6">
          If you have any questions, concerns, or requests related to your
          privacy or this policy, please contact us:
        </p>

        <div className="border-l-2 border-studio-red pl-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-black/45">
            Address
          </p>

          <p>
            5D, Unit B, New Town Square, above Anytime Fitness, Chinar Park,
            Action Area II, Rajarhat, Newtown, Kolkata, West Bengal 700136,
            India
          </p>

          <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-black/45">
            Email
          </p>

          <a
            href="mailto:contact@beingibanentertainments.com"
            className="font-semibold underline decoration-black/20 underline-offset-4 transition-colors hover:text-studio-red"
          >
            contact@beingibanentertainments.com
          </a>
        </div>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black px-6 pb-20 pt-40 text-white sm:px-8 sm:pb-24 sm:pt-44 lg:px-10 lg:pb-32 lg:pt-52">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(229,9,20,0.16),transparent_35%)]" />

        <div className="container-studio relative z-10">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/45 sm:text-xs">
            <span className="h-px w-8 bg-studio-red sm:w-12" />
            <span>Legal</span>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-studio-red">
                Last Updated: August 4, 2025
              </p>

              <h1 className="max-w-[1000px] font-display text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
                Privacy
                <br />
                <span className="text-white/35">Policy.</span>
              </h1>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/15 text-studio-red lg:h-20 lg:w-20">
              <ShieldCheck size={30} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-2rem] right-[-1rem] select-none font-display text-[18vw] font-black leading-none tracking-[-0.08em] text-white/[0.025]"
        >
          PRIVACY
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-black/10 bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="container-studio">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-studio-red">
                Your Data
              </p>
            </div>

            <div className="max-w-4xl">
              <p className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Your privacy is important to us. This policy explains how Being
                Iban Entertainments collects, uses, protects, and handles your
                personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POLICY CONTENT */}
      <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <div className="container-studio">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-0">
              {sections.map((section) => (
                <article
                  key={section.number}
                  className="grid gap-8 border-b border-black/10 py-12 first:pt-0 last:border-b-0 lg:grid-cols-[120px_280px_1fr] lg:gap-10 lg:py-16"
                >
                  <div className="font-display text-sm font-black tracking-widest text-studio-red">
                    {section.number}
                  </div>

                  <h2 className="font-display text-2xl font-black uppercase leading-none tracking-[-0.03em] sm:text-3xl">
                    {section.title}
                  </h2>

                  <div className="terms-content max-w-3xl text-[15px] leading-8 text-black/65 sm:text-base">
                    {section.content}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-studio-red px-6 py-16 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="container-studio">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                Being Iban Entertainments
              </p>

              <h2 className="max-w-4xl font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                Thank you for trusting us with your creative vision.
              </h2>
            </div>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-4 border border-black bg-black px-7 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-black hover:bg-black hover:text-studio-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
            >
              <span>Contact Us</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
