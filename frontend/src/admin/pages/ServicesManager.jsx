import { useEffect, useState } from "react";
import {
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  FileText,
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
   API CONFIG
================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ==================================================
   HELPERS
================================================== */

const createSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* ==================================================
   NORMALIZE IMAGE
================================================== */

const normalizeImage = (image) => {
  if (typeof image === "string") {
    return {
      url: image,
      publicId: "",
    };
  }

  if (image && typeof image === "object") {
    return {
      url: image.url || "",
      publicId: image.publicId || "",
    };
  }

  return {
    url: "",
    publicId: "",
  };
};

/* ==================================================
   NORMALIZE IMAGES
================================================== */

const normalizeImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map(normalizeImage).filter((image) => image.url.trim() !== "");
};

/* ==================================================
   NORMALIZE BROCHURE
================================================== */

const normalizeBrochure = (brochure) => {
  if (typeof brochure === "string") {
    return {
      url: brochure,
      publicId: "",
    };
  }

  if (brochure && typeof brochure === "object") {
    return {
      url: brochure.url || "",
      publicId: brochure.publicId || "",
    };
  }

  return {
    url: "",
    publicId: "",
  };
};

/* ==================================================
   NORMALIZE FEATURES
================================================== */

const normalizeFeatures = (features) => {
  if (!Array.isArray(features) || features.length === 0) {
    return [""];
  }

  return features.map((feature) =>
    typeof feature === "string" ? feature : String(feature ?? ""),
  );
};

/* ==================================================
   COMPONENT
================================================== */

