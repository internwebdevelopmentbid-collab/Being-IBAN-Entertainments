import { LoaderCircle } from "lucide-react";

export function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-red-500">
            {eyebrow}
          </p>
        )}

        <h1 className="font-display text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/40">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "border-red-500 bg-red-500 text-white hover:bg-red-600",

    secondary:
      "border-white/15 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.06]",

    danger:
      "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white",

    ghost:
      "border-transparent bg-transparent text-white/50 hover:bg-white/[0.04] hover:text-white",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <section className={`border border-white/10 bg-[#0b0b0b] ${className}`}>
      {children}
    </section>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          {label}
        </span>
      )}

      <input
        {...props}
        className={`w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-red-500/60 ${
          props.className || ""
        }`}
      />
    </label>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          {label}
        </span>
      )}

      <textarea
        {...props}
        className={`min-h-[130px] w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/20 focus:border-red-500/60 ${
          props.className || ""
        }`}
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          {label}
        </span>
      )}

      <select
        {...props}
        className={`w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500/60 ${
          props.className || ""
        }`}
      >
        {children}
      </select>
    </label>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-red-500" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>

      {label && (
        <span className="text-xs font-medium text-white/60">{label}</span>
      )}
    </label>
  );
}

export function StatusBadge({ status }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] ${
        published
          ? "bg-green-500/10 text-green-400"
          : "bg-yellow-500/10 text-yellow-400"
      }`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="border border-dashed border-white/10 px-6 py-16 text-center">
      <p className="text-sm text-white/35">{children}</p>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <LoaderCircle className="animate-spin text-red-500" size={24} />
    </div>
  );
}
