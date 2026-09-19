import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Button({ children, to, variant = "red" }) {
  const classes = `
    inline-flex items-center gap-3
    px-6 py-4
    text-sm font-bold uppercase tracking-wider
    transition duration-300
    ${
      variant === "red"
        ? "bg-studio-red text-white hover:bg-white hover:text-black"
        : "border border-white/30 text-white hover:border-white"
    }
  `;

  return (
    <Link to={to} className={classes}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
