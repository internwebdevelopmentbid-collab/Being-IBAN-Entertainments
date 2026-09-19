import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";

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

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function MembersManager() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch members
  |--------------------------------------------------------------------------
  */

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/members`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch members");
      }

      setMembers(result.members || []);
    } catch (error) {
      console.error("Fetch members error:", error);
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Blank member
  |--------------------------------------------------------------------------
  */

  const blankMember = () => ({
    _id: null,

    name: "",

    designation: "",

    bio: "",

    image: {
      url: "",
      publicId: "",
    },

    active: true,

    order: members.length + 1,
  });

  /*
  |--------------------------------------------------------------------------
  | Open create modal
  |--------------------------------------------------------------------------
  */

  const openCreate = () => {
    setEditing(blankMember());
  };

  /*
  |--------------------------------------------------------------------------
  | Open edit modal
  |--------------------------------------------------------------------------
  */

  const openEdit = (member) => {
    setEditing({
      ...member,

      image: {
        url: member.image?.url || "",
        publicId: member.image?.publicId || "",
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Upload image
  |--------------------------------------------------------------------------
  */

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      formData.append("folder", "members");

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Image upload failed");
      }

      if (!result.file?.url) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setEditing((current) => ({
        ...current,

        image: {
          url: result.file.url,
          publicId: result.file.publicId || "",
        },
      }));
    } catch (error) {
      console.error("Image upload error:", error);

      window.alert(error.message);
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save member
  |--------------------------------------------------------------------------
  */

  const save = async () => {
    if (!editing) {
      return;
    }

    if (!editing.name.trim()) {
      window.alert("Member name is required.");

      return;
    }

    if (!editing.image?.url) {
      window.alert("Member image is required.");

      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editing._id);

      const url = isEditing
        ? `${API_BASE_URL}/api/members/${editing._id}`
        : `${API_BASE_URL}/api/members`;

      const method = isEditing ? "PUT" : "POST";

      const body = {
        name: editing.name.trim(),

        designation: editing.designation?.trim() || "",

        bio: editing.bio || "",

        image: {
          url: editing.image.url,

          publicId: editing.image.publicId || "",
        },

        active: Boolean(editing.active),

        order: Number(editing.order) || 0,
      };

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save member");
      }

      if (isEditing) {
        setMembers((current) =>
          current.map((member) =>
            member._id === result.member._id ? result.member : member,
          ),
        );
      } else {
        setMembers((current) => [...current, result.member]);
      }

      setEditing(null);
    } catch (error) {
      console.error("Save member error:", error);

      window.alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete member
  |--------------------------------------------------------------------------
  */

  const remove = async (id) => {
    if (!window.confirm("Delete this member?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete member");
      }

      setMembers((current) => current.filter((member) => member._id !== id));
    } catch (error) {
      console.error("Delete member error:", error);

      window.alert(error.message);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div>
        <PageTitle
          eyebrow="Website / Members"
          title="Members"
          description="Manage team members, roles, biographies and profile photographs."
        />

        <Card>
          <div className="px-5 py-10 text-center text-sm text-white/40">
            Loading members...
          </div>
        </Card>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <PageTitle
        eyebrow="Website / Members"
        title="Members"
        description="Manage team members, roles, biographies and profile photographs."
        action={
          <Button onClick={openCreate}>
            <Plus size={15} />
            Add Member
          </Button>
        }
      />

      {members.length === 0 ? (
        <EmptyState>No members have been added yet.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-white/10">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Profile image */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-black">
                    {member.image?.url ? (
                      <img
                        src={member.image.url}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Member information */}
                  <div>
                    <h3 className="font-bold">
                      {member.name || "Unnamed Member"}
                    </h3>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-red-500">
                      {member.designation}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={member.active ? "Published" : "Draft"} />

                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:text-white"
                    title="Edit member"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(member._id)}
                    className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:border-red-500/40 hover:text-red-500"
                    title="Delete member"
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
          CREATE / EDIT MODAL
      ================================================== */}

      {editing && (
        <div className="fixed inset-0 z-[60000] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto max-w-2xl border border-white/10 bg-[#0b0b0b]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                  Team
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {editing.name || "New Member"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving || uploading}
              >
                <X
                  size={20}
                  className="text-white/40 transition hover:text-white"
                />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-5">
              {/* Name */}
              <Input
                label="Name"
                value={editing.name}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    name: event.target.value,
                  })
                }
              />

              {/* Designation */}
              <Input
                label="Designation"
                value={editing.designation}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    designation: event.target.value,
                  })
                }
              />

              {/* Bio */}
              <Textarea
                label="Bio"
                value={editing.bio}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    bio: event.target.value,
                  })
                }
              />

              {/* Profile photo */}
              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Profile Photo
                </span>

                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Preview */}
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-white/10 bg-black">
                    {editing.image?.url ? (
                      <img
                        src={editing.image.url}
                        alt={editing.name || "Member"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center text-[9px] uppercase tracking-wider text-white/20">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <label
                    className={`flex cursor-pointer items-center gap-2 self-start border border-white/15 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition hover:border-red-500 ${
                      uploading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <UploadCloud size={15} />

                    {uploading ? "Uploading..." : "Upload Photo"}

                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                      className="hidden"
                      disabled={uploading}
                      onChange={uploadImage}
                    />
                  </label>
                </div>

                <p className="mt-2 text-[9px] text-white/25">
                  JPG, PNG, WEBP or AVIF.
                </p>
              </div>

              {/* Order + Active */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Display Order"
                  type="number"
                  value={editing.order}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      order: Number(event.target.value),
                    })
                  }
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
                >
                  <option value="Published">Published</option>

                  <option value="Draft">Draft</option>
                </Select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/10 p-5">
              <Button
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={saving || uploading}
              >
                Cancel
              </Button>

              <Button onClick={save} disabled={saving || uploading}>
                {saving ? "Saving..." : "Save Member"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
