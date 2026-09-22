import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import HomeManager from "./pages/HomeManager";
import ProjectManager from "./pages/ProjectManager";
import SponsorManager from "./pages/SponsorManager";
import MembersManager from "./pages/MembersManager";
import ServicesManager from "./pages/ServicesManager";
import CareersManager from "./pages/CareersManager";
import BlogManager from "./pages/BlogManager";
import MediaLibrary from "./pages/MediaLibrary";
import ContactManager from "./pages/ContactManager";
import PosterManager from "./pages/PosterManager";

function AdminApp() {
  return (
    <Routes>
      {/* ==================================================
          ADMIN LOGIN
          PUBLIC ROUTE
          /admin/login
      ================================================== */}

      <Route path="login" element={<AdminLogin />} />

      {/* ==================================================
          PROTECTED ADMIN AREA
          Everything inside this route requires authentication.
      ================================================== */}

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* /admin */}
          <Route index element={<Dashboard />} />

          {/* /admin/home */}
          <Route path="home" element={<HomeManager />} />

          {/* /admin/projects */}
          <Route path="projects" element={<ProjectManager />} />

          {/* /admin/sponsors */}
          <Route path="sponsors" element={<SponsorManager />} />

          {/* /admin/members */}
          <Route path="members" element={<MembersManager />} />

          {/* /admin/services */}
          <Route path="services" element={<ServicesManager />} />

          {/* /admin/careers */}
          <Route path="careers" element={<CareersManager />} />

          {/* /admin/blog */}
          <Route path="blog" element={<BlogManager />} />

          {/* /admin/media */}
          <Route path="media" element={<MediaLibrary />} />

          {/* /admin/contacts */}
          <Route path="contacts" element={<ContactManager />} />

          {/* /admin/poster */}
          <Route path="poster" element={<PosterManager />} />

          {/* Unknown admin route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminApp;
