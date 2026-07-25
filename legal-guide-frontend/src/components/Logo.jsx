// Wordmark текст л Tailwind-ийн dark: class-аар theme-ийн дагуу өнгөө сольдог.

const sizes = {
  sm: { box: 28, text: "text-lg" },
  md: { box: 34, text: "text-xl" },
};

const Logo = ({ size = "md" }) => {
  const { box, text } = sizes[size] || sizes.md;

  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        width={box}
        height={box}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        {/* indigo дугуй булантай хайрцаг */}
        <rect width="40" height="40" rx="11" fill="#4F46E5" />
        {/* цагаан сүм/багана icon (хуулийн салбарын бэлгэдэл) */}
        <g fill="#ffffff">
          {/* дээд гурвалжин дээвэр (pediment) */}
          <path d="M20 9 L31 16 L9 16 Z" />
          {/* 3 багана */}
          <rect x="12.5" y="17.5" width="2.6" height="9" rx="0.4" />
          <rect x="18.7" y="17.5" width="2.6" height="9" rx="0.4" />
          <rect x="24.9" y="17.5" width="2.6" height="9" rx="0.4" />
          {/* суурь */}
          <rect x="9.5" y="28" width="21" height="2.8" rx="1.2" />
        </g>
      </svg>
      <span
        className={`font-sans ${text} font-bold tracking-tight text-slate-900 dark:text-white`}
      >
        Legal
        <span className="text-indigo-600 dark:text-indigo-400">Guide</span>
      </span>
    </span>
  );
};

export default Logo;
