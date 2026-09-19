export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}) {
  return (
    <div>
      <p
        className={`mb-5 text-xs font-bold uppercase tracking-[0.3em] ${
          light ? "text-studio-red" : "text-studio-red"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`font-display text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl ${
          light ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-7 max-w-xl text-lg leading-relaxed ${
            light ? "text-white/50" : "text-black/50"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
