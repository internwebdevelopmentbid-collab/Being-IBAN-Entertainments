import { useEffect, useState } from "react";

import { ImagePlus, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";

import {
  Button,
  Card,
  Input,
  PageTitle,
  Select,
  StatusBadge,
  Textarea,
  Toggle,
  EmptyState,
} from "../components/AdminUI";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categories = [
  "Film",
  "Commercial",
  "Music Video",
  "Branded Content",
  "Animation",
];

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const emptyProject = {
  title: "",
  slug: "",
  category: "Film",
  type: "",
  year: String(new Date().getFullYear()),
  client: "",
  shortDescription: "",
  description: "",
  projectLink: "",
  displayOrder: 1,
  status: "published",
  homepageFeatured: false,

  coverImage: {
    url: "",
    publicId: "",
  },
};

function normalizeProject(project = {}) {
  return {
    ...emptyProject,
    ...project,

    coverImage: {
      ...emptyProject.coverImage,
      ...(project.coverImage || {}),
    },

    displayOrder:
      typeof project.displayOrder === "number"
        ? project.displayOrder
        : Number(project.displayOrder) || 1,

    status: project.status === "draft" ? "draft" : "published",

    homepageFeatured: Boolean(project.homepageFeatured),
  };
}

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null);

  const [uploading, setUploading] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* ==================================================
     FETCH PROJECTS
  ================================================== */

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/projects`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch projects");
      }

      setProjects(
        (result.projects || []).map((project) => normalizeProject(project)),
      );
    } catch (err) {
      console.error("Fetch projects error:", err);

      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     CREATE EMPTY PROJECT
  ================================================== */

  const createProject = () => {
    return normalizeProject({
      title: "",
      slug: "",

      category: "Film",

      type: "",

      year: String(new Date().getFullYear()),

      client: "",

      shortDescription: "",

      description: "",

      projectLink: "",

      displayOrder: projects.length + 1,

      status: "published",

      homepageFeatured: false,

      coverImage: {
        url: "",
        publicId: "",
      },
    });
  };

  /* ==================================================
     OPEN NEW
  ================================================== */

  const openNew = () => {
    setMessage("");
    setError("");

    setEditing(createProject());
  };

  /* ==================================================
     OPEN EDIT
  ================================================== */

  const openEdit = (project) => {
    setMessage("");
    setError("");

    setEditing(normalizeProject(project));
  };

  /* ==================================================
     UPDATE FIELD
  ================================================== */

  const updateField = (field, value) => {
    setEditing((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==================================================
     UPDATE COVER IMAGE
  ================================================== */

  const updateCoverImage = (field, value) => {
    setEditing((current) => ({
      ...current,

      coverImage: {
        ...current.coverImage,
        [field]: value,
      },
    }));
  };

  /* ==================================================
     UPLOAD COVER IMAGE
  ================================================== */

  const uploadCoverImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading("coverImage");

      setError("");
      setMessage("");

      const formData = new FormData();

      /*
       * IMPORTANT
       *
       * Backend uses:
       *
       * upload.single("file")
       *
       * Therefore the field MUST be:
       * "file"
       */

      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   file: {
       *     url,
       *     publicId
       *   }
       * }
       */

      const uploadedFile = result.file;

      if (!uploadedFile?.url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      setEditing((current) => ({
        ...current,

        coverImage: {
          url: uploadedFile.url || "",

          publicId: uploadedFile.publicId || "",
        },
      }));

      setMessage("Cover image uploaded successfully.");
    } catch (err) {
      console.error("Cover image upload error:", err);

      setError(err.message || "Failed to upload cover image");
    } finally {
      setUploading("");

      event.target.value = "";
    }
  };

  /* ==================================================
     SAVE PROJECT
  ================================================== */

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!editing.title?.trim()) {
        throw new Error("Project title is required.");
      }

      const slug = editing.slug?.trim() || slugify(editing.title);

      if (!slug) {
        throw new Error("Project slug is required.");
      }

      const payload = {
        title: editing.title.trim(),

        slug,

        category: editing.category || "",

        type: editing.type || "",

        year: editing.year || "",

        client: editing.client || "",

        shortDescription: editing.shortDescription || "",

        description: editing.description || "",

        projectLink: editing.projectLink || "",

        displayOrder: Number(editing.displayOrder) || 0,

        status: editing.status === "draft" ? "draft" : "published",

        homepageFeatured: Boolean(editing.homepageFeatured),

        coverImage: {
          url: editing.coverImage?.url || "",

          publicId: editing.coverImage?.publicId || "",
        },
      };

      const isEditing = Boolean(editing._id);

      const url = isEditing
        ? `${API_URL}/projects/${editing._id}`
        : `${API_URL}/projects`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save project");
      }

      const savedProject = normalizeProject(result.project);

      if (isEditing) {
        setProjects((current) =>
          current.map((project) =>
            project._id === savedProject._id ? savedProject : project,
          ),
        );
      } else {
        setProjects((current) => [...current, savedProject]);
      }

      setEditing(null);

      setMessage(
        isEditing
          ? "Project updated successfully."
          : "Project created successfully.",
      );
    } catch (err) {
      console.error("Save project error:", err);

      setError(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE PROJECT
  ================================================== */

  const remove = async (id) => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm("Delete this project permanently?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete project");
      }

      setProjects((current) => current.filter((project) => project._id !== id));

      setMessage("Project deleted successfully.");
    } catch (err) {
      console.error("Delete project error:", err);

      setError(err.message || "Failed to delete project");
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {
    return (
      <div>
        <PageTitle
          eyebrow="Content / Project"
          title="Projects"
          description="Manage portfolio projects."
        />

        <div className="border border-white/10 bg-white/[0.02] p-8 text-sm text-white/50">
          Loading projects...
        </div>
      </div>
    );
  }

  /* ==================================================
     UI
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Content / Project"
        title="Projects"
        description="Manage portfolio projects."
        action={
          <Button onClick={openNew}>
            <Plus size={15} />
            Add Project
          </Button>
        }
      />

      {/* ==================================================
          MESSAGES
      ================================================== */}

      {message && (
        <div className="mb-6 border border-green-500/20 bg-green-500/5 px-4 py-3 text-xs text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* ==================================================
          PROJECT LIST
      ================================================== */}

      {projects.length === 0 ? (
        <EmptyState>No portfolio projects have been added.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[90px_1fr_130px_100px_120px] border-b border-white/10 px-5 py-3 text-[8px] font-bold uppercase tracking-[0.2em] text-white/25 md:grid">
            <span>Image</span>
            <span>Project</span>
            <span>Category</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-white/10">
            {projects
              .slice()
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((project) => (
                <div
                  key={project._id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[90px_1fr_130px_100px_120px] md:items-center"
                >
                  {/* IMAGE */}

                  <div className="h-16 w-20 overflow-hidden bg-black">
                    {project.coverImage?.url ? (
                      <img
                        src={project.coverImage.url}
                        alt={project.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[8px] text-white/20">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* PROJECT */}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {project.title || "Untitled Project"}
                      </p>

                      {project.homepageFeatured && (
                        <span className="bg-red-500/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-red-400">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[10px] text-white/30">
                      {project.year || "—"} · {project.type || "Project"}
                    </p>
                  </div>

                  {/* CATEGORY */}

                  <p className="text-xs text-white/40">
                    {project.category || "—"}
                  </p>

                  {/* STATUS */}

                  <StatusBadge
                    status={
                      project.status === "published" ? "Published" : "Draft"
                    }
                  />

                  {/* ACTIONS */}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-white/30 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(project._id)}
                      className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* ==================================================
          PROJECT EDITOR
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-6xl border border-white/10 bg-[#0b0b0b]">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                  Portfolio Project
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {editing.title || "New Project"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-white/40 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}

            <div className="grid gap-6 p-5 lg:grid-cols-[1fr_340px]">
              {/* LEFT */}

              <div className="space-y-5">
                {/* TITLE / SLUG */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Project Title"
                    value={editing.title}
                    onChange={(event) => {
                      const title = event.target.value;

                      setEditing((current) => ({
                        ...current,

                        title,

                        slug: current.slug || slugify(title),
                      }));
                    }}
                  />

                  <Input
                    label="Slug"
                    value={editing.slug}
                    onChange={(event) =>
                      updateField("slug", event.target.value)
                    }
                  />
                </div>

                {/* CATEGORY / TYPE / YEAR */}

                <div className="grid gap-5 sm:grid-cols-3">
                  <Select
                    label="Category"
                    value={editing.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Type"
                    value={editing.type}
                    onChange={(event) =>
                      updateField("type", event.target.value)
                    }
                  />

                  <Input
                    label="Year"
                    value={editing.year}
                    onChange={(event) =>
                      updateField("year", event.target.value)
                    }
                  />
                </div>

                {/* CLIENT */}

                <Input
                  label="Client"
                  value={editing.client}
                  onChange={(event) =>
                    updateField("client", event.target.value)
                  }
                />

                {/* SHORT DESCRIPTION */}

                <Input
                  label="Short Description"
                  value={editing.shortDescription}
                  onChange={(event) =>
                    updateField("shortDescription", event.target.value)
                  }
                />

                {/* DESCRIPTION */}

                <Textarea
                  label="Full Description"
                  value={editing.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />

                {/* PROJECT LINK */}

                <Input
                  label="Project Link"
                  type="url"
                  placeholder="https://..."
                  value={editing.projectLink}
                  onChange={(event) =>
                    updateField("projectLink", event.target.value)
                  }
                />

                {/* ORDER / STATUS / FEATURED */}

                <div className="grid gap-5 sm:grid-cols-3">
                  <Input
                    label="Display Order"
                    type="number"
                    value={editing.displayOrder}
                    onChange={(event) =>
                      updateField("displayOrder", Number(event.target.value))
                    }
                  />

                  <Select
                    label="Status"
                    value={editing.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                  >
                    <option value="published">Published</option>

                    <option value="draft">Draft</option>
                  </Select>

                  <div className="flex items-end pb-3">
                    <Toggle
                      checked={editing.homepageFeatured}
                      onChange={(value) =>
                        updateField("homepageFeatured", value)
                      }
                      label="Homepage Featured"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="space-y-5">
                {/* COVER IMAGE */}

                <Card>
                  <div className="border-b border-white/10 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Cover Image
                    </p>

                    <p className="mt-1 text-[9px] text-white/25">
                      Upload the main image for this project.
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="aspect-[4/3] overflow-hidden bg-black">
                      {editing.coverImage?.url ? (
                        <img
                          src={editing.coverImage.url}
                          alt={editing.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/20">
                          <ImagePlus size={30} />
                        </div>
                      )}
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 border border-white/15 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition hover:border-red-500 hover:bg-red-500">
                      <UploadCloud size={15} />

                      {uploading === "coverImage"
                        ? "Uploading..."
                        : "Upload Cover"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="hidden"
                        onChange={uploadCoverImage}
                        disabled={Boolean(uploading)}
                      />
                    </label>

                    {editing.coverImage?.url && (
                      <div className="mt-3">
                        <Input
                          label="Image URL"
                          value={editing.coverImage.url}
                          onChange={(event) =>
                            updateCoverImage("url", event.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-white/10 p-5">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button onClick={save} disabled={saving || Boolean(uploading)}>
                {saving ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
