import { Bell, Menu } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#050505]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/60 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={20} strokeWidth={1.7} />
        </button>

        <div className="lg:hidden">
          <p className="text-xs font-black tracking-tight">BEING IBAN</p>

          <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-red-500">
            Admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-black">
            A
          </div>

          <div>
            <p className="text-xs font-bold">Administrator</p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
              Studio Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
