import { useEffect, useState } from "react";
import {
  CalendarClock,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

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

/* ==================================================
   CONFIG
================================================== */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   HELPERS
================================================== */

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ==================================================
   TIMEZONE
================================================== */

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
}

/* ==================================================
   DATE FORMATTING
================================================== */

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: getTimezone(),
  }).format(parsedDate);
}

/* ==================================================
   DATE + TIME FORMATTING
================================================== */

function formatDateTime(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: getTimezone(),
  }).format(parsedDate);
}

/* ==================================================
   LOCAL DATETIME -> ISO
================================================== */

/*
 * Converts:
 *
 * 2026-09-20T18:30
 *
 * into:
 *
 * 2026-09-20T13:00:00.000Z
 *
 * based on the browser's local timezone.
 */
function localDateTimeToISO(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

/* ==================================================
   ISO -> LOCAL DATE/TIME
================================================== */

/*
 * Converts an ISO timestamp into:
 *
 * {
 *   date: "2026-09-20",
 *   time: "18:30"
 * }
 *
 * using the browser's local timezone.
 */
function isoToLocalDateTimeParts(value) {
  if (!value) {
    return {
      date: "",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "",
      time: "",
    };
  }

  const pad = (number) => String(number).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(
      date.getMonth() + 1,
    )}-${pad(date.getDate())}`,

    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

/* ==================================================
   MINIMUM SCHEDULE DATE
================================================== */

/*
 * Returns today's date in:
 *
 * YYYY-MM-DD
 */
function getMinimumScheduleDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ==================================================
   MINIMUM SCHEDULE TIME
================================================== */

/*
 * If the selected date is today, this returns the
 * current time so the browser cannot select a past time.
 *
 * For future dates, no minimum time is required.
 */
function getMinimumScheduleTime(scheduleDate) {
  if (!scheduleDate) {
    return "";
  }

  const today = getMinimumScheduleDate();

  if (scheduleDate !== today) {
    return "";
  }

  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

/* ==================================================
   EMPTY POST
================================================== */

function createBlankPost() {
  return {
    _id: null,

    title: "",
    slug: "",

    category: "",

    excerpt: "",
    content: "",

    coverImage: {
      url: "",
      publicId: "",
    },

    author: {
      name: "Being IBAN Entertainments",

      image: {
        url: "",
        publicId: "",
      },
    },

    tags: [],

    featured: false,

    status: "Draft",

    scheduledAt: null,
    publishedAt: null,

    timezone: getTimezone(),

    readTime: 0,

    seo: {
      title: "",
      description: "",
      keywords: [],
    },

    /*
     * UI-only fields.
     *
     * These are NOT stored directly in MongoDB.
     */
    scheduleDate: "",
    scheduleTime: "",
  };
}

/* ==================================================
   NORMALIZE API POST
================================================== */

function normalizePost(post) {
  const scheduleParts = isoToLocalDateTimeParts(post.scheduledAt);

  return {
    ...post,

    coverImage: {
      url: post.coverImage?.url || "",
      publicId: post.coverImage?.publicId || "",
    },

    author: {
      name: post.author?.name || "",

      image: {
        url: post.author?.image?.url || "",
        publicId: post.author?.image?.publicId || "",
      },
    },

    tags: Array.isArray(post.tags) ? post.tags : [],

    featured: Boolean(post.featured),

    timezone: post.timezone || getTimezone(),

    seo: {
      title: post.seo?.title || "",
      description: post.seo?.description || "",
      keywords: Array.isArray(post.seo?.keywords) ? post.seo.keywords : [],
    },

    /*
     * Convert the stored ISO timestamp into separate
     * date and time fields for the editor.
     */
    scheduleDate: scheduleParts.date,
    scheduleTime: scheduleParts.time,
  };
}

/* ==================================================
   COMPONENT
================================================== */

export default function BlogManager() {
  const [posts, setPosts] = useState([]);

  const [editing, setEditing] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  /* ==================================================
     LOAD ADMIN POSTS
  ================================================== */

  const loadPosts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/blog/admin`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch posts");
      }

      setPosts((result.posts || []).map(normalizePost));
    } catch (error) {
      console.error("Load admin posts error:", error);

      window.alert(error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     INITIAL LOAD
  ================================================== */

  useEffect(() => {
    loadPosts();
  }, []);

  /* ==================================================
     CREATE NEW POST
  ================================================== */

  const openNewPost = () => {
    setEditing(createBlankPost());
  };

  /* ==================================================
     EDIT POST
  ================================================== */

  const openEditPost = (post) => {
    setEditing({
      ...normalizePost(post),
    });
  };

  /* ==================================================
     UPDATE TOP-LEVEL FIELD
  ================================================== */

  const updateEditing = (field, value) => {
    setEditing((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==================================================
     SAVE POST
  ================================================== */

  const save = async () => {
    if (!editing || saving) {
      return;
    }

    /* ------------------------------------------
       TITLE
    ------------------------------------------ */

    if (!editing.title?.trim()) {
      window.alert("Title is required.");
      return;
    }

    /* ------------------------------------------
       SLUG
    ------------------------------------------ */

    const slug = editing.slug?.trim() || slugify(editing.title);

    if (!slug) {
      window.alert("A valid slug is required.");
      return;
    }

    /* ------------------------------------------
       SCHEDULE
    ------------------------------------------ */

    let scheduledAt = null;

    if (editing.status === "Scheduled") {
      if (!editing.scheduleDate) {
        window.alert("Please select a publication date.");
        return;
      }

      if (!editing.scheduleTime) {
        window.alert("Please select a publication time.");
        return;
      }

      /*
       * Combine the separate date and time fields.
       *
       * Example:
       *
       * scheduleDate = "2026-09-20"
       * scheduleTime = "18:30"
       *
       * becomes:
       *
       * "2026-09-20T18:30"
       */
      const localDateTime = `${editing.scheduleDate}T${editing.scheduleTime}`;

      scheduledAt = localDateTimeToISO(localDateTime);

      if (!scheduledAt) {
        window.alert("Invalid scheduled date and time.");
        return;
      }

      /*
       * Backend performs the authoritative validation.
       *
       * This client-side validation is only for UX.
       */
      if (new Date(scheduledAt) <= new Date()) {
        window.alert("Scheduled date and time must be in the future.");
        return;
      }
    }

    /* ------------------------------------------
       PAYLOAD
    ------------------------------------------ */

    const payload = {
      title: editing.title.trim(),

      slug,

      category: editing.category?.trim() || "",

      excerpt: editing.excerpt || "",

      content: editing.content || "",

      coverImage: editing.coverImage || {
        url: "",
        publicId: "",
      },

      author: editing.author || {
        name: "",
        image: {
          url: "",
          publicId: "",
        },
      },

      tags: editing.tags || [],

      featured: Boolean(editing.featured),

      status: editing.status,

      scheduledAt,

      timezone: editing.timezone || getTimezone(),

      readTime: Number(editing.readTime) || 0,

      seo: editing.seo || {
        title: "",
        description: "",
        keywords: [],
      },
    };

    /*
     * Only send publishedAt when publishing.
     */

    if (editing.status === "Published") {
      payload.publishedAt = editing.publishedAt || null;
    }

    /* ------------------------------------------
       CREATE / UPDATE URL
    ------------------------------------------ */

    const isEditing = Boolean(editing._id);

    const url = isEditing
      ? `${API_URL}/api/blog/${editing._id}`
      : `${API_URL}/api/blog`;

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save post");
      }

      /*
       * Reload from MongoDB.
       */
      await loadPosts();

      setEditing(null);
    } catch (error) {
      console.error("Save post error:", error);

      window.alert(error.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE POST
  ================================================== */

  const remove = async (id) => {
    if (!id) {
      return;
    }

    if (!window.confirm("Delete this blog post?")) {
      return;
    }

    try {
      setDeleting(id);

      const response = await fetch(`${API_URL}/api/blog/${id}`, {
        method: "DELETE",

        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete post");
      }

      setPosts((current) => current.filter((post) => post._id !== id));

      /*
       * If the deleted post is currently being edited,
       * close the editor.
       */
      if (editing?._id === id) {
        setEditing(null);
      }
    } catch (error) {
      console.error("Delete post error:", error);

      window.alert(error.message || "Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  /* ==================================================
     UPLOAD COVER IMAGE
  ================================================== */

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !editing) {
      return;
    }

    try {
      setUploading(true);

      /*
       * Upload through the backend.
       *
       * POST /api/upload
       */

      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "blog");

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",

        credentials: "include",

        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Image upload failed.");
      }

      if (!result.file?.url) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setEditing((current) => ({
        ...current,

        coverImage: {
          url: result.file.url,

          publicId: result.file.publicId || current.coverImage?.publicId || "",
        },
      }));
    } catch (error) {
      console.error("Upload image error:", error);

      window.alert(error.message || "Image upload failed.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* ==================================================
     STATUS LABEL
  ================================================== */

  const getStatusLabel = (post) => {
    if (post.status === "Scheduled" && post.scheduledAt) {
      return `Scheduled · ${formatDateTime(post.scheduledAt)}`;
    }

    if (post.status === "Published" && post.publishedAt) {
      return `Published · ${formatDateTime(post.publishedAt)}`;
    }

    return post.status;
  };

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Content / Blog"
        title="Blog"
        description="Create, edit, schedule and publish the stories displayed on the public Blog page."
        action={
          <Button onClick={openNewPost}>
            <Plus size={15} />
            New Post
          </Button>
        }
      />

      {/* ==================================================
          POSTS LIST
      ================================================== */}

      {loading ? (
        <Card>
          <div className="p-8 text-center text-sm text-white/40">
            Loading posts...
          </div>
        </Card>
      ) : posts.length === 0 ? (
        <EmptyState>No blog posts have been created.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
              >
                {/* POST INFORMATION */}

                <div className="flex gap-4">
                  {/* IMAGE */}

                  <div className="h-16 w-24 shrink-0 overflow-hidden bg-black">
                    {post.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.15em] text-white/20">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}

                  <div>
                    <h3 className="font-bold">
                      {post.title || "Untitled Post"}
                    </h3>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-white/30">
                      {post.category || "Uncategorized"}
                    </p>

                    {/* SCHEDULED TIME */}

                    {post.status === "Scheduled" && post.scheduledAt && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                        <CalendarClock size={11} />

                        {formatDateTime(post.scheduledAt)}
                      </p>
                    )}

                    {/* PUBLISHED TIME */}

                    {post.status === "Published" && post.publishedAt && (
                      <p className="mt-1 text-[10px] text-white/40">
                        Published {formatDateTime(post.publishedAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-3">
                  <StatusBadge status={post.status} />

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => openEditPost(post)}
                    disabled={saving || deleting === post._id}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() => remove(post._id)}
                    disabled={deleting === post._id}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
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
          EDITOR
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-4xl border border-white/10 bg-[#0b0b0b]">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="font-bold">{editing.title || "New Post"}</h2>

                {editing._id && (
                  <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/30">
                    {getStatusLabel(editing)}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* FORM */}

            <div className="space-y-5 p-5">
              {/* TITLE */}

              <Input
                label="Title"
                value={editing.title}
                onChange={(event) => updateEditing("title", event.target.value)}
              />

              {/* SLUG / CATEGORY */}

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Slug"
                  value={editing.slug}
                  onChange={(event) =>
                    updateEditing("slug", event.target.value)
                  }
                />

                <Input
                  label="Category"
                  value={editing.category}
                  onChange={(event) =>
                    updateEditing("category", event.target.value)
                  }
                />
              </div>

              {/* FEATURED IMAGE */}

              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Featured Image
                </span>

                <div className="flex flex-wrap gap-4">
                  <div className="h-28 w-44 overflow-hidden bg-black">
                    {editing.coverImage?.url ? (
                      <img
                        src={editing.coverImage.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.15em] text-white/20">
                        No Image
                      </div>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 self-start border border-white/15 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] hover:border-red-500">
                    <UploadCloud size={15} />

                    {uploading ? "Uploading..." : "Upload Image"}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={uploadImage}
                    />
                  </label>
                </div>
              </div>

              {/* EXCERPT */}

              <Textarea
                label="Excerpt"
                value={editing.excerpt}
                onChange={(event) =>
                  updateEditing("excerpt", event.target.value)
                }
              />

              {/* CONTENT */}

              <Textarea
                label="Content"
                className="min-h-[300px]"
                value={editing.content}
                onChange={(event) =>
                  updateEditing("content", event.target.value)
                }
              />

              {/* AUTHOR */}

              <Input
                label="Author"
                value={editing.author?.name || ""}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,

                    author: {
                      ...current.author,

                      name: event.target.value,
                    },
                  }))
                }
              />

              {/* STATUS */}

              <Select
                label="Status"
                value={editing.status}
                onChange={(event) =>
                  updateEditing("status", event.target.value)
                }
              >
                <option value="Draft">Draft</option>

                <option value="Scheduled">Scheduled</option>

                <option value="Published">Published</option>
              </Select>

              {/* ==================================================
                  SCHEDULING
              ================================================== */}

              {editing.status === "Scheduled" && (
                <div className="border border-white/10 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarClock size={16} />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em]">
                        Schedule Publication
                      </p>

                      <p className="mt-1 text-[10px] text-white/35">
                        The post will automatically become public at this time.
                      </p>
                    </div>
                  </div>

                  {/* DATE + TIME */}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* PUBLICATION DATE */}

                    <Input
                      label="Publication Date"
                      type="date"
                      value={editing.scheduleDate || ""}
                      min={getMinimumScheduleDate()}
                      onChange={(event) =>
                        updateEditing("scheduleDate", event.target.value)
                      }
                    />

                    {/* PUBLICATION TIME */}

                    <Input
                      label="Publication Time"
                      type="time"
                      value={editing.scheduleTime || ""}
                      min={getMinimumScheduleTime(editing.scheduleDate)}
                      onChange={(event) =>
                        updateEditing("scheduleTime", event.target.value)
                      }
                    />
                  </div>

                  {/* TIMEZONE */}

                  <div className="mt-5">
                    <Input
                      label="Timezone"
                      type="text"
                      value={editing.timezone || getTimezone()}
                      readOnly
                    />
                  </div>

                  <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-white/25">
                    Your browser timezone: {getTimezone()}
                  </p>
                </div>
              )}

              {/* ==================================================
                  PUBLISHED INFORMATION
              ================================================== */}

              {editing.status === "Published" && editing.publishedAt && (
                <div className="border border-white/10 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Published
                  </p>

                  <p className="mt-2 text-sm">
                    {formatDateTime(editing.publishedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3 border-t border-white/10 p-5">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={saving || uploading}
              >
                Cancel
              </Button>

              <Button onClick={save} disabled={saving || uploading}>
                {saving
                  ? "Saving..."
                  : editing.status === "Scheduled"
                    ? "Schedule Post"
                    : editing.status === "Published"
                      ? "Publish Post"
                      : "Save Draft"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
