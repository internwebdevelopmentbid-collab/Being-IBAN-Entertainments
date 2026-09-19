import { useEffect, useMemo, useState } from "react";
import {
  Image as ImageIcon,
  ExternalLink,
  Save,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card, PageTitle } from "../components/AdminUI";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   DEFAULT FORM
================================================== */

const DEFAULT_FORM = {
  image: {
    url: "",
    publicId: "",
  },

  link: "",

  // IMPORTANT:
  // Master poster toggle.
  enabled: false,

  pages: {
    home: false,
    about: false,
    services: false,
    portfolio: false,
    careers: false,
    contact: false,
    blog: false,
  },
};

/* ==================================================
   PAGE CONFIG
================================================== */

const PAGE_OPTIONS = [
  {
    key: "home",
    label: "Home",
    path: "/",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
  },
  {
    key: "services",
    label: "Services",
    path: "/services",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    path: "/portfolio",
  },
  {
    key: "careers",
    label: "Careers",
    path: "/careers",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
  },
  {
    key: "blog",
    label: "Blog",
    path: "/blog",
  },
];

/* ==================================================
   NORMALIZE POSTER
================================================== */

function normalizePoster(poster) {
  if (!poster) {
    return {
      ...DEFAULT_FORM,
      image: { ...DEFAULT_FORM.image },
      pages: { ...DEFAULT_FORM.pages },
    };
  }

  return {
    image: {
      url: poster.image?.url || "",
      publicId: poster.image?.publicId || "",
    },

    link: poster.link || "",

    /*
     * VERY IMPORTANT
     *
     * Do not use:
     *
     * poster.enabled || true
     *
     * because:
     *
     * false || true === true
     *
     * which would turn an intentionally disabled
     * poster back ON.
     */
    enabled: typeof poster.enabled === "boolean" ? poster.enabled : false,

    pages: {
      home: Boolean(poster.pages?.home),
      about: Boolean(poster.pages?.about),
      services: Boolean(poster.pages?.services),
      portfolio: Boolean(poster.pages?.portfolio),
      careers: Boolean(poster.pages?.careers),
      contact: Boolean(poster.pages?.contact),
      blog: Boolean(poster.pages?.blog),
    },
  };
}

/* ==================================================
   COMPONENT
================================================== */