export default function ServicesManager() {
  const [services, setServices] = useState([]);

  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* ==================================================
     LOAD SERVICES
  ================================================== */

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/services`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch services");
      }

      const normalizedServices = (result.services || []).map((service) => ({
        ...service,

        images: normalizeImages(service.images),

        brochure: normalizeBrochure(service.brochure),

        features: normalizeFeatures(service.features),
      }));

      setServices(normalizedServices);
    } catch (err) {
      console.error("Load services error:", err);

      setError(
        err.message ||
          "Failed to fetch services. Check whether your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==================================================
     BLANK SERVICE
  ================================================== */

  const blank = () => ({
    _id: null,

    title: "",

    slug: "",

    showcaseTitle: "",

    shortDescription: "",

    description: "",

    brochure: {
      url: "",
      publicId: "",
    },

    images: [],

    features: [""],

    active: true,

    featured: false,

    order: services.length + 1,
  });

  /* ==================================================
     OPEN NEW
  ================================================== */

  const openNew = () => {
    setError("");
    setSuccess("");

    setEditing(blank());
  };

  /* ==================================================
     OPEN EDIT
  ================================================== */

  const openEdit = (service) => {
    setError("");
    setSuccess("");

    setEditing({
      ...service,

      images: normalizeImages(service.images),

      brochure: normalizeBrochure(service.brochure),

      features: normalizeFeatures(service.features),
    });
  };

  /* ==================================================
     FIELD UPDATE
  ================================================== */

  const updateField = (field, value) => {
    setEditing((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ==================================================
     TITLE → SLUG
  ================================================== */

  const updateTitle = (value) => {
    setEditing((current) => ({
      ...current,

      title: value,

      slug: current._id || current.slug ? current.slug : createSlug(value),
    }));
  };

  /* ==================================================
     FEATURE MANAGEMENT
  ================================================== */

  const updateFeature = (index, value) => {
    setEditing((current) => {
      const features = [...current.features];

      features[index] = value;

      return {
        ...current,
        features,
      };
    });
  };

  const addFeature = () => {
    setEditing((current) => ({
      ...current,

      features: [...(current.features || []), ""],
    }));
  };

  const removeFeature = (index) => {
    setEditing((current) => {
      const features = (current.features || []).filter(
        (_, featureIndex) => featureIndex !== index,
      );

      return {
        ...current,

        features: features.length > 0 ? features : [""],
      };
    });
  };

  /* ==================================================
     IMAGE URL
  ================================================== */

  const addImageUrl = () => {
    const url = window.prompt("Enter image URL");

    if (!url || !url.trim()) {
      return;
    }

    setEditing((current) => ({
      ...current,

      images: [
        ...(current.images || []),
        {
          url: url.trim(),
          publicId: "",
        },
      ],
    }));
  };

  /* ==================================================
     REMOVE IMAGE
  ================================================== */

  const removeImage = (index) => {
    setEditing((current) => ({
      ...current,

      images: (current.images || []).filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));
  };

  /* ==================================================
     UPLOAD IMAGE
  ================================================== */

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "services");

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed");
      }

      const uploadedFile = result.file;

      const imageUrl = uploadedFile?.url;

      if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      const imageObject = {
        url: imageUrl,
        publicId: uploadedFile?.publicId || "",
      };

      setEditing((current) => ({
        ...current,

        images: [...(current.images || []), imageObject],
      }));
    } catch (err) {
      console.error("Image upload error:", err);

      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* ==================================================
     BROCHURE URL
  ================================================== */

  const addBrochureUrl = () => {
    const url = window.prompt("Enter brochure URL");

    if (!url || !url.trim()) {
      return;
    }

    updateField("brochure", {
      url: url.trim(),
      publicId: "",
    });
  };

  /* ==================================================
     UPLOAD BROCHURE
  ================================================== */

  const uploadBrochure = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "brochures");

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Brochure upload failed");
      }

      const uploadedFile = result.file;

      const brochureUrl = uploadedFile?.url;

      if (!brochureUrl) {
        throw new Error("Cloudinary did not return a brochure URL.");
      }

      updateField("brochure", {
        url: brochureUrl,
        publicId: uploadedFile?.publicId || "",
      });
    } catch (err) {
      console.error("Brochure upload error:", err);

      setError(err.message || "Failed to upload brochure.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* ==================================================
     SAVE SERVICE
  ================================================== */

  const save = async () => {
    if (!editing?.title?.trim()) {
      setError("Service title is required.");
      return;
    }

    if (!editing?.slug?.trim()) {
      setError("Service slug is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      /* -------------------------------------------
         IMAGES
      -------------------------------------------- */

      const normalizedImages = (editing.images || [])
        .map(normalizeImage)
        .filter(
          (image) => typeof image.url === "string" && image.url.trim() !== "",
        )
        .map((image) => ({
          url: image.url.trim(),
          publicId: image.publicId || "",
        }));

      /* -------------------------------------------
         BROCHURE
      -------------------------------------------- */

      const normalizedBrochure = normalizeBrochure(editing.brochure);

      /* -------------------------------------------
         FEATURES
      -------------------------------------------- */

      const normalizedFeatures = (editing.features || [])
        .filter(
          (feature) => typeof feature === "string" && feature.trim() !== "",
        )
        .map((feature) => feature.trim());

      /* -------------------------------------------
         PAYLOAD
      -------------------------------------------- */

      const payload = {
        title: editing.title.trim(),

        slug: editing.slug.trim(),

        showcaseTitle: editing.showcaseTitle?.trim() || "",

        shortDescription: editing.shortDescription?.trim() || "",

        description: editing.description || "",

        brochure: {
          url: normalizedBrochure.url || "",
          publicId: normalizedBrochure.publicId || "",
        },

        images: normalizedImages,

        features: normalizedFeatures,

        active: Boolean(editing.active),

        featured: Boolean(editing.featured),

        order: Number(editing.order) || 0,
      };

      /* -------------------------------------------
         CREATE / UPDATE
      -------------------------------------------- */

      const isEditing = Boolean(editing._id);

      const url = isEditing
        ? `${API_BASE_URL}/services/${editing._id}`
        : `${API_BASE_URL}/services`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save service");
      }

      /* -------------------------------------------
         NORMALIZE SAVED SERVICE
      -------------------------------------------- */

      const savedService = {
        ...result.service,

        images: normalizeImages(result.service?.images),

        brochure: normalizeBrochure(result.service?.brochure),

        features: normalizeFeatures(result.service?.features),
      };

      /* -------------------------------------------
         UPDATE STATE
      -------------------------------------------- */

      if (isEditing) {
        setServices((current) =>
          current.map((service) =>
            service._id === editing._id ? savedService : service,
          ),
        );
      } else {
        setServices((current) => [...current, savedService]);
      }

      setEditing(null);

      setSuccess(
        isEditing
          ? "Service updated successfully."
          : "Service created successfully.",
      );
    } catch (err) {
      console.error("Save service error:", err);

      setError(
        err.message || "Failed to save service. Check your backend connection.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==================================================
     DELETE
  ================================================== */

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete service");
      }

      setServices((current) => current.filter((service) => service._id !== id));

      setSuccess("Service deleted successfully.");
    } catch (err) {
      console.error("Delete service error:", err);

      setError(err.message || "Failed to delete service.");
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (loading) {
    return (
      <div>
        <PageTitle
          eyebrow="Website / Services"
          title="Services"
          description="Manage the services displayed throughout the public website."
        />

        <Card>
          <div className="p-8 text-center text-sm text-white/40">
            Loading services...
          </div>
        </Card>
      </div>
    );
  }

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div>
      <PageTitle
        eyebrow="Website / Services"
        title="Services"
        description="Manage the services displayed throughout the public website."
        action={
          <Button onClick={openNew}>
            <Plus size={15} />
            Add Service
          </Button>
        }
      />

      {/* -----------------------------------------------
          ALERTS
      ------------------------------------------------ */}

      {error && (
        <div className="mb-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* -----------------------------------------------
          SERVICES
      ------------------------------------------------ */}

      {services.length === 0 ? (
        <EmptyState>
          No services are currently loaded. Add your services here.
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-white/10">
            {services
              .slice()
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((service) => (
                <div
                  key={service._id}
                  className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold">{service.title}</h3>

                    {service.showcaseTitle && (
                      <p className="mt-1 text-xs text-white/50">
                        {service.showcaseTitle}
                      </p>
                    )}

                    <p className="mt-2 line-clamp-1 max-w-2xl text-xs text-white/30">
                      {service.shortDescription || service.description}
                    </p>

                    <div className="mt-3 flex gap-2 text-[10px] uppercase tracking-wider text-white/30">
                      <span>{service.images?.length || 0} Images</span>

                      <span>•</span>

                      <span>{service.features?.length || 0} Features</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={service.active ? "Published" : "Draft"}
                    />

                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(service._id)}
                      className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-500"
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
          EDIT MODAL
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl border border-white/10 bg-[#0b0b0b]">
            {/* -------------------------------------------
                HEADER
            -------------------------------------------- */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="font-bold">{editing.title || "New Service"}</h2>

                <p className="mt-1 text-xs text-white/30">
                  Configure the service showcase.
                </p>
              </div>

              <button type="button" onClick={() => setEditing(null)}>
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* -------------------------------------------
                BODY
            -------------------------------------------- */}

            <div className="space-y-6 p-5">
              {/* TITLE + SLUG */}

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Service Title"
                  value={editing.title || ""}
                  onChange={(event) => updateTitle(event.target.value)}
                  placeholder="Podcast Studio Rental"
                />

                <Input
                  label="Slug"
                  value={editing.slug || ""}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="podcast-studio-rental"
                />
              </div>

              {/* SHOWCASE TITLE */}

              <Input
                label="Showcase Title"
                value={editing.showcaseTitle || ""}
                onChange={(event) =>
                  updateField("showcaseTitle", event.target.value)
                }
                placeholder="A Space Built for Conversations That Matter."
              />

              {/* SHORT DESCRIPTION */}

              <Textarea
                label="Short Description"
                value={editing.shortDescription || ""}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
                placeholder="Short description displayed on service cards."
              />

              {/* FULL DESCRIPTION */}

              <Textarea
                label="Full Description"
                value={editing.description || ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Complete service description..."
              />

              {/* -------------------------------------------
                  BROCHURE
              -------------------------------------------- */}

              <div>
                <label className="mb-2 block text-xs font-medium text-white/60">
                  Brochure
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex cursor-pointer items-center justify-center gap-2 border border-white/10 px-4 py-3 text-xs text-white/60 hover:border-white/30 hover:text-white">
                    <Upload size={15} />

                    {uploading ? "Uploading..." : "Upload Brochure"}

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={uploadBrochure}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  <Button
                    variant="secondary"
                    onClick={addBrochureUrl}
                    disabled={uploading}
                  >
                    <FileText size={15} />
                    Use URL
                  </Button>
                </div>

                {editing.brochure?.url && (
                  <div className="mt-3 border border-white/10 bg-white/[0.02] p-3">
                    <p className="break-all text-xs text-white/40">
                      {editing.brochure.url}
                    </p>

                    {editing.brochure.publicId && (
                      <p className="mt-1 break-all text-[10px] text-white/20">
                        Public ID: {editing.brochure.publicId}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        updateField("brochure", {
                          url: "",
                          publicId: "",
                        })
                      }
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Remove brochure
                    </button>
                  </div>
                )}
              </div>

              {/* -------------------------------------------
                  IMAGES
              -------------------------------------------- */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-xs font-medium text-white/60">
                    Service Images
                  </label>

                  <span className="text-[10px] text-white/30">
                    {editing.images?.length || 0} images
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* UPLOAD */}

                  <label
                    className={`flex h-28 w-28 flex-col items-center justify-center gap-2 border border-dashed border-white/20 text-white/40 hover:border-white/40 hover:text-white ${
                      uploading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <ImagePlus size={22} />

                    <span className="text-[10px]">
                      {uploading ? "Uploading" : "Upload Image"}
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                      onChange={uploadImage}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  {/* URL */}

                  <button
                    type="button"
                    onClick={addImageUrl}
                    disabled={uploading}
                    className="flex h-28 w-28 flex-col items-center justify-center gap-2 border border-dashed border-white/20 text-white/40 hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={22} />

                    <span className="text-[10px]">Add URL</span>
                  </button>

                  {/* IMAGES */}

                  {(editing.images || []).map((image, index) => {
                    const normalizedImage = normalizeImage(image);

                    return (
                      <div
                        key={`${normalizedImage.url}-${index}`}
                        className="group relative h-28 w-28 overflow-hidden border border-white/10 bg-white/[0.02]"
                      >
                        <img
                          src={normalizedImage.url}
                          alt={`Service ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center bg-black/80 text-white/70 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>

                        {/* PUBLIC ID */}

                        {normalizedImage.publicId && (
                          <div className="absolute bottom-0 left-0 right-0 truncate bg-black/80 px-1 py-1 text-[8px] text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
                            {normalizedImage.publicId}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* -------------------------------------------
                  FEATURES
              -------------------------------------------- */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-xs font-medium text-white/60">
                    Features
                  </label>

                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white"
                  >
                    <Plus size={13} />
                    Add Feature
                  </button>
                </div>

                <div className="space-y-3">
                  {(editing.features || []).map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(event) =>
                          updateFeature(index, event.target.value)
                        }
                        placeholder={`Feature ${index + 1}`}
                      />

                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-white/30 hover:border-red-500/40 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* -------------------------------------------
                  SETTINGS
              -------------------------------------------- */}

              <div className="grid gap-5 md:grid-cols-3">
                <Input
                  label="Display Order"
                  type="number"
                  value={editing.order ?? 0}
                  onChange={(event) =>
                    updateField("order", Number(event.target.value))
                  }
                />

                <Select
                  label="Status"
                  value={editing.active ? "Published" : "Draft"}
                  onChange={(event) =>
                    updateField("active", event.target.value === "Published")
                  }
                >
                  <option>Published</option>

                  <option>Draft</option>
                </Select>

                <Select
                  label="Featured"
                  value={editing.featured ? "Yes" : "No"}
                  onChange={(event) =>
                    updateField("featured", event.target.value === "Yes")
                  }
                >
                  <option>Yes</option>

                  <option>No</option>
                </Select>
              </div>
            </div>

            {/* -------------------------------------------
                FOOTER
            -------------------------------------------- */}

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
                  : editing._id
                    ? "Update Service"
                    : "Save Service"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
