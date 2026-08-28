const NotesIllustration = () => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-sm">
    {/* Floating decorative circles */}
    <circle cx="60" cy="70" r="14" fill="#FDE68A" opacity="0.9" />
    <circle cx="330" cy="60" r="10" fill="#FCA5A5" opacity="0.9" />
    <circle cx="340" cy="300" r="16" fill="#93C5FD" opacity="0.8" />
    <circle cx="50" cy="330" r="10" fill="#C4B5FD" opacity="0.9" />

    {/* Back notebook (tilted) */}
    <g transform="rotate(-8 200 210)">
      <rect x="110" y="90" width="180" height="240" rx="14" fill="#E9D5FF" />
    </g>

    {/* Front notebook */}
    <rect x="130" y="110" width="180" height="240" rx="14" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="2" />
    {/* spiral binding */}
    <rect x="130" y="110" width="18" height="240" rx="9" fill="#A78BFA" />
    {Array.from({ length: 8 }).map((_, i) => (
      <circle key={i} cx="139" cy={130 + i * 30} r="4" fill="#FFFFFF" />
    ))}

    {/* Lines of "text" on the page */}
    <rect x="170" y="150" width="110" height="8" rx="4" fill="#C4B5FD" />
    <rect x="170" y="172" width="90" height="8" rx="4" fill="#DDD6FE" />
    <rect x="170" y="194" width="100" height="8" rx="4" fill="#DDD6FE" />

    {/* Highlighted checklist */}
    <rect x="170" y="222" width="14" height="14" rx="4" fill="#34D399" />
    <path d="M173 229 l3 3 l6 -7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="192" y="224" width="80" height="8" rx="4" fill="#E5E7EB" />

    <rect x="170" y="248" width="14" height="14" rx="4" fill="#FBBF24" />
    <rect x="192" y="250" width="70" height="8" rx="4" fill="#E5E7EB" />

    <rect x="170" y="274" width="14" height="14" rx="4" fill="#F472B6" />
    <rect x="192" y="276" width="85" height="8" rx="4" fill="#E5E7EB" />

    {/* Pen */}
    <g transform="rotate(35 260 300)">
      <rect x="250" y="230" width="14" height="120" rx="7" fill="#6366F1" />
      <polygon points="250,230 264,230 257,210" fill="#4338CA" />
    </g>
  </svg>
);

export default NotesIllustration;