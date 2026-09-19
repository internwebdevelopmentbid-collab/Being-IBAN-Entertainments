// src/components/home/Socials.jsx

import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";

import { motion } from "framer-motion";

const socials = [
  {
    name: "Facebook",
    handle: "Being IBAN Entertainments",
    href: "https://www.facebook.com/beingibanentertainments/",
    icon: Facebook,
    color: "#1877F2",
  },

  {
    name: "Instagram",
    handle: "@beingibanentertainments",
    href: "https://www.instagram.com/beingibanentertainments/",
    icon: Instagram,
    color: "#E4405F",
  },

  {
    name: "LinkedIn",
    handle: "Being IBAN Entertainments",
    href: "https://www.linkedin.com/company/being-iban-entertainments/",
    icon: Linkedin,
    color: "#0A66C2",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Socials() {
  return (
    <section className="relative overflow-hidden bg-studio-black px-6 py-24 sm:py-28 lg:px-10 lg:py-36">
      {/* Ambient Background */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        whileInView={{
          opacity: 0.12,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 1.4,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-studio-red blur-[140px]"
      />

      <div className="container-studio relative z-10">
        {/* Heading */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={containerVariants}
          className="max-w-4xl"
        >
          <motion.p
            variants={itemVariants}
            className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-studio-red sm:text-xs"
          >
            Stay Connected
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="font-display text-[3.2rem] font-black leading-[0.86] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Follow the
            <br />
            <span className="text-white/30">story.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-7 max-w-xl text-[12px] leading-6 text-white/45 sm:mt-9 sm:text-sm sm:leading-7"
          >
            Behind the scenes, new releases, creative projects and everything
            happening at Being IBAN Entertainments.
          </motion.p>
        </motion.div>

        {/* Social Cards */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={containerVariants}
          className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-3"
        >
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                variants={itemVariants}
                whileHover="hover"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 transition-colors duration-500 hover:border-studio-red/60 sm:p-7 lg:p-8"
              >
                {/* Red Accent */}

                <motion.div
                  variants={{
                    hover: {
                      width: "100%",
                    },
                  }}
                  initial={{
                    width: "0%",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="absolute left-0 top-0 h-[2px] bg-studio-red"
                />

                {/* Subtle Hover Glow */}

                <motion.div
                  variants={{
                    hover: {
                      opacity: 0.08,
                    },
                  }}
                  initial={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-studio-red blur-[70px]"
                />

                {/* Top Row */}

                <div className="relative z-10 flex items-start justify-between">
                  {/* Social Logo */}

                  <motion.div
                    variants={{
                      hover: {
                        rotate: -8,
                        scale: 1.08,
                      },
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-white/20"
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      style={{
                        color: social.color,
                      }}
                    />
                  </motion.div>

                  {/* Arrow */}

                  <motion.div
                    variants={{
                      hover: {
                        x: 5,
                        y: -5,
                        rotate: 0,
                      },
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="text-white/25 transition-colors duration-300 group-hover:text-studio-red"
                    />
                  </motion.div>
                </div>

                {/* Text */}

                <div className="relative z-10 mt-12">
                  <motion.p
                    variants={{
                      hover: {
                        scale: 1.08,
                        x: 2,
                      },
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: "left center",
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.28em] text-studio-red"
                  >
                    {social.name}
                  </motion.p>

                  <motion.p
                    variants={{
                      hover: {
                        scale: 1.04,
                        x: 2,
                      },
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.02,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformOrigin: "left center",
                    }}
                    className="mt-3 text-sm font-semibold text-white/70 transition-colors duration-300 group-hover:text-white sm:text-base"
                  >
                    {social.handle}
                  </motion.p>
                </div>

                {/* Bottom Line */}

                <motion.div
                  variants={{
                    hover: {
                      scaleX: 1,
                    },
                  }}
                  initial={{
                    scaleX: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="relative z-10 mt-8 h-px origin-left bg-studio-red/40"
                />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Bottom Statement */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
            Being IBAN Entertainments
          </p>

          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-studio-red" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
              More stories. More moments.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
