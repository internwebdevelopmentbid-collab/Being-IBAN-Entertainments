import { projects as initialProjects } from "../../data/projects";

const STORAGE_KEY = "being-iban-admin-content";

function createSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const defaultData = {
  home: {
    heroVideo: "/videos/showreel.mp4",
    heroPoster: "/images/hero.jpg",
  },

  clients: [],

  members: [],

  services: [],

  projects: initialProjects.map((project, index) => ({
    ...project,

    category: project.category || project.type || "Film",

    type: project.type || "",

    year: project.year || "",

    shortDescription: project.shortDescription || "",

    slug: project.slug || createSlug(project.title),

    gallery: project.gallery || [],

    tags: project.tags || [],

    featured: project.featured ?? index < 4,

    displayOrder: project.displayOrder || index + 1,

    status: project.status || "Published",
  })),

  jobs: [],

  posts: [],

  settings: {
    studioName: "Being IBAN Entertainments",

    email: "contact@beingibanentertainments.com",

    phone: "+91 629 376 4908",

    address:
      "5th Floor, Newton Square, Unit B, Chinar Park, Atghara, Rajarhat, Kolkata, West Bengal 700136",

    instagram: "https://www.instagram.com/beingibanentertainments/",

    facebook: "https://www.facebook.com/beingibanentertainments/",

    linkedin: "https://www.linkedin.com/company/being-iban-entertainments/",

    youtube: "",
  },
};

export function getAdminData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));

      return defaultData;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultData,
      ...parsed,
    };
  } catch {
    return defaultData;
  }
}

export function saveAdminData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  window.dispatchEvent(new Event("admin-data-updated"));

  return data;
}

export function updateAdminSection(section, value) {
  const data = getAdminData();

  data[section] = value;

  return saveAdminData(data);
}

export function resetAdminData() {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(new Event("admin-data-updated"));
}

export { defaultData };
