import Hero from "../components/home/Hero";
import FeaturedProjects from "../components/home/FeaturedProjects";
import ServicesSnapshot from "../components/home/ServicesSnapshot";
import AboutTeaser from "../components/home/AboutTeaser";
import ClientLogos from "../components/home/ClientLogos";
import Socials from "../components/home/Socials";
import LatestBlog from "../components/home/LatestBlog";
import CareersTeaser from "../components/home/CareersTeaser";
import ContactCTA from "../components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />

      <FeaturedProjects />

      <ServicesSnapshot />

      <AboutTeaser />

      <ClientLogos />

      <Socials />

      <LatestBlog />

      <CareersTeaser />

      <ContactCTA />
    </>
  );
}
