import { Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import Reveal from "../components/ui/Reveal";

const sections = [
  {
    number: "01",
    title: "Introduction and Acceptance of Terms",
    content: (
      <>
        <p>
          Welcome to the Being Iban Entertainments website and services (the
          “Site” or “Services”). By accessing or using this Site or our services
          in any way, you agree to be bound by these Terms of Service (the
          “Terms”) and our Privacy Policy.
        </p>

        <p>
          If you do not agree to all of these Terms, you must immediately
          discontinue use of our Site and services. Your use of the Site
          constitutes your acceptance of these Terms.
        </p>

        <p>
          These Terms form a binding legal agreement between you (the “User” or
          “Client”) and Being Iban Entertainments (the “Company,” “we,” “us,” or
          “our”), an entertainment production company based in Kolkata.
        </p>

        <p>
          We reserve the right to update or modify these Terms at any time, and
          such changes will be effective upon posting. You should review these
          Terms periodically. Your continued use of the Site or Services after
          any changes are posted will constitute acceptance of those changes.
        </p>
      </>
    ),
  },

  {
    number: "02",
    title: "Description of Services Provided",
    content: (
      <>
        <p>
          Being Iban Entertainments is a creative entertainment production
          company specializing in film, television and web series, and digital
          media content.
        </p>

        <p>
          We offer a range of media production services, including feature films
          and short films, television and web series production, branded and
          digital video content, and creative consulting for story development
          and scripts.
        </p>

        <p>
          Our goal is to craft compelling visual narratives that captivate and
          inspire audiences. We provide these services through project-based
          contracts and collaborations.
        </p>

        <p>
          While our website may showcase examples of our work, this Site is
          primarily informational. It does not itself sell tickets or stream
          content directly.
        </p>

        <p>
          Any specific service engagement, such as hiring us for a film or video
          project, will be subject to separate agreements.
        </p>
      </>
    ),
  },

  {
    number: "03",
    title: "User Responsibilities and Acceptable Use",
    content: (
      <>
        <p>
          As a User of our Site and Services, you agree to use them only for
          lawful purposes and in accordance with these Terms.
        </p>

        <h3>Comply with laws</h3>
        <p className="mt-3">
          You must obey all applicable laws and regulations in your use of the
          Site and Services. You may not use the Site for any illegal purpose.
        </p>

        <h3>Provide accurate information</h3>
        <p className="mt-3">
          Any information you provide to us, including information submitted
          through contact or inquiry forms, must be truthful, accurate, and
          complete. You are responsible for maintaining the confidentiality of
          any account credentials if provided.
        </p>

        <h3>Respect intellectual property and rights</h3>
        <p className="mt-3">
          You may not use our Site or Services to infringe on the intellectual
          property, privacy, or other rights of third parties.
        </p>

        <p>
          You may not upload or transmit any content that is defamatory,
          harassing, threatening, obscene, or otherwise unlawful. You may not
          post content that includes viruses, malware, or any code that could
          damage or interfere with any system or network.
        </p>

        <h3>No unauthorized access or interference</h3>
        <p className="mt-3">
          You agree not to attempt to gain unauthorized access to any portion of
          the Site or any other systems or networks connected to the Site.
        </p>

        <p>
          You may not use automated means, such as robots, scrapers, or scripts,
          to access or use the Site. You must not interrupt or damage our Site
          or Services, or harass or threaten other users.
        </p>

        <p>
          We reserve the right to remove or refuse service to any user at our
          discretion for any violation of these Terms or for inappropriate
          behavior.
        </p>

        <p>
          You will indemnify and hold us harmless from any claims resulting from
          your breach of these responsibilities.
        </p>
      </>
    ),
  },

  {
    number: "04",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p>
          All content, materials, and deliverables on the Site – including text,
          graphics, logos, images, audio or video clips, and the overall design
          – are owned by or licensed to Being Iban Entertainments.
        </p>

        <p>
          The Company retains all right, title, and interest in its intellectual
          property.
        </p>

        <p>
          You may not copy, reproduce, distribute, modify, publish, license,
          create derivative works of, or otherwise exploit any material on this
          Site without our prior written permission.
        </p>

        <p>
          Any content that you submit to us, such as scripts, ideas, or other
          materials in connection with a project, will be considered
          non-confidential and non-proprietary unless otherwise agreed in
          writing.
        </p>

        <p>
          You agree that we have the right to use, reproduce, and modify any
          information or materials you provide for any purpose in connection
          with the Services, provided we do not publicly disclose any personal
          or sensitive information in violation of our Privacy Policy.
        </p>
      </>
    ),
  },

  {
    number: "05",
    title: "Privacy and Data Handling",
    content: (
      <>
        <p>
          We respect your privacy and handle your personal data in accordance
          with our Privacy Policy.
        </p>

        <p>
          Any personal information you submit through the Site, for example via
          a contact form or email, will be used to respond to your inquiries and
          provide our Services.
        </p>

        <p>We will not sell your personal data to third parties.</p>

        <p>
          We encourage you to review our Privacy Policy for details on how we
          collect, use, store, and protect your information.
        </p>

        <p>
          By using our Site or Services, you consent to the data practices
          described in the Privacy Policy.
        </p>
      </>
    ),
  },

  {
    number: "06",
    title: "Payment and Refund Terms",
    content: (
      <>
        <p>
          Certain services offered by Being Iban Entertainments, such as custom
          video production or consulting, require payment of fees.
        </p>

        <p>
          Payment terms, including amounts and schedules, will be specified in
          the separate service contract or invoice provided to you.
        </p>

        <p>
          Unless otherwise agreed in writing, all fees are due according to the
          agreed schedule, including deposits and milestone payments.
        </p>

        <h3>Refunds</h3>

        <p className="mt-3">
          Because our services are customized and involve significant time and
          creative effort, fees paid are generally non-refundable once work has
          commenced.
        </p>

        <p>
          If you have prepaid a deposit and then cancel the project, we may
          apply the deposit toward future work, but we do not offer refunds
          except as required by law.
        </p>

        <p>
          Any cancellation or refund policy will be clearly stated in your
          project agreement.
        </p>

        <p>
          Late payments may incur interest or collection fees as allowed by law.
        </p>
      </>
    ),
  },

  {
    number: "07",
    title: "Disclaimers and Limitation of Liability",
    content: (
      <>
        <h3>Disclaimer of warranties</h3>

        <p className="mt-3">
          The Site and all services are provided “as is” and “as available,”
          with all faults and without warranty of any kind.
        </p>

        <p>
          To the fullest extent permitted by law, Being Iban Entertainments
          expressly disclaims all representations, warranties, and conditions,
          whether express, implied, or statutory, related to the Site or
          Services.
        </p>

        <p>
          This includes warranties of merchantability, fitness for a particular
          purpose, title, accuracy, and non-infringement.
        </p>

        <p>
          We do not warrant that the Site content is accurate, complete, or
          up-to-date, and we disclaim any duty to update the Site content.
        </p>

        <h3>Limitation of liability</h3>

        <p className="mt-3">
          You acknowledge that the Site is provided free of charge. To the
          maximum extent permitted by applicable law, the Company and its
          owners, officers, and employees shall not be liable for any indirect,
          incidental, consequential, special, or punitive damages arising out of
          or related to your use of the Site or Services.
        </p>

        <p>
          This includes, without limitation, lost profits, lost data, or loss of
          goodwill.
        </p>

        <p>
          Nothing in these Terms shall exclude or limit liability for death or
          personal injury caused by negligence, or for any other liability that
          cannot be limited or excluded under applicable law.
        </p>

        <h3>No guarantee of results</h3>

        <p className="mt-3">
          Being Iban Entertainments makes no promises about the outcomes of any
          project or service. While we strive for high-quality work, we do not
          guarantee any specific results, audience reach, or commercial success.
        </p>

        <h3>Availability of Site</h3>

        <p className="mt-3">
          We attempt to make the Site available 24/7, but we do not guarantee
          uninterrupted or error-free access.
        </p>

        <p>
          We may suspend or discontinue the Site, in whole or in part, without
          notice, and the Company will not be liable for any damages arising
          from such suspension or discontinuation.
        </p>
      </>
    ),
  },

  {
    number: "08",
    title: "Termination",
    content: (
      <>
        <p>
          Being Iban Entertainments may, in its sole discretion, suspend or
          terminate your access to the Site and Services at any time, for any
          reason, including if you breach these Terms, and without notice.
        </p>

        <p>
          Upon termination, your right to use the Site will immediately cease.
        </p>

        <p>
          If we terminate your access, you must stop using the Site and destroy
          any downloaded or printed materials.
        </p>

        <p>
          Likewise, you may terminate your use of the Site at any time by
          ceasing to access it.
        </p>

        <p>
          Any provisions of these Terms that by their nature should survive
          termination, such as provisions on intellectual property, disclaimers,
          limitations of liability, and governing law, will remain in effect.
        </p>
      </>
    ),
  },

  {
    number: "09",
    title: "Governing Law and Jurisdiction",
    content: (
      <>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of India, including the laws of the State of West Bengal.
        </p>

        <p>
          Any dispute arising out of or relating to these Terms or the use of
          the Site or Services shall be subject to the exclusive jurisdiction of
          the courts of Kolkata, West Bengal, India, and you hereby consent to
          such jurisdiction.
        </p>
      </>
    ),
  },

  {
    number: "10",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions, concerns, or disputes regarding these Terms
          of Service, or need to report a violation of these Terms, you may
          contact us at:
        </p>

        <div className="mt-8 border-l-2 border-studio-red pl-6">
          <p>
            <strong>Address:</strong>
            <br />
            5D, Unit B, New Town Square, above Anytime Fitness,
            <br />
            Chinar Park, Action Area II, Rajarhat,
            <br />
            Newtown, Kolkata, West Bengal 700136, India.
          </p>

          <p className="mt-5">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact@beingibanentertainments.com"
              className="transition-colors hover:text-studio-red"
            >
              contact@beingibanentertainments.com
            </a>
          </p>

          <p className="mt-3">
            <strong>Phone:</strong>{" "}
            <a
              href="tel:+916292058136"
              className="transition-colors hover:text-studio-red"
            >
              +91 62920-58136
            </a>
          </p>
        </div>

        <p className="mt-8">
          We will try to respond to any inquiries or complaints promptly. These
          are our official contact details for all legal notices related to
          these Terms.
        </p>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <main className="bg-studio-black text-white">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden px-6 pb-24 pt-40 lg:px-10 lg:pb-32 lg:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-red-600/[0.08] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-250px] left-[-150px] h-[500px] w-[500px] rounded-full bg-red-600/[0.04] blur-3xl"
        />

        <div className="container-studio relative">
          <Reveal>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
              <FileText size={15} />
              Legal
            </div>

            <h1 className="mt-7 max-w-5xl font-display text-6xl font-black leading-[0.85] tracking-[-0.05em] md:text-8xl lg:text-9xl">
              Terms of
              <br />
              <span className="text-white/25">Service.</span>
            </h1>

            <p className="mt-10 max-w-2xl text-base leading-relaxed text-white/45 md:text-lg">
              Please read these Terms of Service carefully before using the
              Being Iban Entertainments website or services.
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/30">
              <span className="h-px w-8 bg-studio-red" />
              Effective 2026
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================================================
          TERMS CONTENT
      ================================================== */}

      <section className="bg-white px-6 py-24 text-black lg:px-10 lg:py-32">
        <div className="container-studio">
          <div className="mx-auto max-w-6xl">
            {sections.map((section, index) => (
              <Reveal key={section.number} delay={index * 0.03}>
                <article className="grid gap-8 border-t border-black/15 py-14 md:grid-cols-[100px_1fr] md:gap-12 lg:py-20">
                  {/* NUMBER */}
                  <div>
                    <span className="font-display text-3xl font-black tracking-[-0.05em] text-studio-red">
                      {section.number}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="max-w-4xl">
                    <h2 className="font-display text-3xl font-black leading-[0.95] tracking-[-0.03em] md:text-4xl lg:text-5xl">
                      {section.title}
                    </h2>

                    <div className="terms-content mt-8  space-y-6 text-base leading-relaxed text-black/60 md:text-lg">
                      {section.content}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}

            {/* ==================================================
                ACKNOWLEDGMENT
            ================================================== */}

            <Reveal>
              <div className="border-t border-black/15 py-16 lg:py-20">
                <div className="border border-black/10 bg-black p-8 text-white md:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-studio-red">
                    Acknowledgment
                  </p>

                  <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/60 md:text-lg">
                    By continuing to use our Site and Services, you acknowledge
                    that you have read, understood, and agree to be bound by
                    these Terms of Service.
                  </p>

                  <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/60 md:text-lg">
                    Thank you for choosing Being Iban Entertainments – we look
                    forward to bringing your stories to life in compliance with
                    these terms.
                  </p>

                  <Link
                    to="/contact"
                    className="group mt-8 inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:border-studio-red hover:bg-studio-red"
                  >
                    Contact Us
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
