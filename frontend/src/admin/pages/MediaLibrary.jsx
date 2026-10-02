import { useEffect, useState } from "react";
import { Images, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";

import {
  Button,
  Card,
  EmptyState,
  Input,
  PageTitle,
  Select,
} from "../components/AdminUI";

/* ==================================================
   API
================================================== */

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

/* ==================================================
   PAGES
================================================== */

const PAGES = [
  {
    value: "about",
    label: "About",
  },
  {
    value: "services",
    label: "Services",
  },
  {
    value: "portfolio",
    label: "Portfolio",
  },
  {
    value: "careers",
    label: "Careers",
  },
  {
    value: "blog",
    label: "Blog",
  },
  {
    value: "contact",
    label: "Contact Us",
  },
];

/* ==================================================
   HELPERS
================================================== */

/**
 * Safely parse a fetch response.
 *
 * Some reverse proxies return an empty body or plain text.
 * Calling response.json() directly would then throw:
 *
 * Failed to execute 'json' on 'Response':
 * Unexpected end of JSON input
 */
async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text,
    };
  }
}

/**
 * Centralized media request.
 *
 * credentials: include is important because the backend
 * protects POST / PUT / DELETE with requireAdmin.
 */
async function mediaRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,

    credentials: "include",

    headers: {
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        `Request failed with HTTP ${response.status}.`,
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/* ==================================================
   COMPONENT
================================================== */

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null);

  /*
   * Only ONE selected file is allowed.
   */
  const [selectedFile, setSelectedFile] = useState(null);

  /*
   * Only ONE preview is allowed.
   */
  const [preview, setPreview] = useState("");

  const [filters, setFilters] = useState({
    page: "",
    type: "",
  });

  /* ==================================================
     FETCH MEDIA
  ================================================== */

  const fetchMedia = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.page) {
        params.append("page", filters.page);
      }

      if (filters.type) {
        params.append("type", filters.type);
      }

      const query = params.toString();

      const path = query ? `/api/media?${query}` : "/api/media";

      const result = await mediaRequest(path, {
        method: "GET",
      });

      setMedia(result?.data || []);
    } catch (error) {
      console.error("Fetch media error:", error);

      window.alert(error?.message || "Failed to fetch media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filters.page, filters.type]);

  /* ==================================================
     CLEAN PREVIEW
  ================================================== */

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ==================================================
     CREATE
  ================================================== */

  const openCreate = () => {
    clearSelectedFile();

    setEditing({
      page: "about",
      type: "cover",
      title: "",
      alt: "",
      active: true,
      existingUrl: "",
    });
  };

  /* ==================================================
     EDIT
  ================================================== */

  const openEdit = (item) => {
    clearSelectedFile();

    setEditing({
      ...item,
      existingUrl: item.url || "",
    });
  };

  /* ==================================================
     PAGE CHANGE
  ================================================== */

  const handlePageChange = (event) => {
    const page = event.target.value;

    setEditing((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        page,
        type: page === "portfolio" ? current.type || "cover" : "cover",
      };
    });

    clearSelectedFile();
  };

  /* ==================================================
     TYPE CHANGE
  ================================================== */

  const handleTypeChange = (event) => {
    const type = event.target.value;

    setEditing((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        type,
      };
    });

    clearSelectedFile();
  };

  /* ==================================================
     CLEAR SELECTED FILE
  ================================================== */

  const clearSelectedFile = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview("");
  };

  /* ==================================================
     FILE SELECTION
  ================================================== */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Always replace the previous selected file.
     *
     * Only one file is allowed.
     */
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreview(newPreview);

    /*
     * Allows selecting the same file again later.
     */
    event.target.value = "";
  };

  /* ==================================================
     CREATE MEDIA RECORD
  ================================================== */

  const createMediaRecord = async ({ file, page, type, title, alt }) => {
    const formData = new FormData();

    formData.append("file", file);

    formData.append("page", page);

    formData.append("type", type);

    formData.append("title", title || "");

    formData.append("alt", alt || "");

    return mediaRequest("/api/media", {
      method: "POST",
      body: formData,
    });
  };

  /* ==================================================
     UPDATE MEDIA
  ================================================== */

  const updateMediaRecord = async ({ id, file, title, alt, active }) => {
    const formData = new FormData();

    formData.append("title", title || "");

    formData.append("alt", alt || "");

    formData.append("active", active ? "true" : "false");

    if (file) {
      formData.append("file", file);
    }

    return mediaRequest(`/api/media/${id}`, {
      method: "PUT",
      body: formData,
    });
  };

  /* ==================================================
     SAVE MEDIA
  ================================================== */

  const saveMedia = async () => {
    if (!editing) {
      return;
    }

    const id = editing._id || editing.id;

    const isNew = !id;

    try {
      setSaving(true);

      /* ------------------------------------------------
         NEW MEDIA
      ------------------------------------------------ */

      if (isNew) {
        if (!selectedFile) {
          throw new Error("Please select an image.");
        }

        /*
         * One upload = one Media document.
         *
         * Portfolio gallery images are still supported,
         * but each image must be added separately.
         */
        await createMediaRecord({
          file: selectedFile,
          page: editing.page,
          type: editing.page === "portfolio" ? editing.type : "cover",
          title: editing.title,
          alt: editing.alt,
        });
      } else {
        /* ------------------------------------------------
           UPDATE EXISTING MEDIA
        ------------------------------------------------ */

        await updateMediaRecord({
          id,
          file: selectedFile || null,
          title: editing.title,
          alt: editing.alt,
          active: editing.active,
        });
      }

      /* ------------------------------------------------
         CLOSE
      ------------------------------------------------ */

      clearSelectedFile();

      setEditing(null);

      await fetchMedia();
    } catch (error) {
      console.error("Save media error:", error);

      window.alert(error?.message || "Failed to save media.");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE MEDIA
  ================================================== */

  const deleteMedia = async (id) => {
    if (!id) {
      window.alert("Media ID is missing.");

      return;
    }

    const confirmed = window.confirm("Delete this media permanently?");

    if (!confirmed) {
      return;
    }

    try {
      await mediaRequest(`/api/media/${id}`, {
        method: "DELETE",
      });

      await fetchMedia();
    } catch (error) {
      console.error("Delete media error:", error);

      window.alert(error?.message || "Failed to delete media.");
    }
  };

  /* ==================================================
     FILTERED MEDIA
  ================================================== */

  const filteredMedia = media;

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Content / Media"
        title="Media Library"
        description="Manage cover images across the website and portfolio gallery images. Each media item is uploaded individually."
        action={
          <Button onClick={openCreate}>
            <Plus size={15} />
            Add Media
          </Button>
        }
      />

      {/* ==================================================
          FILTERS
      ================================================== */}

      <Card className="mb-6 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Page"
            value={filters.page}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                page: event.target.value,
                type: event.target.value === "portfolio" ? current.type : "",
              }))
            }
          >
            <option value="">All Pages</option>

            {PAGES.map((page) => (
              <option key={page.value} value={page.value}>
                {page.label}
              </option>
            ))}
          </Select>

          <Select
            label="Media Type"
            value={filters.type}
            disabled={filters.page !== "portfolio"}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                type: event.target.value,
              }))
            }
          >
            <option value="">All Types</option>

            {filters.page === "portfolio" && (
              <>
                <option value="cover">Cover</option>

                <option value="gallery">Gallery</option>
              </>
            )}
          </Select>
        </div>
      </Card>

      {/* ==================================================
          MEDIA GRID
      ================================================== */}

      {loading ? (
        <Card className="p-10 text-center text-sm text-white/40">
          Loading media...
        </Card>
      ) : filteredMedia.length === 0 ? (
        <EmptyState>No media has been added yet.</EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedia.map((item) => (
            <Card key={item._id || item.id} className="overflow-hidden">
              {/* IMAGE */}

              <div className="aspect-[4/3] bg-black">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.title || ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/20">
                    <Images size={32} />
                  </div>
                )}
              </div>

              {/* INFO */}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold">
                      {item.title || "Untitled Media"}
                    </h3>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                      {item.page}

                      {item.page === "portfolio" && ` · ${item.type}`}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${
                      item.active
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:text-white"
                    aria-label="Edit media"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMedia(item._id || item.id)}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-500"
                    aria-label="Delete media"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ==================================================
          MODAL
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-4xl border border-white/10 bg-[#0b0b0b]">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                  Media Library
                </p>

                <h2 className="mt-1 font-bold">
                  {editing._id || editing.id ? "Edit Media" : "Add Media"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  clearSelectedFile();
                  setEditing(null);
                }}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-6 p-5">
              {/* PAGE */}

              <Select
                label="Page"
                value={editing.page}
                onChange={handlePageChange}
                disabled={Boolean(editing._id || editing.id)}
              >
                {PAGES.map((page) => (
                  <option key={page.value} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </Select>

              {/* TYPE */}

              {editing.page === "portfolio" ? (
                <Select
                  label="Media Type"
                  value={editing.type}
                  onChange={handleTypeChange}
                  disabled={Boolean(editing._id || editing.id)}
                >
                  <option value="cover">Cover Image</option>

                  <option value="gallery">Portfolio Gallery</option>
                </Select>
              ) : (
                <div className="border border-white/10 bg-white/[0.02] px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Media Type
                  </p>

                  <p className="mt-1 text-sm font-semibold">Cover Image</p>
                </div>
              )}

              {/* TITLE */}

              <Input
                label="Title"
                value={editing.title || ""}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />

              {/* ALT */}

              <Input
                label="Alt Text"
                value={editing.alt || ""}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    alt: event.target.value,
                  }))
                }
              />

              {/* UPLOAD */}

              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Image
                </span>

                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 px-5 py-6 text-center transition hover:border-red-500/50 hover:bg-red-500/[0.03]">
                  <UploadCloud size={22} className="mb-3 text-white/40" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    {selectedFile ? "Choose Different Image" : "Choose Image"}
                  </span>

                  <span className="mt-2 text-[10px] text-white/30">
                    Select one image at a time.
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* SELECTED IMAGE PREVIEW */}

              {selectedFile && preview && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Selected Image
                    </p>

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="text-[9px] uppercase tracking-[0.15em] text-white/30 transition hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="relative max-w-sm overflow-hidden border border-white/10 bg-black">
                    <div className="aspect-[4/3]">
                      <img
                        src={preview}
                        alt={selectedFile.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2">
                      <p className="truncate text-[9px] text-white/60">
                        {selectedFile.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/80 text-white/60 transition hover:bg-red-500 hover:text-white"
                      aria-label="Remove selected image"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* EXISTING IMAGE */}

              {editing.existingUrl && !selectedFile && (
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Current Image
                  </p>

                  <div className="max-w-sm overflow-hidden border border-white/10 bg-black">
                    <img
                      src={editing.existingUrl}
                      alt={editing.alt || ""}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>

                  <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/25">
                    Choose a new image above to replace this image.
                  </p>
                </div>
              )}

              {/* ACTIVE */}

              {(editing._id || editing.id) && (
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.active)}
                    onChange={(event) =>
                      setEditing((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />

                  <span className="text-xs font-semibold">Active</span>
                </label>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  clearSelectedFile();
                  setEditing(null);
                }}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button onClick={saveMedia} disabled={saving || !selectedFile}>
                {saving
                  ? "Saving..."
                  : editing._id || editing.id
                    ? "Update Media"
                    : "Save Media"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
