import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Reveal from "../ui/Reveal";

export default function AboutTeaser() {
  const [heroImage, setHeroImage] = useState("/images/studio.jpg");

  useEffect(() => {
    const fetchAboutCoverImage = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${apiUrl}/api/media?page=about&type=cover`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch About cover image.");
        }

        const result = await response.json();

        if (
          result.success &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const activeImage =
            result.data.find((media) => media.active !== false) ||
            result.data[0];

          if (activeImage?.url) {
            setHeroImage(activeImage.url);
          }
        }
      } catch (error) {
        console.error("Failed to load About cover image:", error);
      }
    };

    fetchAboutCoverImage();
  }, []);

  return (
    <section className="bg-studio-black">
      <div className="grid min-h-[700px] lg:grid-cols-2">
        <div className="relative min-h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Studio behind the scenes"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-studio-red/10 mix-blend-multiply" />
        </div>

        <div className="flex items-center px-6 py-24 lg:px-16">
          <Reveal>
            <div className="max-w-xl">
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-studio-red">
                Since 2025
              </p>

              <h2 className="font-display text-5xl font-bold leading-tight md:text-6xl">
                A Legacy of
                <span className="text-white/30"> Storytelling &</span>{" "}
                <span className="text-studio-red">Innovation.</span>
              </h2>

              <p className="mt-8 text-lg leading-relaxed text-white/50">
                Being Iban Entertainments is a creative powerhouse redefining
                storytelling in films, television, and digital media. Based in
                the vibrant cultural heart of Kolkata, we bring compelling
                stories to life through high-quality productions. Our passion
                for cinema and commitment to excellence make us a leading force
                in the entertainment industry.
              </p>

              <Link
                to="/about"
                className="mt-10 inline-block border-b border-white pb-2 text-sm font-bold uppercase tracking-wider"
              >
                More About Us →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