export default function PosterManager() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const [posterId, setPosterId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  /*
   * false = backend and frontend are synchronized
   * true  = user changed something
   */
  const [hasChanges, setHasChanges] = useState(false);

  /* ==================================================
     LOAD POSTER
  ================================================== */

  const loadPoster = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/posters`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load poster.");
      }

      /*
       * Support:
       *
       * { poster: {...} }
       *
       * OR
       *
       * { data: {...} }
       *
       * OR
       *
       * { posters: [...] }
       */

      let poster = data.poster || data.data || null;

      /*
       * If backend returns an array because only one poster
       * is allowed, use the first poster.
       */

      if (!poster && Array.isArray(data.posters)) {
        poster = data.posters[0] || null;
      }

      if (poster) {
        const normalized = normalizePoster(poster);

        setForm(normalized);

        setPosterId(poster._id || poster.id || null);
      } else {
        setForm({
          ...DEFAULT_FORM,
          image: { ...DEFAULT_FORM.image },
          pages: { ...DEFAULT_FORM.pages },
        });

        setPosterId(null);
      }

      /*
       * Loaded from backend = no unsaved changes.
       */
      setHasChanges(false);
    } catch (err) {
      console.error("Load poster error:", err);

      setError(err.message || "Failed to load poster.");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     INITIAL LOAD
  ================================================== */

  useEffect(() => {
    loadPoster();
  }, []);

  /* ==================================================
     UPDATE FORM
  ================================================== */

  const updateForm = (updater) => {
    setForm((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;

      return next;
    });

    setHasChanges(true);
  };

  /* ==================================================
     IMAGE UPLOAD
  ================================================== */

  const uploadPoster = async (event) => {
    const file = event.target.files?.[0];

    /*
     * Allow selecting the same file again.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "posters");

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Poster image upload failed.");
      }

      if (!data.file?.url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      /*
       * Uploading the image does NOT save the poster.
       *
       * User still has to click Save Poster.
       */

      updateForm((current) => ({
        ...current,

        image: {
          url: data.file.url,
          publicId: data.file.publicId || "",
        },
      }));

      toast.success("Poster image uploaded. Save your changes.");
    } catch (err) {
      console.error("Poster upload error:", err);

      setError(err.message || "Poster image upload failed.");

      toast.error(err.message || "Poster image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* ==================================================
     LINK
  ================================================== */

  const handleLinkChange = (event) => {
    const value = event.target.value;

    updateForm((current) => ({
      ...current,
      link: value,
    }));
  };

  /* ==================================================
     MASTER TOGGLE
  ================================================== */

  const handleEnabledChange = (event) => {
    const checked = event.target.checked;

    /*
     * Directly store the boolean.
     *
     * false MUST remain false.
     */

    updateForm((current) => ({
      ...current,
      enabled: checked,
    }));
  };

  /* ==================================================
     PAGE TOGGLE
  ================================================== */

  const handlePageToggle = (pageKey) => {
    updateForm((current) => ({
      ...current,

      pages: {
        ...current.pages,

        [pageKey]: !current.pages[pageKey],
      },
    }));
  };

  /* ==================================================
     ENABLE ALL
  ================================================== */

  const enableAllPages = () => {
    updateForm((current) => ({
      ...current,

      pages: PAGE_OPTIONS.reduce((result, page) => {
        result[page.key] = true;

        return result;
      }, {}),
    }));
  };

  /* ==================================================
     DISABLE ALL
  ================================================== */

  const disableAllPages = () => {
    updateForm((current) => ({
      ...current,

      pages: PAGE_OPTIONS.reduce((result, page) => {
        result[page.key] = false;

        return result;
      }, {}),
    }));
  };

  /* ==================================================
     ACTIVE PAGE COUNT
  ================================================== */

  const activePageCount = useMemo(() => {
    return PAGE_OPTIONS.filter((page) => form.pages[page.key]).length;
  }, [form.pages]);

  /* ==================================================
     SAVE POSTER
  ================================================== */

  const savePoster = async (event) => {
    event?.preventDefault();

    if (!hasChanges) {
      return;
    }

    /*
     * Image is required only when saving an actual poster.
     *
     * Even if the master toggle is OFF, we keep the poster
     * configuration in the database.
     */

    if (!form.image.url) {
      toast.error("Please upload a poster image first.");

      return;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT block saving when enabled === false.
     *
     * The administrator must be able to turn the poster
     * completely OFF.
     *
     * If enabled === true, at least one page must be selected.
     */

    if (form.enabled && activePageCount === 0) {
      toast.error("Enable the poster on at least one page.");

      return;
    }

    try {
      setSaving(true);
      setError("");

      const method = posterId ? "PUT" : "POST";

      const url = posterId
        ? `${API_URL}/api/posters/${posterId}`
        : `${API_URL}/api/posters`;

      /*
       * Build a clean payload.
       *
       * This makes sure `enabled: false` is explicitly
       * sent to the backend.
       */

      const payload = {
        image: {
          url: form.image.url,
          publicId: form.image.publicId || "",
        },

        link: form.link.trim(),

        enabled: Boolean(form.enabled),

        pages: {
          home: Boolean(form.pages.home),
          about: Boolean(form.pages.about),
          services: Boolean(form.pages.services),
          portfolio: Boolean(form.pages.portfolio),
          careers: Boolean(form.pages.careers),
          contact: Boolean(form.pages.contact),
          blog: Boolean(form.pages.blog),
        },
      };

      console.log("Saving poster payload:", payload);

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save poster.");
      }

      /*
       * Backend response.
       */

      let savedPoster = data.poster || data.data || null;

      /*
       * Some APIs return:
       *
       * { posters: [...] }
       */

      if (!savedPoster && Array.isArray(data.posters)) {
        savedPoster = data.posters[0] || null;
      }

      if (savedPoster) {
        /*
         * Normalize the ACTUAL backend response.
         *
         * This is critical.
         *
         * If backend saved enabled:false,
         * normalizePoster() keeps it false.
         */

        const normalized = normalizePoster(savedPoster);

        setForm(normalized);

        setPosterId(savedPoster._id || savedPoster.id || posterId);
      } else {
        /*
         * If backend doesn't return the saved object,
         * keep the exact payload we sent.
         */

        setForm({
          image: {
            url: payload.image.url,
            publicId: payload.image.publicId,
          },

          link: payload.link,

          enabled: payload.enabled,

          pages: {
            ...payload.pages,
          },
        });
      }

      /*
       * Backend and frontend are now synchronized.
       *
       * Save button disappears.
       */

      setHasChanges(false);

      toast.success("Poster saved successfully.");
    } catch (err) {
      console.error("Save poster error:", err);

      setError(err.message || "Failed to save poster.");

      toast.error(err.message || "Failed to save poster.");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     RESET CHANGES
  ================================================== */

  const resetChanges = async () => {
    if (!hasChanges) {
      return;
    }

    const confirmed = window.confirm("Discard all unsaved poster changes?");

    if (!confirmed) {
      return;
    }

    await loadPoster();

    toast.success("Changes discarded.");
  };

  /* ==================================================
     DELETE POSTER
  ================================================== */

  const deletePoster = async () => {
    if (!posterId) {
      setForm({
        ...DEFAULT_FORM,
        image: { ...DEFAULT_FORM.image },
        pages: { ...DEFAULT_FORM.pages },
      });

      setHasChanges(true);

      return;
    }

    const confirmed = window.confirm(
      "Delete the current poster? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/api/posters/${posterId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete poster.");
      }

      setForm({
        ...DEFAULT_FORM,
        image: { ...DEFAULT_FORM.image },
        pages: { ...DEFAULT_FORM.pages },
      });

      setPosterId(null);

      setHasChanges(false);

      toast.success("Poster deleted.");
    } catch (err) {
      console.error("Delete poster error:", err);

      setError(err.message || "Failed to delete poster.");

      toast.error(err.message || "Failed to delete poster.");
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {
    return (
      <div>
        <PageTitle
          eyebrow="Studio Control"
          title="Poster"
          description="Manage the promotional poster displayed across the public website."
        />

        <div className="mt-8 flex min-h-[300px] items-center justify-center border border-white/10 bg-white/[0.02]">
          <div className="text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-red-500" />

            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
              Loading Poster
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Studio Control"
        title="Poster"
        description="Manage the promotional poster displayed across the public website."
      />

      {/* ERROR */}

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={savePoster} className="mt-8 space-y-6">
        {/* ==================================================
            STATUS
        ================================================== */}

        <Card>
          <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                Poster Status
              </p>

              <h2 className="mt-2 text-lg font-bold">Promotional Poster</h2>

              <p className="mt-1 text-xs text-white/30">
                Only one poster can be active at a time.
              </p>
            </div>

            {/* MASTER TOGGLE */}

            <label className="flex cursor-pointer items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                {form.enabled ? "Enabled" : "Disabled"}
              </span>

              <input
                type="checkbox"
                checked={form.enabled}
                onChange={handleEnabledChange}
                className="sr-only"
              />

              <span
                className={`relative h-6 w-11 border transition ${
                  form.enabled
                    ? "border-red-500 bg-red-500"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 bg-white transition-all ${
                    form.enabled ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </label>
          </div>

          <div className="p-5">
            <div
              className={`flex items-center gap-3 border px-4 py-3 ${
                form.enabled
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {form.enabled ? (
                <Eye size={16} className="text-green-500" />
              ) : (
                <EyeOff size={16} className="text-white/30" />
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {form.enabled ? "Poster is enabled" : "Poster is disabled"}
                </p>

                <p className="mt-1 text-[10px] text-white/30">
                  {form.enabled
                    ? "The poster can appear on enabled pages."
                    : "The poster will not appear anywhere on the website."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ==================================================
            IMAGE + LINK
        ================================================== */}

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          {/* IMAGE */}

          <Card>
            <div className="border-b border-white/10 px-5 py-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                Artwork
              </p>

              <h2 className="mt-2 text-lg font-bold">Poster Image</h2>
            </div>

            <div className="p-5">
              <div className="overflow-hidden border border-white/10 bg-black">
                {form.image.url ? (
                  <div className="relative">
                    <img
                      src={form.image.url}
                      alt="Poster preview"
                      className="mx-auto max-h-[500px] w-full object-contain"
                    />

                    <div className="absolute left-3 top-3 flex items-center gap-2 bg-black/80 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] text-white/70">
                      <Check size={12} className="text-green-500" />
                      Image Selected
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center">
                    <div className="text-center">
                      <ImageIcon size={30} className="mx-auto text-white/20" />

                      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                        No poster image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white/60 transition hover:border-red-500 hover:text-white">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} />

                    {form.image.url ? "Replace Poster" : "Upload Poster"}
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadPoster}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </Card>

          {/* LINK */}

          <Card>
            <div className="border-b border-white/10 px-5 py-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                Destination
              </p>

              <h2 className="mt-2 text-lg font-bold">Poster Link</h2>
            </div>

            <div className="p-5">
              <label
                htmlFor="poster-link"
                className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/50"
              >
                Hyperlink
              </label>

              <div className="relative">
                <ExternalLink
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  id="poster-link"
                  type="url"
                  value={form.link}
                  onChange={handleLinkChange}
                  placeholder="https://example.com"
                  className="h-12 w-full border border-white/10 bg-black pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-red-500"
                />
              </div>

              <p className="mt-3 text-[9px] leading-relaxed text-white/20">
                Clicking the poster image will open this destination.
              </p>

              {form.link && (
                <a
                  href={form.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-red-500 transition hover:text-white"
                >
                  Test Link
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* ==================================================
            PAGE VISIBILITY
        ================================================== */}

        <Card>
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                Visibility
              </p>

              <h2 className="mt-2 text-lg font-bold">Page Visibility</h2>

              <p className="mt-1 text-xs text-white/30">
                Choose exactly where the popup should appear.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={enableAllPages}
                className="border border-white/10 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] text-white/40 transition hover:border-white/30 hover:text-white"
              >
                All
              </button>

              <button
                type="button"
                onClick={disableAllPages}
                className="border border-white/10 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] text-white/40 transition hover:border-white/30 hover:text-white"
              >
                None
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PAGE_OPTIONS.map((page) => {
                const active = form.pages[page.key];

                return (
                  <button
                    key={page.key}
                    type="button"
                    onClick={() => handlePageToggle(page.key)}
                    className={`flex items-center justify-between border px-4 py-4 text-left transition ${
                      active
                        ? "border-red-500/40 bg-red-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                          active ? "text-white" : "text-white/40"
                        }`}
                      >
                        {page.label}
                      </p>

                      <p className="mt-1 text-[9px] text-white/20">
                        {page.path}
                      </p>
                    </div>

                    <span
                      className={`flex h-5 w-5 items-center justify-center border ${
                        active
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-white/20 text-transparent"
                      }`}
                    >
                      <Check size={12} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border border-white/10 bg-white/[0.02] px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                {activePageCount} {activePageCount === 1 ? "page" : "pages"}{" "}
                selected
              </p>
            </div>
          </div>
        </Card>

        {/* ==================================================
            POPUP BEHAVIOR
        ================================================== */}

        <Card>
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
              Popup Behavior
            </p>

            <h2 className="mt-2 text-lg font-bold">Display Rules</h2>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Delay
              </p>

              <p className="mt-2 text-2xl font-black">3 sec</p>

              <p className="mt-2 text-[9px] leading-relaxed text-white/20">
                The popup appears approximately three seconds after the page
                loads.
              </p>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Trigger
              </p>

              <p className="mt-2 text-2xl font-black">Reload</p>

              <p className="mt-2 text-[9px] leading-relaxed text-white/20">
                The popup is evaluated independently for each enabled page when
                that page loads.
              </p>
            </div>
          </div>
        </Card>

        {/* ==================================================
            ACTION BAR
        ================================================== */}

        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col gap-3 border border-white/10 bg-[#0b0b0b]/95 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="px-2">
              {hasChanges ? (
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-yellow-500">
                  Unsaved changes
                </p>
              ) : (
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">
                  All changes saved
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* DISCARD */}

              {hasChanges && (
                <button
                  type="button"
                  onClick={resetChanges}
                  disabled={saving || uploading}
                  className="px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Discard
                </button>
              )}

              {/* DELETE */}

              {posterId && !hasChanges && (
                <button
                  type="button"
                  onClick={deletePoster}
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 border border-red-500/20 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              )}

              {/* SAVE */}

              {hasChanges && (
                <button
                  type="submit"
                  disabled={saving || uploading || !form.image.url}
                  className="inline-flex items-center justify-center gap-2 bg-red-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Poster
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
