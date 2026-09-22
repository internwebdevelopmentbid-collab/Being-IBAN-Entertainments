// src/admin/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, PageTitle } from "../components/AdminUI";
import { adminJson } from "../utils/authFetch";

export default function Dashboard() {
  const [home, setHome] = useState(null);

  const [projects, setProjects] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [members, setMembers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        /*
         * Use the authenticated admin request helper.
         *
         * If the access token has expired, adminJson()
         * automatically refreshes the session and retries
         * the original request.
         */
        const [
          homeResult,
          projectsResult,
          sponsorsResult,
          membersResult,
          jobsResult,
        ] = await Promise.all([
          adminJson("/api/home"),
          adminJson("/api/projects"),
          adminJson("/api/sponsors"),
          adminJson("/api/members"),
          adminJson("/api/jobs"),
        ]);

        if (!mounted) return;

        /* ==================================================
           HOME
        ================================================== */

        if (homeResult?.success) {
          setHome(homeResult.home || null);
        }

        /* ==================================================
           PROJECTS
        ================================================== */

        if (projectsResult?.success) {
          setProjects(projectsResult.projects || []);
        }

        /* ==================================================
           SPONSORS
        ================================================== */

        if (sponsorsResult?.success) {
          setSponsors(sponsorsResult.sponsors || []);
        }

        /* ==================================================
           MEMBERS
        ================================================== */

        if (membersResult?.success) {
          setMembers(membersResult.members || []);
        }

        /* ==================================================
           JOBS
        ================================================== */

        if (jobsResult?.success) {
          setJobs(jobsResult.jobs || []);
        }
      } catch (error) {
        console.error("Dashboard data error:", error);

        /*
         * A 401 after the refresh attempt means the admin
         * session is no longer valid.
         *
         * ProtectedAdminRoute will handle redirecting
         * the user to the login page.
         */
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==================================================
     COUNTS
  ================================================== */

  const publishedJobs = jobs.filter((job) => {
    const status = String(job.status || "").toLowerCase();

    return status === "published";
  });

  /* ==================================================
     HERO MEDIA
  ================================================== */

  const heroVideo =
    home?.hero?.video?.url || home?.hero?.video?.playbackUrl || "";

  const heroPoster = home?.hero?.poster?.url || "";

  return (
    <div>
      <PageTitle
        eyebrow="Studio Control"
        title="Dashboard"
        description="Manage the content, media and publishing workflow for Being IBAN Entertainments."
      />

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div className="mt-8 border border-white/10 bg-white/[0.02] px-5 py-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Loading studio data...
          </p>
        </div>
      ) : (
        <>
          {/* ==================================================
              LOWER CONTENT
          ================================================== */}

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* ==================================================
                HOMEPAGE
            ================================================== */}

            <Card>
              <div className="border-b border-white/10 px-5 py-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Homepage
                </p>

                <h2 className="mt-2 text-lg font-bold">Current Hero</h2>
              </div>

              <div className="p-5">
                <div className="aspect-video overflow-hidden bg-black">
                  {heroVideo ? (
                    <video
                      src={heroVideo}
                      poster={heroPoster || undefined}
                      muted
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : heroPoster ? (
                    <img
                      src={heroPoster}
                      alt="Homepage hero"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                      No Hero Media
                    </div>
                  )}
                </div>

                {/* ==================================================
                    HERO TEXT
                ================================================== */}

                <div className="mt-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                    {home?.hero?.subtitle || "Homepage Hero"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {home?.hero?.title || "No hero title set"}
                  </h3>

                  {home?.hero?.description && (
                    <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/40">
                      {home.hero.description}
                    </p>
                  )}
                </div>

                <Link
                  to="/admin/home"
                  className="mt-5 inline-flex items-center text-[9px] font-bold uppercase tracking-[0.2em] text-red-500 transition-colors hover:text-white"
                >
                  Manage Home
                  <ArrowUpRight size={13} className="ml-2" />
                </Link>
              </div>
            </Card>

            {/* ==================================================
                STUDIO SUMMARY
            ================================================== */}

            <Card>
              <div className="border-b border-white/10 px-5 py-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Studio
                </p>

                <h2 className="mt-2 text-lg font-bold">Content Overview</h2>
              </div>

              <div className="divide-y divide-white/10">
                {/* ==================================================
                    PROJECTS
                ================================================== */}

                <Link
                  to="/admin/projects"
                  className="group flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:text-white">
                      Projects
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Published & upcoming work
                    </p>
                  </div>

                  <span className="text-lg font-black text-white/70 group-hover:text-red-500">
                    {projects.length}
                  </span>
                </Link>

                {/* ==================================================
                    SPONSORS
                ================================================== */}

                <Link
                  to="/admin/sponsors"
                  className="group flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:text-white">
                      Sponsors
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Sponsor logos & visibility
                    </p>
                  </div>

                  <span className="text-lg font-black text-white/70 group-hover:text-red-500">
                    {sponsors.length}
                  </span>
                </Link>

                {/* ==================================================
                    MEMBERS
                ================================================== */}

                <Link
                  to="/admin/members"
                  className="group flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:text-white">
                      Members
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Studio leadership & team
                    </p>
                  </div>

                  <span className="text-lg font-black text-white/70 group-hover:text-red-500">
                    {members.length}
                  </span>
                </Link>

                {/* ==================================================
                    CAREERS
                ================================================== */}

                <Link
                  to="/admin/careers"
                  className="group flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:text-white">
                      Careers
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Open studio opportunities
                    </p>
                  </div>

                  <span className="text-lg font-black text-white/70 group-hover:text-red-500">
                    {publishedJobs.length}
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
