import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PosterPopup from "./components/layout/PosterPopup";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

import AdminApp from "./admin/AdminApp";

/* ==================================================
   PUBLIC LAYOUT
================================================== */

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* HOME */}

          <Route path="/" element={<Home />} />

          {/* WEBSITE */}

          <Route path="/about" element={<About />} />

          <Route path="/services" element={<Services />} />

          <Route path="/portfolio" element={<Portfolio />} />

          <Route path="/careers" element={<Careers />} />

          <Route path="/contact" element={<Contact />} />

          {/* BLOG */}

          <Route path="/blog" element={<Blog />} />

          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* LEGAL */}

          <Route path="/terms" element={<Terms />} />

          <Route path="/privacy" element={<Privacy />} />

          {/* 404 */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* ==================================================
          GLOBAL POSTER POPUP

          PosterPopup internally determines the current
          page and asks the backend whether a poster is
          enabled for that page.
      ================================================== */}

      <PosterPopup />
    </>
  );
}

/* ==================================================
   APP
================================================== */

function App() {
  return (
    <BrowserRouter>
      {/* ==================================================
          GLOBAL TOAST NOTIFICATIONS
      ================================================== */}

      <Toaster
        position="top-right"
        containerStyle={{
          top: "80px",
          right: "20px",
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,

          style: {
            background: "#111111",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0px",
            fontSize: "13px",
            fontWeight: "500",
            padding: "14px 16px",
          },

          success: {
            duration: 4000,

            style: {
              border: "1px solid rgba(34,197,94,0.25)",
            },

            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },

          error: {
            duration: 4000,

            style: {
              border: "1px solid rgba(239,68,68,0.25)",
            },

            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        {/* ==================================================
            ADMIN DASHBOARD

            PosterPopup is NOT mounted here.
        ================================================== */}

        <Route path="/admin/*" element={<AdminApp />} />

        {/* ==================================================
            PUBLIC WEBSITE

            PosterPopup is mounted inside PublicLayout.
        ================================================== */}

        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
