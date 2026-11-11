/**
 * Emoji de matière. Windows n'affiche pas les emojis de drapeaux (il écrit « GB », « ES ») :
 * les drapeaux des langues sont donc dessinés ici en SVG, à la taille du texte.
 */
const DRAPEAUX: Record<string, React.ReactNode> = {
  // Royaume-Uni (LVA : anglais)
  "🇬🇧": (
    <svg viewBox="0 0 60 36" aria-hidden className="inline-block h-[0.78em] w-[1.3em] rounded-[0.12em] align-[-0.06em]">
      <clipPath id="luno-gb">
        <rect width="60" height="36" rx="3" />
      </clipPath>
      <g clipPath="url(#luno-gb)">
        <rect width="60" height="36" fill="#012169" />
        <path d="M0,0 60,36 M60,0 0,36" stroke="#fff" strokeWidth="7.2" />
        <path d="M0,0 60,36 M60,0 0,36" stroke="#C8102E" strokeWidth="2.4" />
        <path d="M30,0 V36 M0,18 H60" stroke="#fff" strokeWidth="12" />
        <path d="M30,0 V36 M0,18 H60" stroke="#C8102E" strokeWidth="7.2" />
      </g>
    </svg>
  ),
  // Espagne (LVB : espagnol)
  "🇪🇸": (
    <svg viewBox="0 0 60 40" aria-hidden className="inline-block h-[0.82em] w-[1.23em] rounded-[0.12em] align-[-0.08em]">
      <clipPath id="luno-es">
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath="url(#luno-es)">
        <rect width="60" height="40" fill="#AA151B" />
        <rect y="10" width="60" height="20" fill="#F1BF00" />
      </g>
    </svg>
  ),
};

export function Emoji({ e, className = "" }: { e?: string; className?: string }) {
  if (!e) return null;
  const d = DRAPEAUX[e];
  return d ? (
    <span className={className} role="img" aria-label={e === "🇬🇧" ? "Anglais" : "Espagnol"}>
      {d}
    </span>
  ) : (
    <span className={className}>{e}</span>
  );
}
