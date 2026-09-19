import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, ExternalLink } from "lucide-react";

import {
  Button,
  Card,
  Input,
  PageTitle,
  Select,
  StatusBadge,
  Textarea,
  EmptyState,
} from "../components/AdminUI";

/* =====================================================
   CONFIG
====================================================== */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =====================================================
   EMPTY JOB
====================================================== */

const EMPTY_JOB = {
  _id: null,
  title: "",
  slug: "",
  department: "Production",
  location: "Kolkata",
  employmentType: "Full-time",
  description: "",
  applicationUrl: "",
  status: "Draft",
};

/* =====================================================
   HELPERS
====================================================== */

/**
 * Convert a title into a URL-safe slug.
 */
function generateSlug(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize a job returned by the API.
 *
 * This prevents undefined/null values from leaking
 * into controlled React inputs.
 */
function normalizeJob(job = {}) {
  return {
    _id: job._id || null,

    title: job.title || "",

    slug: job.slug || generateSlug(job.title || ""),

    department: job.department || "Production",

    location: job.location || "Kolkata",

    employmentType: job.employmentType || "Full-time",

    description: job.description || "",

    applicationUrl: job.applicationUrl || "",

    status: job.status || "Draft",
  };
}

/**
 * Safely read a JSON response.
 *
 * Some server/proxy errors can return HTML or an empty
 * response instead of JSON. This prevents a secondary
 * "Unexpected token <" style error from hiding the
 * actual problem.
 */
async function readJson(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();

    return {
      message: text || `Request failed with status ${response.status}.`,
    };
  }

  try {
    return await response.json();
  } catch {
    return {
      message: `Request failed with status ${response.status}.`,
    };
  }
}

/**
 * Validate an application URL.
 */
