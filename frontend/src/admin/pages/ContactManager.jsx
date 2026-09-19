import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  CalendarDays,
  X,
  Trash2,
  Plus,
  Tag,
  MessageSquare,
  RefreshCw,
  ChevronDown,
  Check,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/contact";

const STATUS_OPTIONS = [
  "New",
  "Not Contacted",
  "Contacted",
  "In Progress",
  "Follow Up",
  "Converted",
  "Not Interested",
];

const DEFAULT_TAGS = [
  "High Priority",
  "Film",
  "Music Video",
  "Commercial",
  "Corporate",
  "Returning Client",
];

/* -------------------------------------------------- */
/* STATUS CONFIG */
/* -------------------------------------------------- */

const STATUS_CONFIG = {
  New: {
    dot: "bg-sky-400",
    badge: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    option: "hover:bg-sky-400/10",
  },

  "Not Contacted": {
    dot: "bg-amber-400",
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    option: "hover:bg-amber-400/10",
  },

  Contacted: {
    dot: "bg-emerald-400",
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    option: "hover:bg-emerald-400/10",
  },

  "In Progress": {
    dot: "bg-blue-400",
    badge: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    option: "hover:bg-blue-400/10",
  },

  "Follow Up": {
    dot: "bg-violet-400",
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    option: "hover:bg-violet-400/10",
  },

  Converted: {
    dot: "bg-green-400",
    badge: "border-green-400/20 bg-green-400/10 text-green-300",
    option: "hover:bg-green-400/10",
  },

  "Not Interested": {
    dot: "bg-red-400",
    badge: "border-red-400/20 bg-red-400/10 text-red-300",
    option: "hover:bg-red-400/10",
  },
};

/* -------------------------------------------------- */
/* TAG CONFIG */
/* -------------------------------------------------- */

const TAG_CONFIG = {
  "High Priority": "border-red-500/25 bg-red-500/10 text-red-300",

  Film: "border-violet-500/25 bg-violet-500/10 text-violet-300",

  "Music Video": "border-pink-500/25 bg-pink-500/10 text-pink-300",

  Commercial: "border-blue-500/25 bg-blue-500/10 text-blue-300",

  Corporate: "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",

  "Returning Client":
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
};

function getTagClass(tag) {
  return TAG_CONFIG[tag] || "border-white/10 bg-white/[0.04] text-white/55";
}

