import { useEffect, useState } from "react";
import { Save, UploadCloud } from "lucide-react";

import { Button, Card, Input, PageTitle } from "../components/AdminUI";
import { adminFetch, adminJson } from "../utils/authFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ==================================================
   DEFAULT HOME
================================================== */

const emptyHome = {
  hero: {
    title: "Experience",
    subtitle: "the magic of",
    accent: "Storytelling.",
    description:
      "A grand movie premiere backdrop, with lights, a red carpet, and an audience.",

    video: {
      url: "",
      publicId: "",
      playbackUrl: "",
    },

    poster: {
      url: "",
      publicId: "",
    },
  },

  about: {
    title: "",
    description: "",

    image: {
      url: "",
      publicId: "",
    },
  },

  socials: {
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
  },

  seo: {
    title: "",
    description: "",
    keywords: [],
  },
};

/* ==================================================
   HOME MANAGER
================================================== */

export default function HomeManager() {
  const [home, setHome] = useState(emptyHome);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==================================================
     FETCH HOME
  ================================================== */

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/home`);

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to load home data");
      }

      const serverHome = result.home || {};
      const serverHero = serverHome.hero || {};

      setHome({
        ...emptyHome,

        ...serverHome,

        hero: {
          ...emptyHome.hero,

          ...serverHero,

          title: serverHero.title?.trim() || emptyHome.hero.title,

          subtitle: serverHero.subtitle?.trim() || emptyHome.hero.subtitle,

          accent: serverHero.accent?.trim() || emptyHome.hero.accent,

          description:
            serverHero.description?.trim() || emptyHome.hero.description,

          video: {
            ...emptyHome.hero.video,
            ...(serverHero.video || {}),
          },

          poster: {
            ...emptyHome.hero.poster,
            ...(serverHero.poster || {}),
          },
        },

        about: {
          ...emptyHome.about,

          ...(serverHome.about || {}),

          image: {
            ...emptyHome.about.image,
            ...(serverHome.about?.image || {}),
          },
        },

        socials: {
          ...emptyHome.socials,
          ...(serverHome.socials || {}),
        },

        seo: {
          ...emptyHome.seo,

          ...(serverHome.seo || {}),

          keywords: Array.isArray(serverHome.seo?.keywords)
            ? serverHome.seo.keywords
            : [],
        },
      });
    } catch (err) {
      console.error("Fetch home error:", err);

      setError(err instanceof Error ? err.message : "Failed to load home data");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     UPDATE HERO FIELD
  ================================================== */

  const updateHeroField = (field, value) => {
    setHome((current) => ({
      ...current,

      hero: {
        ...current.hero,

        [field]: value,
      },
    }));
  };

  /* ==================================================
     UPDATE ABOUT FIELD
  ================================================== */

  const updateAboutField = (field, value) => {
    setHome((current) => ({
      ...current,

      about: {
        ...current.about,

        [field]: value,
      },
    }));
  };

  /* ==================================================
     UPDATE SOCIAL
  ================================================== */

  const updateSocial = (field, value) => {
    setHome((current) => ({
      ...current,

      socials: {
        ...current.socials,

        [field]: value,
      },
    }));
  };

  /* ==================================================
     UPDATE SEO
  ================================================== */

  const updateSeoField = (field, value) => {
    setHome((current) => ({
      ...current,

      seo: {
        ...current.seo,

        [field]: value,
      },
    }));
  };

  /* ==================================================
     UPLOAD FILE
  ================================================== */

  const uploadFile = async (event, type) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(type);
      setMessage("");
      setError("");

      /* ----------------------------------------------
         STEP 1
         UPLOAD FILE
      ---------------------------------------------- */

      const formData = new FormData();

      formData.append("file", file);

      /*
       * IMPORTANT:
       *
       * Do NOT manually set Content-Type here.
       *
       * Browser automatically sets:
       *
       * multipart/form-data;
       * boundary=...
       *
       * adminFetch also includes credentials and
       * automatically handles access-token refresh.
       */

      const uploadResponse = await adminFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let uploadResult = null;

      try {
        uploadResult = await uploadResponse.json();
      } catch {
        uploadResult = null;
      }

      if (!uploadResponse.ok || !uploadResult?.success) {
        throw new Error(
          uploadResult?.error || uploadResult?.message || "File upload failed",
        );
      }

      const uploadedFile = uploadResult.file;

      if (!uploadedFile?.url) {
        throw new Error("Upload succeeded but no file URL was returned.");
      }

      /* ----------------------------------------------
         HERO VIDEO
      ---------------------------------------------- */

      if (type === "heroVideo") {
        const result = await adminJson("/api/home/hero/video", {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: uploadedFile.url,

            publicId: uploadedFile.publicId || "",

            playbackUrl: uploadedFile.playbackUrl || "",
          }),
        });

        const savedHome = result?.home || {};

        setHome((current) => ({
          ...current,

          ...(savedHome || {}),

          hero: {
            ...current.hero,

            ...(savedHome.hero || {}),

            video: {
              ...current.hero.video,

              ...(savedHome.hero?.video || {}),

              url: uploadedFile.url,

              publicId: uploadedFile.publicId || "",

              playbackUrl: uploadedFile.playbackUrl || "",
            },
          },
        }));

        setMessage("Hero video uploaded and saved successfully.");
      }

      /* ----------------------------------------------
         HERO POSTER
      ---------------------------------------------- */

      if (type === "heroPoster") {
        const result = await adminJson("/api/home/hero/poster", {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: uploadedFile.url,

            publicId: uploadedFile.publicId || "",
          }),
        });

        const savedHome = result?.home || {};

        setHome((current) => ({
          ...current,

          ...(savedHome || {}),

          hero: {
            ...current.hero,

            ...(savedHome.hero || {}),

            poster: {
              ...current.hero.poster,

              ...(savedHome.hero?.poster || {}),

              url: uploadedFile.url,

              publicId: uploadedFile.publicId || "",
            },
          },
        }));

        setMessage("Hero poster uploaded and saved successfully.");
      }

      /* ----------------------------------------------
         ABOUT IMAGE
      ---------------------------------------------- */

      if (type === "aboutImage") {
        const result = await adminJson("/api/home/about", {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image: {
              url: uploadedFile.url,

              publicId: uploadedFile.publicId || "",
            },
          }),
        });

        const savedHome = result?.home || {};

        setHome((current) => ({
          ...current,

          ...(savedHome || {}),

          about: {
            ...current.about,

            ...(savedHome.about || {}),

            image: {
              ...current.about.image,

              ...(savedHome.about?.image || {}),

              url: uploadedFile.url,

              publicId: uploadedFile.publicId || "",
            },
          },
        }));

        setMessage("About image uploaded and saved successfully.");
      }
    } catch (err) {
      console.error("Upload error:", err);

      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading("");

      /*
       * Allows selecting the same file again.
       */
      event.target.value = "";
    }
  };

  /* ==================================================
     SAVE ALL SETTINGS
  ================================================== */

  const save = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const result = await adminJson("/api/home", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          /* ----------------------------------------
               HERO
            ---------------------------------------- */

          hero: {
            title: home.hero.title,

            subtitle: home.hero.subtitle,

            accent: home.hero.accent,

            description: home.hero.description,
          },

          /* ----------------------------------------
               ABOUT
            ---------------------------------------- */

          about: {
            title: home.about.title,

            description: home.about.description,
          },

          /* ----------------------------------------
               SOCIALS
            ---------------------------------------- */

          socials: home.socials,

          /* ----------------------------------------
               SEO
            ---------------------------------------- */

          seo: home.seo,
        }),
      });

      const savedHome = result?.home || {};

      setHome((current) => ({
        ...current,

        ...savedHome,

        hero: {
          ...current.hero,

          ...(savedHome.hero || {}),

          video: {
            ...current.hero.video,

            ...(savedHome.hero?.video || {}),
          },

          poster: {
            ...current.hero.poster,

            ...(savedHome.hero?.poster || {}),
          },
        },

        about: {
          ...current.about,

          ...(savedHome.about || {}),

          image: {
            ...current.about.image,

            ...(savedHome.about?.image || {}),
          },
        },

        socials: {
          ...current.socials,

          ...(savedHome.socials || {}),
        },

        seo: {
          ...current.seo,

          ...(savedHome.seo || {}),

          keywords: Array.isArray(savedHome.seo?.keywords)
            ? savedHome.seo.keywords
            : current.seo.keywords,
        },
      }));

      setMessage("Home settings saved successfully.");
    } catch (err) {
      console.error("Save home error:", err);

      setError(
        err instanceof Error ? err.message : "Failed to save Home settings",
      );
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
          eyebrow="Website / Home"
          title="Home"
          description="Manage the homepage content."
        />

        <div className="border border-white/10 bg-white/[0.02] p-8 text-sm text-white/50">
          Loading Home settings...
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
        eyebrow="Website / Home"
        title="Home"
        description="Manage the homepage content, media, social links and SEO."
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

      <div className="space-y-6">
        {/* ==================================================
            HERO CONTENT
        ================================================== */}

        <Card>
          <div className="border-b border-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em]">
              Hero Content
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              Content displayed over the homepage hero section.
            </p>
          </div>

          <div className="grid gap-5 p-5">
            {/* TITLE */}

            <Input
              label="Hero Title Line 1"
              value={home.hero.title}
              onChange={(event) => updateHeroField("title", event.target.value)}
            />

            {/* SUBTITLE */}

            <Input
              label="Hero Title Line 2"
              value={home.hero.subtitle}
              onChange={(event) =>
                updateHeroField("subtitle", event.target.value)
              }
            />

            {/* ACCENT */}

            <Input
              label="Hero Accent"
              value={home.hero.accent}
              onChange={(event) =>
                updateHeroField("accent", event.target.value)
              }
            />

            <p className="-mt-2 text-[10px] text-white/30">
              This text appears as the red third line of the hero heading.
            </p>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                Hero Description
              </label>

              <textarea
                value={home.hero.description}
                onChange={(event) =>
                  updateHeroField("description", event.target.value)
                }
                rows={4}
                className="w-full resize-none border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </div>
          </div>
        </Card>

        {/* ==================================================
            HERO MEDIA
        ================================================== */}

        <div className="grid gap-6 xl:grid-cols-2">
          {/* HERO VIDEO */}

          <Card>
            <div className="border-b border-white/10 p-5">
              <p className="text-xs font-bold">Hero Video</p>

              <p className="mt-1 text-[10px] text-white/30">
                The video displayed in the homepage hero.
              </p>
            </div>

            <div className="p-5">
              {home.hero.video.url ? (
                <div className="aspect-video overflow-hidden bg-black">
                  <video
                    src={home.hero.video.url}
                    poster={home.hero.poster.url}
                    muted
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black text-xs text-white/30">
                  No hero video uploaded
                </div>
              )}

              <div className="mt-5">
                <Input
                  label="Video URL"
                  value={home.hero.video.url}
                  onChange={(event) =>
                    setHome((current) => ({
                      ...current,

                      hero: {
                        ...current.hero,

                        video: {
                          ...current.hero.video,

                          url: event.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:border-red-500 hover:bg-red-500">
                <UploadCloud size={16} />

                {uploading === "heroVideo"
                  ? "Uploading..."
                  : "Upload New Video"}

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(event) => uploadFile(event, "heroVideo")}
                  disabled={Boolean(uploading)}
                />
              </label>
            </div>
          </Card>

          {/* HERO POSTER */}

          <Card>
            <div className="border-b border-white/10 p-5">
              <p className="text-xs font-bold">Hero Poster</p>

              <p className="mt-1 text-[10px] text-white/30">
                Fallback image for the hero video.
              </p>
            </div>

            <div className="p-5">
              {home.hero.poster.url ? (
                <div className="aspect-video overflow-hidden bg-black">
                  <img
                    src={home.hero.poster.url}
                    alt="Hero poster"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black text-xs text-white/30">
                  No hero poster uploaded
                </div>
              )}

              <div className="mt-5">
                <Input
                  label="Poster URL"
                  value={home.hero.poster.url}
                  onChange={(event) =>
                    setHome((current) => ({
                      ...current,

                      hero: {
                        ...current.hero,

                        poster: {
                          ...current.hero.poster,

                          url: event.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition hover:border-red-500 hover:bg-red-500">
                <UploadCloud size={16} />

                {uploading === "heroPoster"
                  ? "Uploading..."
                  : "Upload New Poster"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => uploadFile(event, "heroPoster")}
                  disabled={Boolean(uploading)}
                />
              </label>
            </div>
          </Card>
        </div>

        {/* ==================================================
            SOCIALS
        ================================================== */}

        <Card>
          <div className="border-b border-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em]">
              Social Links
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              Social media links displayed on the website.
            </p>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            <Input
              label="Instagram"
              value={home.socials.instagram}
              onChange={(event) =>
                updateSocial("instagram", event.target.value)
              }
            />

            <Input
              label="Facebook"
              value={home.socials.facebook}
              onChange={(event) => updateSocial("facebook", event.target.value)}
            />

            <Input
              label="LinkedIn"
              value={home.socials.linkedin}
              onChange={(event) => updateSocial("linkedin", event.target.value)}
            />

            <Input
              label="Twitter / X"
              value={home.socials.twitter}
              onChange={(event) => updateSocial("twitter", event.target.value)}
            />
          </div>
        </Card>

        {/* ==================================================
            SEO
        ================================================== */}

        <Card>
          <div className="border-b border-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em]">SEO</p>

            <p className="mt-1 text-[10px] text-white/30">
              Search engine metadata for the homepage.
            </p>
          </div>

          <div className="grid gap-5 p-5">
            <Input
              label="SEO Title"
              value={home.seo.title}
              onChange={(event) => updateSeoField("title", event.target.value)}
            />

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                SEO Description
              </label>

              <textarea
                value={home.seo.description}
                onChange={(event) =>
                  updateSeoField("description", event.target.value)
                }
                rows={4}
                className="w-full resize-none border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
              />
            </div>

            <Input
              label="SEO Keywords"
              value={home.seo.keywords.join(", ")}
              onChange={(event) =>
                updateSeoField(
                  "keywords",
                  event.target.value
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean),
                )
              }
            />

            <p className="-mt-2 text-[10px] text-white/30">
              Separate keywords with commas.
            </p>
          </div>
        </Card>
      </div>

      {/* ==================================================
          SAVE BUTTON
      ================================================== */}

      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving || Boolean(uploading)}>
          <Save size={15} />

          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
