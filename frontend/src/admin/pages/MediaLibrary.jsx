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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PAGES = [
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "portfolio", label: "Portfolio" },
  { value: "careers", label: "Careers" },
  { value: "blog", label: "Blog" },
  { value: "contact", label: "Contact Us" },
];

function getDefaultType(page) {
  return page === "portfolio" ? "cover" : "cover";
}

function getFolder(page, type) {
  return `media/${page}/${type}`;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null);

  /*
   * Multiple files are stored here when adding
   * Portfolio Gallery images.
   */
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [previews, setPreviews] = useState([]);

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

      const response = await fetch(`${API_URL}/api/media?${params.toString()}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch media.");
      }

      setMedia(result.data || []);
    } catch (error) {
      console.error(error);
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filters.page, filters.type]);

  /* ==================================================
     CLEAN PREVIEWS
  ================================================== */

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  /* ==================================================
     NEW MEDIA
  ================================================== */

  const openCreate = () => {
    setSelectedFiles([]);
    setPreviews([]);

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
     EDIT MEDIA
  ================================================== */

  const openEdit = (item) => {
    setSelectedFiles([]);
    setPreviews([]);

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
      if (!current) return current;

      return {
        ...current,
        page,
        /*
         * Only Portfolio can have Gallery.
         * Everything else is automatically Cover.
         */
        type: page === "portfolio" ? current.type || "cover" : "cover",
      };
    });

    /*
     * If changing away from Portfolio,
     * clear any selected multiple gallery files.
     */
    if (page !== "portfolio") {
      setSelectedFiles([]);
      setPreviews([]);
    }
  };

  /* ==================================================
     TYPE CHANGE
  ================================================== */

  const handleTypeChange = (event) => {
    const type = event.target.value;

    setEditing((current) => {
      if (!current) return current;

      return {
        ...current,
        type,
      };
    });

    setSelectedFiles([]);
    setPreviews([]);
  };

  /* ==================================================
     MULTIPLE FILE SELECTION
  ================================================== */

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    /*
     * Multiple files are allowed ONLY for:
     *
     * Portfolio -> Gallery
     */
    const isPortfolioGallery =
      editing?.page === "portfolio" && editing?.type === "gallery";

    if (!isPortfolioGallery) {
      const file = files[0];

      setSelectedFiles([file]);

      const preview = URL.createObjectURL(file);

      setPreviews([preview]);

      event.target.value = "";

      return;
    }

    /*
     * Portfolio gallery:
     * retain all selected files.
     */
    setSelectedFiles(files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews(newPreviews);

    event.target.value = "";
  };

  /* ==================================================
     REMOVE SELECTED FILE
  ================================================== */

  const removeSelectedFile = (index) => {
    setSelectedFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );

    setPreviews((current) => {
      const preview = current[index];

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      return current.filter((_, previewIndex) => previewIndex !== index);
    });
  };

  /* ==================================================
     UPLOAD ONE FILE
  ================================================== */

  const uploadFile = async (file, page, type) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", getFolder(page, type));

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Image upload failed.");
    }

    return result.file;
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

    const response = await fetch(`${API_URL}/api/media`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create media record.");
    }

    return result;
  };

  /* ==================================================
     SAVE MEDIA
  ================================================== */

  const saveMedia = async () => {
    if (!editing) {
      return;
    }

    const isNew = !editing._id && !editing.id;

    /*
     * New Portfolio Gallery:
     *
     * ALL selected files are uploaded.
     */
    const isMultipleGallery =
      isNew && editing.page === "portfolio" && editing.type === "gallery";

    try {
      setSaving(true);

      /*
       * ----------------------------------------------
       * NEW MEDIA
       * ----------------------------------------------
       */

      if (isNew) {
        if (!selectedFiles.length) {
          throw new Error("Please select an image.");
        }

        /*
         * Portfolio gallery:
         * create a separate Media record for
         * every selected image.
         */
        if (isMultipleGallery) {
          for (const file of selectedFiles) {
            await createMediaRecord({
              file,
              page: "portfolio",
              type: "gallery",
              title: editing.title,
              alt: editing.alt,
            });
          }
        } else {
          /*
           * Normal cover image:
           * only one image.
           */
          await createMediaRecord({
            file: selectedFiles[0],
            page: editing.page,
            type: "cover",
            title: editing.title,
            alt: editing.alt,
          });
        }
      } else {

      /*
       * ----------------------------------------------
       * UPDATE EXISTING MEDIA
       * ----------------------------------------------
       */
        const formData = new FormData();

        formData.append("title", editing.title || "");
        formData.append("alt", editing.alt || "");
        formData.append("active", editing.active ? "true" : "false");

        /*
         * Existing media can replace its image
         * with one new image.
         */
        if (selectedFiles.length > 0) {
          formData.append("file", selectedFiles[0]);
        }

        const response = await fetch(
          `${API_URL}/api/media/${editing._id || editing.id}`,
          {
            method: "PUT",
            body: formData,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to update media.");
        }
      }

      setEditing(null);
      setSelectedFiles([]);
      setPreviews([]);

      await fetchMedia();
    } catch (error) {
      console.error(error);
      window.alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE MEDIA
  ================================================== */

  const deleteMedia = async (id) => {
    if (!window.confirm("Delete this media permanently?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/media/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete media.");
      }

      await fetchMedia();
    } catch (error) {
      console.error(error);
      window.alert(error.message);
    }
  };

  /* ==================================================
     FILTER TYPE
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
        description="Manage cover images across the website and multiple images for the Portfolio gallery."
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

              <button type="button" onClick={() => setEditing(null)}>
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
                  {editing.page === "portfolio" && editing.type === "gallery"
                    ? "Gallery Images"
                    : "Cover Image"}
                </span>

                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center border border-dashed border-white/15 px-5 py-6 text-center transition hover:border-red-500/50 hover:bg-red-500/[0.03]">
                  <UploadCloud size={22} className="mb-3 text-white/40" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                    {editing.page === "portfolio" && editing.type === "gallery"
                      ? "Choose Multiple Images"
                      : "Choose Image"}
                  </span>

                  {editing.page === "portfolio" &&
                    editing.type === "gallery" && (
                      <span className="mt-2 text-[10px] text-white/30">
                        You can select multiple images at once.
                      </span>
                    )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple={
                      editing.page === "portfolio" && editing.type === "gallery"
                    }
                    className="hidden"
                    onChange={handleFilesChange}
                  />
                </label>
              </div>

              {/* SELECTED IMAGE PREVIEWS */}

              {selectedFiles.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Selected Images
                    </p>

                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                      {selectedFiles.length}{" "}
                      {selectedFiles.length === 1 ? "image" : "images"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative overflow-hidden border border-white/10 bg-black"
                      >
                        <div className="aspect-square">
                          <img
                            src={previews[index]}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2">
                          <p className="truncate text-[9px] text-white/60">
                            {file.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/80 text-white/60 transition hover:bg-red-500 hover:text-white"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXISTING IMAGE */}

              {editing.existingUrl && selectedFiles.length === 0 && (
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
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                onClick={saveMedia}
                disabled={saving || selectedFiles.length === 0}
              >
                {saving
                  ? editing.page === "portfolio" &&
                    editing.type === "gallery" &&
                    selectedFiles.length > 1
                    ? `Uploading ${selectedFiles.length} Images...`
                    : "Saving..."
                  : editing.page === "portfolio" &&
                      editing.type === "gallery" &&
                      selectedFiles.length > 1
                    ? `Save ${selectedFiles.length} Images`
                    : "Save Media"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
