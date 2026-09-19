import { useEffect, useState } from "react";
import { Save, UploadCloud } from "lucide-react";

import { Button, Card, Input, PageTitle } from "../components/AdminUI";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

      const response = await fetch(`${API_URL}/home`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load home data");
      }

      const serverHome = result.home || {};

      const serverHero = serverHome.hero || {};

      /*
       * IMPORTANT:
       *
       * accent is explicitly included here.
       *
       * If the database does not have accent,
       * the default "Storytelling." is used.
       */

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

      setError(err.message || "Failed to load home data");
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

    if (!file) return;

    try {
      setUploading(type);
      setMessage("");
      setError("");

      /* ----------------------------------------------
         STEP 1
         Upload file
      ---------------------------------------------- */

      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error || uploadResult.message || "File upload failed",
        );
      }

      const uploadedFile = uploadResult.file;

      /* ----------------------------------------------
         HERO VIDEO
      ---------------------------------------------- */

      if (type === "heroVideo") {
        const response = await fetch(`${API_URL}/home/hero/video`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: uploadedFile.url,

            publicId: uploadedFile.publicId,

            playbackUrl: uploadedFile.playbackUrl || "",
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to save hero video");
        }

        setHome((current) => ({
          ...current,

          hero: {
            ...current.hero,

            video: {
              url: uploadedFile.url,

              publicId: uploadedFile.publicId,

              playbackUrl: uploadedFile.playbackUrl || "",
            },
          },
        }));
      }

      /* ----------------------------------------------
         HERO POSTER
      ---------------------------------------------- */

      if (type === "heroPoster") {
        const response = await fetch(`${API_URL}/home/hero/poster`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: uploadedFile.url,

            publicId: uploadedFile.publicId,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to save hero poster");
        }

        setHome((current) => ({
          ...current,

          hero: {
            ...current.hero,

            poster: {
              url: uploadedFile.url,

              publicId: uploadedFile.publicId,
            },
          },
        }));
      }

      /* ----------------------------------------------
         ABOUT IMAGE
      ---------------------------------------------- */

      if (type === "aboutImage") {
        const response = await fetch(`${API_URL}/home/about`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            image: {
              url: uploadedFile.url,

              publicId: uploadedFile.publicId,
            },
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to save About image");
        }

        setHome((current) => ({
          ...current,

          about: {
            ...current.about,

            image: {
              url: uploadedFile.url,

              publicId: uploadedFile.publicId,
            },
          },
        }));
      }

      setMessage("Asset uploaded and saved successfully.");
    } catch (err) {
      console.error("Upload error:", err);

      setError(err.message || "Upload failed");
    } finally {
      setUploading("");

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

      const response = await fetch(`${API_URL}/home`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          /* ------------------------------------------
                 HERO
              ------------------------------------------ */

          hero: {
            title: home.hero.title,

            subtitle: home.hero.subtitle,

            /*
             * IMPORTANT
             *
             * This was missing before.
             */

            accent: home.hero.accent,

            description: home.hero.description,
          },

          /* ------------------------------------------
                 ABOUT
              ------------------------------------------ */

          about: {
            title: home.about.title,

            description: home.about.description,
          },

          /* ------------------------------------------
                 SOCIALS
              ------------------------------------------ */

          socials: home.socials,

          /* ------------------------------------------
                 SEO
              ------------------------------------------ */

          seo: home.seo,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save Home settings");
      }

      /*
       * Merge server response safely.
       */

      const savedHome = result.home || {};

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
        },
      }));

      setMessage("Home settings saved successfully.");
    } catch (err) {
      console.error("Save home error:", err);

      setError(err.message || "Failed to save Home settings");
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
