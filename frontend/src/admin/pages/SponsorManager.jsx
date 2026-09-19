import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";

import {
  Button,
  Card,
  Input,
  PageTitle,
  Select,
  StatusBadge,
  EmptyState,
} from "../components/AdminUI";

const API_URL = "/api/sponsors";
const UPLOAD_URL = "/api/upload";

export default function SponsorManager() {
  const [sponsors, setSponsors] = useState([]);

  const [editing, setEditing] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  /* ==================================================
     LOAD SPONSORS
  ================================================== */

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch sponsors.");
      }

      setSponsors(result.sponsors || []);
    } catch (error) {
      console.error("Load sponsors error:", error);

      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     CREATE BLANK SPONSOR
  ================================================== */

  const blank = () => ({
    name: "",

    logo: {
      url: "",
      publicId: "",
    },

    website: "",

    active: true,

    order: sponsors.length + 1,
  });

  /* ==================================================
     SAVE SPONSOR
  ================================================== */

  const save = async () => {
    if (!editing?.name?.trim()) {
      window.alert("Please enter a sponsor name.");
      return;
    }

    if (!editing?.logo?.url) {
      window.alert("Please upload a sponsor logo.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editing._id);

      const url = isEditing ? `${API_URL}/${editing._id}` : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: editing.name.trim(),

          logo: {
            url: editing.logo.url,

            publicId: editing.logo.publicId || "",
          },

          website: editing.website?.trim() || "",

          active: Boolean(editing.active),

          order: Number(editing.order) || 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save sponsor.");
      }

      if (isEditing) {
        setSponsors((current) =>
          current.map((sponsor) =>
            sponsor._id === result.sponsor._id ? result.sponsor : sponsor,
          ),
        );
      } else {
        setSponsors((current) => [...current, result.sponsor]);
      }

      setEditing(null);
    } catch (error) {
      console.error("Save sponsor error:", error);

      window.alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE SPONSOR
  ================================================== */

  const remove = async (id) => {
    if (!window.confirm("Delete this sponsor?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete sponsor.");
      }

      setSponsors((current) => current.filter((sponsor) => sponsor._id !== id));
    } catch (error) {
      console.error("Delete sponsor error:", error);

      window.alert(error.message);
    }
  };

  /* ==================================================
     UPLOAD SPONSOR LOGO
     
     Browser
       ↓
     /api/upload
       ↓
     Express + Multer
       ↓
     Cloudinary
       ↓
     Cloudinary URL
  ================================================== */

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "sponsors");

      const response = await fetch(UPLOAD_URL, {
        method: "POST",

        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload sponsor logo.");
      }

      if (!result.file?.url) {
        throw new Error("Upload succeeded, but no image URL was returned.");
      }

      setEditing((current) => ({
        ...current,

        logo: {
          url: result.file.url,

          publicId: result.file.publicId || "",
        },
      }));
    } catch (error) {
      console.error("Sponsor logo upload error:", error);

      window.alert(error.message);
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* ==================================================
     UI
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Website / Sponsors"
        title="Sponsor Logos"
        description="Manage the sponsor logos displayed across the public website."
        action={
          <Button onClick={() => setEditing(blank())}>
            <Plus size={15} />
            Add Sponsor
          </Button>
        }
      />

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <Card className="p-8">
          <p className="text-sm text-white/40">Loading sponsors...</p>
        </Card>
      ) : sponsors.length === 0 ? (
        /* ==================================================
            EMPTY
        ================================================== */

        <EmptyState>No sponsor logos have been added yet.</EmptyState>
      ) : (
        /* ==================================================
            SPONSOR LIST
        ================================================== */

        <Card className="overflow-hidden">
          <div className="divide-y divide-white/10">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor._id}
                className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
              >
                {/* SPONSOR INFO */}

                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-28 items-center justify-center border border-white/10 bg-black p-3">
                    {sponsor.logo?.url ? (
                      <img
                        src={sponsor.logo.url}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/20">
                        No Logo
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold">{sponsor.name}</h3>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/25">
                      Order # {sponsor.order}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={sponsor.active ? "Published" : "Draft"}
                  />

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...sponsor,

                        logo: {
                          url: sponsor.logo?.url || "",

                          publicId: sponsor.logo?.publicId || "",
                        },
                      })
                    }
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:border-white/30 hover:text-white"
                    aria-label={`Edit ${sponsor.name}`}
                  >
                    <Pencil size={15} />
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() => remove(sponsor._id)}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-500"
                    aria-label={`Delete ${sponsor.name}`}
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
          EDIT / CREATE MODAL
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-xl border border-white/10 bg-[#0b0b0b]">
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="font-bold">{editing.name || "New Sponsor"}</h2>

              <button
                type="button"
                onClick={() => {
                  if (!uploading && !saving) {
                    setEditing(null);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-white/5"
                aria-label="Close"
                disabled={uploading || saving}
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <div className="space-y-5 p-5">
              {/* SPONSOR NAME */}

              <Input
                label="Sponsor Name"
                value={editing.name}
                onChange={(event) =>
                  setEditing({
                    ...editing,

                    name: event.target.value,
                  })
                }
                disabled={saving}
              />

              {/* WEBSITE */}

              <Input
                label="Website"
                type="url"
                placeholder="https://example.com"
                value={editing.website || ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,

                    website: event.target.value,
                  })
                }
                disabled={saving}
              />

              {/* ==================================================
                  LOGO UPLOAD
              ================================================== */}

              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Sponsor Logo
                </span>

                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* PREVIEW */}

                  <div className="flex h-24 w-32 shrink-0 items-center justify-center border border-white/10 bg-black p-3">
                    {editing.logo?.url ? (
                      <img
                        src={editing.logo.url}
                        alt={editing.name || "Sponsor logo"}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/20">
                        No Logo
                      </span>
                    )}
                  </div>

                  {/* UPLOAD */}

                  <label
                    className={`flex items-center gap-2 self-start border border-white/15 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${
                      uploading || saving
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-studio-red hover:bg-studio-red"
                    }`}
                  >
                    <UploadCloud size={15} />

                    {uploading ? "Uploading..." : "Upload Logo"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      onChange={uploadLogo}
                      disabled={uploading || saving}
                    />
                  </label>
                </div>

                <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-white/20">
                  JPG, PNG, WEBP or AVIF
                </p>
              </div>

              {/* ==================================================
                  ORDER + STATUS
              ================================================== */}

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Display Order"
                  type="number"
                  min="1"
                  value={editing.order}
                  onChange={(event) =>
                    setEditing({
                      ...editing,

                      order: Number(event.target.value) || 0,
                    })
                  }
                  disabled={saving}
                />

                <Select
                  label="Status"
                  value={editing.active ? "Published" : "Draft"}
                  onChange={(event) =>
                    setEditing({
                      ...editing,

                      active: event.target.value === "Published",
                    })
                  }
                  disabled={saving}
                >
                  <option value="Published">Published</option>

                  <option value="Draft">Draft</option>
                </Select>
              </div>
            </div>

            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={uploading || saving}
              >
                Cancel
              </Button>

              <Button onClick={save} disabled={uploading || saving}>
                {saving ? "Saving..." : "Save Sponsor"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
