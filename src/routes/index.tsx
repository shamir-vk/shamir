import { createFileRoute } from "@tanstack/react-router";
import { Background } from "@/components/portfolio/Background";
import { CursorGlow } from "@/components/portfolio/CursorGlow";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Services } from "@/components/portfolio/Services";
import { Skills } from "@/components/portfolio/Skills";
import { Work } from "@/components/portfolio/Work";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aria Lumen — Graphic Designer & Visual Creator" },
      {
        name: "description",
        content:
          "Independent graphic designer crafting luxury brand identities, packaging, social and UI for ambitious brands worldwide.",
      },
      { property: "og:title", content: "Aria Lumen — Graphic Designer & Visual Creator" },
      {
        property: "og:description",
        content: "Premium brand identity, packaging and digital design.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Work />
        <Testimonials />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