function isValidUrl(value) {
  if (!value?.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* =====================================================
   COMPONENT
====================================================== */

export default function CareersManager() {
  const [jobs, setJobs] = useState([]);

  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* =====================================================
     FETCH ALL JOBS
  ====================================================== */

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "GET",
        credentials: "include",
      });

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch jobs.");
      }

      if (!Array.isArray(result.jobs)) {
        setJobs([]);
        return;
      }

      setJobs(result.jobs.map(normalizeJob));
    } catch (err) {
      console.error("Fetch jobs error:", err);

      setError(err.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ====================================================== */

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =====================================================
     OPEN NEW JOB
  ====================================================== */

  const openNewJob = () => {
    setError("");
    setSuccess("");

    setEditing({
      ...EMPTY_JOB,
    });
  };

  /* =====================================================
     OPEN EDIT JOB
  ====================================================== */

  const openEditJob = (job) => {
    if (!job) {
      return;
    }

    setError("");
    setSuccess("");

    setEditing(normalizeJob(job));
  };

  /* =====================================================
     UPDATE FIELD
  ====================================================== */

  const updateField = (field, value) => {
    setEditing((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  /* =====================================================
     SAVE JOB
  ====================================================== */

  const save = async () => {
    if (!editing || saving) {
      return;
    }

    setError("");
    setSuccess("");

    /* ------------------------------------------
       TITLE
    ------------------------------------------ */

    const title = editing.title?.trim();

    if (!title) {
      setError("Job title is required.");
      return;
    }

    /* ------------------------------------------
       SLUG
    ------------------------------------------ */

    const slug = editing.slug?.trim() || generateSlug(title);

    if (!slug) {
      setError("A valid job slug is required.");
      return;
    }

    /* ------------------------------------------
       APPLICATION URL
    ------------------------------------------ */

    const applicationUrl = editing.applicationUrl?.trim() || "";

    if (!applicationUrl) {
      setError("Application Form URL is required.");
      return;
    }

    if (!isValidUrl(applicationUrl)) {
      setError(
        "Please enter a valid application URL beginning with http:// or https://.",
      );
      return;
    }

    /* ------------------------------------------
       PAYLOAD
    ------------------------------------------ */

    const payload = {
      title,

      slug,

      department: editing.department?.trim() || "Production",

      location: editing.location?.trim() || "Kolkata",

      employmentType: editing.employmentType || "Full-time",

      description: editing.description || "",

      applicationUrl,

      status: editing.status || "Draft",
    };

    const isEditing = Boolean(editing._id);

    const url = isEditing
      ? `${API_URL}/api/jobs/${editing._id}`
      : `${API_URL}/api/jobs`;

    try {
      setSaving(true);

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(result.message || "Failed to save job.");
      }

      /*
       * Reload the authoritative data from MongoDB
       * instead of manually constructing the saved job.
       */
      await fetchJobs();

      setEditing(null);

      setSuccess(
        isEditing ? "Job updated successfully." : "Job created successfully.",
      );
    } catch (err) {
      console.error("Save job error:", err);

      setError(err.message || "Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE JOB
  ====================================================== */

  const remove = async (job) => {
    if (!job?._id || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${job.title || "this job"}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(job._id);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/api/jobs/${job._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete job.");
      }

      setJobs((current) => current.filter((item) => item._id !== job._id));

      /*
       * If the deleted job is currently being edited,
       * close the editor.
       */
      if (editing?._id === job._id) {
        setEditing(null);
      }

      setSuccess("Job deleted successfully.");
    } catch (err) {
      console.error("Delete job error:", err);

      setError(err.message || "Failed to delete job.");
    } finally {
      setDeleting(null);
    }
  };

  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Content / Careers"
        title="Job Listings"
        description="Create, edit, publish and remove job listings displayed on the Careers page."
        action={
          <Button
            onClick={openNewJob}
            disabled={loading || saving || Boolean(deleting)}
          >
            <Plus size={15} />
            Add Job
          </Button>
        }
      />

      {/* =================================================
          SUCCESS MESSAGE
      ================================================== */}

      {success && (
        <div className="mb-5 border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div className="mb-5 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          JOB LIST
      ================================================== */}

      {loading ? (
        <Card>
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-white/40">Loading job listings...</p>
          </div>
        </Card>
      ) : jobs.length === 0 ? (
        <EmptyState>No job listings have been created.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-white/10">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col justify-between gap-4 px-5 py-5 md:flex-row md:items-center"
              >
                {/* JOB INFORMATION */}

                <div className="min-w-0">
                  <h3 className="font-bold">{job.title || "Untitled Job"}</h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/30">
                    {job.department || "Production"} ·{" "}
                    {job.location || "Kolkata"} ·{" "}
                    {job.employmentType || "Full-time"}
                  </p>

                  {job.applicationUrl && (
                    <p className="mt-2 max-w-xl truncate text-[10px] text-white/25">
                      {job.applicationUrl}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={job.status} />

                  {/* OPEN APPLICATION FORM */}

                  {job.applicationUrl && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open application form"
                      className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => openEditJob(job)}
                    disabled={saving || Boolean(deleting)}
                    title="Edit job"
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() => remove(job)}
                    disabled={
                      deleting === job._id || saving || Boolean(deleting)
                    }
                    title="Delete job"
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-3xl border border-white/10 bg-[#0b0b0b]">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                  {editing._id ? "Edit Job" : "Create Job"}
                </p>

                <h2 className="mt-1 font-bold">{editing.title || "New Job"}</h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center"
                aria-label="Close"
              >
                <X
                  size={20}
                  className="text-white/40 transition-colors hover:text-white"
                />
              </button>
            </div>

            {/* FORM */}

            <div className="space-y-5 p-5">
              {/* JOB TITLE */}

              <Input
                label="Job Title"
                value={editing.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Video Editor"
              />

              {/* SLUG */}

              <Input
                label="Slug"
                value={editing.slug || ""}
                onChange={(event) =>
                  updateField("slug", generateSlug(event.target.value))
                }
                placeholder="video-editor"
              />

              {/* DEPARTMENT / LOCATION / TYPE */}

              <div className="grid gap-5 sm:grid-cols-3">
                <Select
                  label="Department"
                  value={editing.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                >
                  <option value="Production">Production</option>

                  <option value="Post Production">Post Production</option>

                  <option value="Design">Design</option>

                  <option value="Creative">Creative</option>
                </Select>

                <Input
                  label="Location"
                  value={editing.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Kolkata"
                />

                <Select
                  label="Employment Type"
                  value={editing.employmentType}
                  onChange={(event) =>
                    updateField("employmentType", event.target.value)
                  }
                >
                  <option value="Full-time">Full-time</option>

                  <option value="Part-time">Part-time</option>

                  <option value="Contract">Contract</option>

                  <option value="Internship">Internship</option>

                  <option value="Freelance">Freelance</option>
                </Select>
              </div>

              {/* DESCRIPTION */}

              <Textarea
                label="Description"
                value={editing.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the role..."
              />

              {/* APPLICATION FORM */}

              <div>
                <Input
                  label="Application Form URL"
                  type="url"
                  value={editing.applicationUrl}
                  onChange={(event) =>
                    updateField("applicationUrl", event.target.value)
                  }
                  placeholder="https://docs.google.com/forms/d/e/..."
                />

                <p className="mt-2 text-[10px] leading-4 text-white/25">
                  Paste the Google Forms URL applicants should use to apply for
                  this position.
                </p>
              </div>

              {/* STATUS */}

              <Select
                label="Status"
                value={editing.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="Draft">Draft</option>

                <option value="Published">Published</option>

                <option value="Closed">Closed</option>
              </Select>
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

              <Button onClick={save} disabled={saving}>
                {saving
                  ? "Saving..."
                  : editing._id
                    ? "Update Job"
                    : "Create Job"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