/* -------------------------------------------------- */
/* MAIN */
/* -------------------------------------------------- */

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedContact, setSelectedContact] = useState(null);

  const [customTag, setCustomTag] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---------------------------------------------- */
  /* FETCH CONTACTS */
  /* ---------------------------------------------- */

  const fetchContacts = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch contacts.");
      }

      setContacts(result.data || []);
    } catch (error) {
      console.error("Fetch contacts error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  /* ---------------------------------------------- */
  /* SEARCH + FILTER */
  /* ---------------------------------------------- */

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch =
        !query ||
        contact.name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.message?.toLowerCase().includes(query) ||
        contact.tags?.some((tag) => tag.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, statusFilter]);

  /* ---------------------------------------------- */
  /* UPDATE CONTACT */
  /* ---------------------------------------------- */

  const updateContact = async (id, updates) => {
    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update contact.");
      }

      setContacts((previous) =>
        previous.map((contact) => (contact._id === id ? result.data : contact)),
      );

      setSelectedContact(result.data);
    } catch (error) {
      console.error("Update contact error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------- */
  /* STATUS */
  /* ---------------------------------------------- */

  const handleStatusChange = async (status) => {
    if (!selectedContact) return;

    await updateContact(selectedContact._id, {
      status,
    });
  };

  /* ---------------------------------------------- */
  /* ADD CUSTOM TAG */
  /* ---------------------------------------------- */

  const handleAddTag = async () => {
    if (!selectedContact) return;

    const tag = customTag.trim();

    if (!tag) return;

    if (selectedContact.tags?.includes(tag)) {
      setCustomTag("");
      return;
    }

    const tags = [...(selectedContact.tags || []), tag];

    await updateContact(selectedContact._id, {
      tags,
    });

    setCustomTag("");
  };

  /* ---------------------------------------------- */
  /* REMOVE TAG */
  /* ---------------------------------------------- */

  const handleRemoveTag = async (tagToRemove) => {
    if (!selectedContact) return;

    const tags = (selectedContact.tags || []).filter(
      (tag) => tag !== tagToRemove,
    );

    await updateContact(selectedContact._id, {
      tags,
    });
  };

  /* ---------------------------------------------- */
  /* QUICK TAG */
  /* ---------------------------------------------- */

  const handleQuickTag = async (tag) => {
    if (!selectedContact) return;

    if (selectedContact.tags?.includes(tag)) {
      return;
    }

    const tags = [...(selectedContact.tags || []), tag];

    await updateContact(selectedContact._id, {
      tags,
    });
  };

  /* ---------------------------------------------- */
  /* DELETE */
  /* ---------------------------------------------- */

  const handleDelete = async () => {
    if (!selectedContact) return;

    const confirmed = window.confirm(
      "Delete this contact inquiry permanently?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/${selectedContact._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete contact.");
      }

      setContacts((previous) =>
        previous.filter((contact) => contact._id !== selectedContact._id),
      );

      setSelectedContact(null);
    } catch (error) {
      console.error("Delete contact error:", error);
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------------------------------------- */
  /* DATE */
  /* ---------------------------------------------- */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ---------------------------------------------- */
  /* RENDER */
  /* ---------------------------------------------- */

  return (
    <div className="min-h-full bg-[#080808] text-white">
      {/* HEADER */}

      <div className="border-b border-white/10 px-6 py-7 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.28em] text-red-500">
              Communication
            </p>

            <h1 className="font-display text-3xl font-black tracking-[-0.04em]">
              Contacts
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage website inquiries and follow-ups.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchContacts(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 border border-white/10 px-4 py-3 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Inquiries" value={contacts.length} />

        <Stat
          label="Not Contacted"
          value={
            contacts.filter(
              (contact) =>
                contact.status === "Not Contacted" || contact.status === "New",
            ).length
          }
        />

        <Stat
          label="In Progress"
          value={
            contacts.filter((contact) => contact.status === "In Progress")
              .length
          }
        />

        <Stat
          label="Converted"
          value={
            contacts.filter((contact) => contact.status === "Converted").length
          }
        />
      </div>

      {/* FILTERS */}

      <div className="border-b border-white/10 px-6 py-5 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts..."
              className="w-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-red-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white/60 outline-none focus:border-red-500/50"
          >
            <option value="All">All Statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTACT LIST */}

      <div className="p-6 lg:p-10">
        {loading ? (
          <LoadingState />
        ) : filteredContacts.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="overflow-hidden border border-white/10">
            {/* DESKTOP */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-left">
                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Status
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Tags
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Received
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.map((contact) => (
                    <ContactRow
                      key={contact._id}
                      contact={contact}
                      onClick={() => setSelectedContact(contact)}
                      formatDate={formatDate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}

            <div className="divide-y divide-white/10 lg:hidden">
              {filteredContacts.map((contact) => (
                <button
                  type="button"
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className="block w-full p-5 text-left transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {contact.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-white/35">
                        {contact.email}
                      </p>
                    </div>

                    <StatusBadge status={contact.status} />
                  </div>

                  <p className="mt-4 line-clamp-2 text-xs leading-5 text-white/45">
                    {contact.message}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] text-white/25">
                      {formatDate(contact.createdAt)}
                    </p>

                    <div className="flex flex-wrap justify-end gap-1.5">
                      {contact.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className={`border px-2 py-1 text-[8px] font-semibold ${getTagClass(
                            tag,
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}

      {selectedContact && (
        <div className="fixed inset-0 z-[60000]">
          <button
            type="button"
            aria-label="Close contact"
            onClick={() => setSelectedContact(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-white/10 bg-[#0b0b0b] shadow-2xl">
            {/* DRAWER HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Contact Inquiry
                </p>

                <h2 className="mt-1 font-display text-xl font-bold">
                  {selectedContact.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* DRAWER CONTENT */}

            <div className="flex-1 overflow-y-auto p-6">
              {/* CONTACT INFO */}

              <div className="space-y-4 border-b border-white/10 pb-7">
                <InfoRow
                  icon={<Mail size={15} />}
                  label="Email"
                  value={selectedContact.email}
                  href={`mailto:${selectedContact.email}`}
                />

                <InfoRow
                  icon={<Phone size={15} />}
                  label="Phone"
                  value={selectedContact.phone}
                  href={`tel:${selectedContact.phone}`}
                />

                <InfoRow
                  icon={<CalendarDays size={15} />}
                  label="Received"
                  value={formatDate(selectedContact.createdAt)}
                />
              </div>

              {/* MESSAGE */}

              <div className="border-b border-white/10 py-7">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare size={15} className="text-red-500" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Project Details
                  </p>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
                  {selectedContact.message}
                </p>
              </div>

              {/* STATUS */}

              <div className="border-b border-white/10 py-7">
                <label className="mb-3 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Status
                </label>

                <StatusSelector
                  value={selectedContact.status || "Not Contacted"}
                  onChange={handleStatusChange}
                  disabled={saving}
                />

                {saving && (
                  <p className="mt-2 text-[10px] text-white/25">
                    Saving status...
                  </p>
                )}
              </div>

              {/* TAGS */}

              <div className="py-7">
                <div className="mb-4 flex items-center gap-2">
                  <Tag size={15} className="text-red-500" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Tags
                  </p>
                </div>

                {/* CURRENT TAGS */}

                <div className="flex flex-wrap gap-2">
                  {selectedContact.tags?.length > 0 ? (
                    selectedContact.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`group flex items-center gap-2 border px-3 py-2 text-[10px] font-semibold transition ${getTagClass(
                          tag,
                        )}`}
                      >
                        {tag}

                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={saving}
                          aria-label={`Remove ${tag}`}
                          className="text-current opacity-40 transition hover:opacity-100"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <div className="w-full border border-dashed border-white/10 px-4 py-4 text-center">
                      <Tag size={16} className="mx-auto text-white/15" />

                      <p className="mt-2 text-[10px] text-white/25">
                        No tags added yet
                      </p>
                    </div>
                  )}
                </div>

                {/* ADD TAG */}

                <div className="mt-5">
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Tag
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                      />

                      <input
                        type="text"
                        value={customTag}
                        onChange={(event) => setCustomTag(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Create a custom tag..."
                        className="h-11 w-full border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-red-500/50 focus:bg-white/[0.05]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!customTag.trim() || saving}
                      className="flex h-11 w-11 shrink-0 items-center justify-center bg-red-500 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                </div>

                {/* QUICK TAGS */}

                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                      Quick Tags
                    </p>

                    <p className="text-[9px] text-white/20">Click to add</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_TAGS.map((tag) => {
                      const active = selectedContact.tags?.includes(tag);

                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleQuickTag(tag)}
                          disabled={saving || active}
                          className={`group flex items-center gap-2 border px-3 py-2 text-[9px] font-semibold transition ${
                            active
                              ? `${getTagClass(tag)} cursor-default opacity-50`
                              : `${getTagClass(tag)} hover:brightness-125`
                          }`}
                        >
                          {active ? <Check size={11} /> : <Plus size={11} />}

                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="shrink-0 border-t border-white/10 p-5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex w-full items-center justify-center gap-2 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 size={15} />

                {deleting ? "Deleting..." : "Delete Inquiry"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* STAT */
/* -------------------------------------------------- */

function Stat({ label, value }) {
  return (
    <div className="border-r border-white/10 px-6 py-6 lg:px-10">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl font-black">{value}</p>
    </div>
  );
}

/* -------------------------------------------------- */
/* CONTACT ROW */
/* -------------------------------------------------- */

function ContactRow({ contact, onClick, formatDate }) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-white/10 transition hover:bg-white/[0.025]"
    >
      <td className="px-5 py-5">
        <div>
          <p className="text-sm font-bold">{contact.name}</p>

          <p className="mt-1 text-xs text-white/35">{contact.email}</p>
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="text-xs text-white/50">{contact.phone}</p>
      </td>

      <td className="px-5 py-5">
        <StatusBadge status={contact.status} />
      </td>

      <td className="max-w-[240px] px-5 py-5">
        <div className="flex flex-wrap gap-1.5">
          {contact.tags?.length > 0 ? (
            contact.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`border px-2 py-1 text-[9px] font-semibold ${getTagClass(
                  tag,
                )}`}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-white/20">—</span>
          )}

          {contact.tags?.length > 3 && (
            <span className="px-1 py-1 text-[9px] text-white/25">
              +{contact.tags.length - 3}
            </span>
          )}
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="whitespace-nowrap text-[10px] text-white/30">
          {formatDate(contact.createdAt)}
        </p>
      </td>
    </tr>
  );
}

/* -------------------------------------------------- */
/* STATUS BADGE */
/* -------------------------------------------------- */

function StatusBadge({ status }) {
  const currentStatus = status || "Not Contacted";

  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG["Not Contacted"];

  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />

      {currentStatus}
    </span>
  );
}

/* -------------------------------------------------- */
/* CUSTOM STATUS SELECTOR */
/* -------------------------------------------------- */

function StatusSelector({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const selectorRef = useRef(null);

  const currentValue = value || "Not Contacted";

  const currentConfig =
    STATUS_CONFIG[currentValue] || STATUS_CONFIG["Not Contacted"];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={selectorRef} className="relative">
      {/* SELECT BUTTON */}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((previous) => !previous)}
        className={`flex h-12 w-full items-center justify-between border bg-white/[0.03] px-4 text-left transition ${
          open
            ? "border-red-500/50 bg-white/[0.05]"
            : "border-white/10 hover:border-white/20"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${currentConfig.dot}`} />

          <span
            className={`text-xs font-semibold ${
              currentConfig.badge
                .split(" ")
                .find((item) => item.startsWith("text-")) || "text-white/70"
            }`}
          >
            {currentValue}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`text-white/30 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden border border-white/10 bg-[#121212] p-1.5 shadow-2xl shadow-black/50">
          <div className="mb-1 border-b border-white/10 px-3 py-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/25">
              Select Status
            </p>
          </div>

          <div className="max-h-[280px] overflow-y-auto">
            {STATUS_OPTIONS.map((status) => {
              const config = STATUS_CONFIG[status];

              const active = status === currentValue;

              return (
                <button
                  type="button"
                  key={status}
                  onClick={() => {
                    setOpen(false);
                    onChange(status);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-3 text-left transition ${
                    active ? "bg-white/[0.07]" : config.option
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${config.dot}`} />

                    <span
                      className={`text-xs font-medium ${
                        active ? "text-white" : "text-white/55"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {active && <Check size={14} className="text-white/60" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* INFO ROW */
/* -------------------------------------------------- */

function InfoRow({ icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-red-500">{icon}</div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
          {label}
        </p>

        <p className="mt-1 break-words text-xs text-white/60">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition hover:opacity-80"
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </a>
    );
  }

  return content;
}

/* -------------------------------------------------- */
/* LOADING STATE */
/* -------------------------------------------------- */

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center border border-white/10">
      <div className="text-center">
        <RefreshCw size={20} className="mx-auto animate-spin text-red-500" />

        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
          Loading contacts
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* EMPTY STATE */
/* -------------------------------------------------- */

function EmptyState({ search }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center border border-white/10">
      <div className="px-6 text-center">
        <MessageSquare size={22} className="mx-auto text-white/15" />

        <h3 className="mt-4 text-sm font-bold text-white/60">
          {search ? "No contacts found" : "No contact inquiries yet"}
        </h3>

        <p className="mt-2 text-xs text-white/25">
          {search
            ? "Try adjusting your search or status filter."
            : "New website inquiries will appear here."}
        </p>
      </div>
    </div>
  );
}
