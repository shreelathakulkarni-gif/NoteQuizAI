import React from 'react';

interface NoteQuizLogoProps {
  variant?: 'icon' | 'badge' | 'full' | 'hero' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showTagline?: boolean;
  animate?: boolean;
}

/**
 * NoteQuiz AI Mascot and Logo Vector Component
 * Faithfully re-creates the graduation robot scholar mascot with study elements,
 * glowing brain AI tablet, graduation cap, pencils, books, and styled branding.
 */
export const NoteQuizLogo: React.FC<NoteQuizLogoProps> = ({
  variant = 'badge',
  size = 'md',
  className = '',
  showTagline = true,
  animate = true,
}) => {
  // Size mapping for icon/symbol
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    hero: 'w-24 h-24',
  }[size];

  // SVG Mascot Robot Head with Graduation Cap and Glowing Eyes
  const MascotAvatar = ({ className: c = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 200 200"
      className={`${c} select-none drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="gradCap" x1="50" y1="20" x2="150" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="gradVisor" x1="40" y1="80" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b132b" />
          <stop offset="100%" stopColor="#1c2541" />
        </linearGradient>
        <linearGradient id="gradTassel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="gradEars" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="gradHeadBody" x1="50" y1="60" x2="150" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="gradTablet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="gradPencil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Cyan Headphones / Ears */}
      <rect x="22" y="85" width="22" height="42" rx="10" fill="url(#gradEars)" stroke="#1d4ed8" strokeWidth="2.5" />
      <rect x="26" y="90" width="14" height="32" rx="7" fill="#60a5fa" />
      <rect x="156" y="85" width="22" height="42" rx="10" fill="url(#gradEars)" stroke="#1d4ed8" strokeWidth="2.5" />
      <rect x="160" y="90" width="14" height="32" rx="7" fill="#60a5fa" />

      {/* Robot White Outer Head Container */}
      <rect
        x="36"
        y="60"
        width="128"
        height="96"
        rx="40"
        fill="url(#gradHeadBody)"
        stroke="#cbd5e1"
        strokeWidth="3.5"
      />

      {/* Dark Visor Face Display */}
      <rect
        x="48"
        y="74"
        width="104"
        height="70"
        rx="26"
        fill="url(#gradVisor)"
        stroke="#1e293b"
        strokeWidth="2.5"
      />

      {/* Glowing Cyan Eyes (Happy Curved Arcs ^ ^) */}
      <path
        d="M 64 102 C 64 91, 80 91, 80 102"
        stroke="#38bdf8"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        filter="url(#softGlow)"
      />
      <path
        d="M 120 102 C 120 91, 136 91, 136 102"
        stroke="#38bdf8"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        filter="url(#softGlow)"
      />

      {/* Cheerful Robot Smiling Mouth */}
      <path
        d="M 92 118 C 96 126, 104 126, 108 118"
        stroke="#38bdf8"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#softGlow)"
      />

      {/* Cute Pink Cheeks (Blush Dots) */}
      <circle cx="58" cy="120" r="4.5" fill="#f43f5e" opacity="0.85" />
      <circle cx="142" cy="120" r="4.5" fill="#f43f5e" opacity="0.85" />

      {/* Navy Graduation Cap Skull Base */}
      <path
        d="M 68 56 C 68 44, 132 44, 132 56 Z"
        fill="url(#gradCap)"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* Graduation Cap Diamond Mortarboard */}
      <polygon
        points="100,12 178,38 100,64 22,38"
        fill="url(#gradCap)"
        stroke="#334155"
        strokeWidth="2.5"
      />
      <polygon
        points="100,16 172,38 100,60 28,38"
        fill="#1e293b"
        opacity="0.4"
      />

      {/* Graduation Cap Button Center */}
      <circle cx="100" cy="38" r="4.5" fill="url(#gradTassel)" />

      {/* Golden Yellow Tassel Draping Down Left */}
      <path
        d="M 100 38 Q 65 36 60 55 Q 58 75 62 88"
        stroke="url(#gradTassel)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tassel Fringe Cluster */}
      <ellipse cx="63" cy="94" rx="4.5" ry="8" fill="url(#gradTassel)" />
      <circle cx="63" cy="87" r="3" fill="#b45309" />

      {/* Small Robot AI Chest Badge Peek */}
      <rect x="85" y="160" width="30" height="18" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="100" y="173" fill="#60a5fa" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">AI</text>

      {/* Yellow Study Pencil (Right Side) */}
      <g transform="translate(142, 126) rotate(-28)">
        <polygon points="12,0 12,32 0,32 0,0" fill="url(#gradPencil)" stroke="#b45309" strokeWidth="1" />
        <polygon points="0,0 6,-10 12,0" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
        <polygon points="4,-7 6,-10 8,-7" fill="#1e293b" />
        <rect x="0" y="26" width="12" height="6" fill="#f472b6" rx="1" />
      </g>
    </svg>
  );

  // Full Hero Illustration Scene (Robot + Desk + Books + Floating Study Cards + NoteQuiz AI Title)
  const HeroIllustration = () => (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none">
      <svg
        viewBox="0 0 600 580"
        className="w-full h-auto drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroBgHalo" x1="100" y1="50" x2="500" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f3e8ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="bookPink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a21caf" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="bookDarkBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="glowAiBadge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="heroGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Halo & Leaves Background */}
        <circle cx="300" cy="240" r="210" fill="url(#heroBgHalo)" />

        {/* Floating Plant Leaves in Background */}
        <path d="M 100 240 C 70 200, 80 150, 110 170 C 130 185, 120 225, 100 240 Z" fill="#4ade80" opacity="0.6" />
        <path d="M 470 250 C 510 210, 500 160, 470 180 C 450 195, 460 235, 470 250 Z" fill="#34d399" opacity="0.6" />

        {/* Left: PDF Document with Red Badge & Blue Swoop */}
        <g transform="translate(70, 90) rotate(-6)">
          <rect x="0" y="0" width="85" height="110" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <path d="M 15 35 L 70 35 M 15 50 L 60 50 M 15 65 L 65 65 M 15 80 L 50 80" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {/* Red PDF Tag */}
          <rect x="-8" y="10" width="46" height="24" rx="6" fill="#ef4444" />
          <text x="15" y="26" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PDF</text>
          {/* Blue Swoosh Arrow into Robot */}
          <path d="M 65 80 C 95 90, 115 60, 125 40" stroke="#3b82f6" strokeWidth="4" strokeDasharray="3 3" fill="none" />
          <polygon points="128,34 128,46 116,42" fill="#3b82f6" />
        </g>

        {/* Top Right: Lightbulb of Ideas */}
        <g transform="translate(400, 60)">
          <circle cx="20" cy="20" r="16" fill="#fef08a" filter="url(#heroGlow)" />
          <path d="M 12 20 C 12 14, 28 14, 28 20 C 28 24, 24 26, 24 30 L 16 30 C 16 26, 12 24, 12 20 Z" fill="#eab308" />
          <rect x="16" y="31" width="8" height="4" rx="1" fill="#71717a" />
          <path d="M 20 2 C 20 0, 20 0, 20 0 M 35 8 L 39 5 M 5 8 L 1 5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Top Center-Right: Paper Airplane */}
        <g transform="translate(390, 125) rotate(-15)">
          <polygon points="0,15 35,0 12,30" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="35,0 12,30 20,20" fill="#cbd5e1" />
          <polygon points="35,0 0,15 20,20" fill="#60a5fa" />
        </g>

        {/* Right Floating Cards: Notes, MCQs, Flashcards */}
        {/* 1. Notes Card */}
        <g transform="translate(440, 100)">
          <rect x="0" y="0" width="110" height="52" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="8" y="10" width="28" height="32" rx="6" fill="#0284c7" />
          <path d="M 14 18 L 30 18 M 14 24 L 30 24 M 14 30 L 24 30" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <text x="44" y="24" fill="#1e293b" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Notes</text>
          <rect x="44" y="32" width="40" height="4" rx="2" fill="#f59e0b" />
        </g>

        {/* 2. MCQs Card */}
        <g transform="translate(430, 165)">
          <rect x="0" y="0" width="125" height="64" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="22" cy="26" r="14" fill="#7c3aed" />
          <text x="22" y="31" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">?</text>
          <text x="44" y="24" fill="#1e293b" fontSize="13" fontWeight="bold" fontFamily="sans-serif">MCQs</text>
          <g transform="translate(44, 34)">
            <circle cx="6" cy="10" r="7" fill="#3b82f6" />
            <text x="6" y="13" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
            <circle cx="24" cy="10" r="7" fill="#60a5fa" />
            <text x="24" y="13" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">B</text>
            <circle cx="42" cy="10" r="7" fill="#93c5fd" />
            <text x="42" y="13" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">C</text>
            <circle cx="60" cy="10" r="7" fill="#bfdbfe" />
            <text x="60" y="13" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">D</text>
          </g>
        </g>

        {/* 3. Flashcards Card */}
        <g transform="translate(420, 240)">
          <rect x="0" y="0" width="135" height="60" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Stacked Cards Icon */}
          <rect x="10" y="12" width="30" height="24" rx="4" fill="#38bdf8" />
          <rect x="14" y="16" width="30" height="24" rx="4" fill="#f43f5e" />
          <rect x="18" y="20" width="30" height="24" rx="4" fill="#f59e0b" />
          <text x="56" y="26" fill="#1e293b" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Flashcards</text>
          <circle cx="70" cy="42" r="8" fill="#fef08a" />
          <path d="M 68 40 L 72 40 L 71 44 L 69 44 Z" fill="#ca8a04" />
        </g>

        {/* Left: Stack of Textbooks + Coffee Mug */}
        {/* Book 1 (Bottom Dark Blue) */}
        <g transform="translate(70, 310)">
          <rect x="0" y="30" width="140" height="26" rx="5" fill="url(#bookDarkBlue)" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="12" y="33" width="124" height="20" fill="#f8fafc" />
          <rect x="0" y="30" width="20" height="26" rx="3" fill="#1e3a8a" />

          {/* Book 2 (Middle Pink/Purple) */}
          <rect x="6" y="10" width="128" height="24" rx="5" fill="url(#bookPink)" stroke="#831843" strokeWidth="1.5" />
          <rect x="18" y="13" width="112" height="18" fill="#f8fafc" />
          <rect x="6" y="10" width="18" height="24" rx="3" fill="#9d174d" />
          {/* Gold Bookmark Ribbon */}
          <polygon points="40,24 48,24 48,46 44,40 40,46" fill="#eab308" />

          {/* Book 3 (Top Cyan/Blue) */}
          <rect x="12" y="-10" width="116" height="24" rx="5" fill="url(#bookBlue)" stroke="#1e40af" strokeWidth="1.5" />
          <rect x="24" y="-7" width="100" height="18" fill="#f8fafc" />
          <rect x="12" y="-10" width="18" height="24" rx="3" fill="#2563eb" />

          {/* Steaming Coffee Mug on Books */}
          <g transform="translate(32, -44)">
            <rect x="0" y="8" width="38" height="28" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 38 14 C 46 14, 46 26, 38 26" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
            {/* Heart symbol on mug */}
            <path d="M 19 23 C 14 18, 14 14, 19 18 C 24 14, 24 18, 19 23 Z" fill="#3b82f6" />
            {/* Coffee steam */}
            <path d="M 12 4 Q 14 -2 12 -6 M 20 4 Q 22 -2 20 -6 M 28 4 Q 30 -2 28 -6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* Study Desk Table Surface */}
        <path d="M 40 370 L 560 370" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
        <rect x="170" y="340" width="170" height="30" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Open Notebook page lines */}
        <path d="M 185 352 L 245 352 M 185 360 L 235 360 M 265 352 L 325 352 M 265 360 L 315 360" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

        {/* CENTER SCHOLAR ROBOT MASCOT (Head + Cap + Hands + Glowing Brain Tablet) */}
        <g transform="translate(180, 100)">
          {/* Headphones */}
          <rect x="12" y="90" width="22" height="42" rx="10" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2.5" />
          <rect x="16" y="95" width="14" height="32" rx="7" fill="#60a5fa" />
          <rect x="186" y="90" width="22" height="42" rx="10" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2.5" />
          <rect x="190" y="95" width="14" height="32" rx="7" fill="#60a5fa" />

          {/* White Robot Body/Torso */}
          <rect x="65" y="155" width="90" height="70" rx="30" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          {/* Blue AI Chest Badge */}
          <rect x="90" y="172" width="40" height="24" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          <text x="110" y="188" fill="#60a5fa" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">AI</text>

          {/* Robot Head */}
          <rect x="32" y="60" width="156" height="114" rx="52" fill="#ffffff" stroke="#cbd5e1" strokeWidth="4" />

          {/* Dark Blue Visor Screen */}
          <rect x="46" y="74" width="128" height="86" rx="36" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />

          {/* Glowing Eyes */}
          <path d="M 68 110 C 68 96, 90 96, 90 110" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#heroGlow)" />
          <path d="M 130 110 C 130 96, 152 96, 152 110" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#heroGlow)" />

          {/* Cheerful Robot Mouth */}
          <path d="M 102 128 C 106 138, 114 138, 118 128" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" fill="none" filter="url(#heroGlow)" />

          {/* Pink Cheeks */}
          <circle cx="58" cy="128" r="6" fill="#f43f5e" />
          <circle cx="162" cy="128" r="6" fill="#f43f5e" />

          {/* Graduation Mortarboard Base */}
          <path d="M 70 54 C 70 40, 150 40, 150 54 Z" fill="#0f172a" />
          {/* Diamond Cap */}
          <polygon points="110,8 205,38 110,68 15,38" fill="#0f172a" stroke="#334155" strokeWidth="3" />
          <circle cx="110" cy="38" r="5.5" fill="#f59e0b" />
          {/* Golden Tassel */}
          <path d="M 110 38 Q 65 35 60 60 Q 56 80 62 96" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <ellipse cx="63" cy="104" rx="5.5" ry="10" fill="#f59e0b" />

          {/* Left Hand: Yellow Graphite Pencil */}
          <g transform="translate(30, 150) rotate(-40)">
            <rect x="0" y="0" width="16" height="55" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="0,0 8,-16 16,0" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
            <polygon points="6,-12 8,-16 10,-12" fill="#0f172a" />
            <rect x="0" y="44" width="16" height="11" fill="#f472b6" rx="2" />
            {/* Robot Left Hand Clasp */}
            <circle cx="8" cy="30" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>

          {/* Right Hand: Purple Glowing Brain Notepad/Tablet */}
          <g transform="translate(145, 140) rotate(12)">
            <rect x="0" y="0" width="70" height="92" rx="14" fill="#7c3aed" stroke="#6d28d9" strokeWidth="3" />
            {/* Spiral Rings at Top */}
            <circle cx="18" cy="8" r="3.5" fill="#e2e8f0" />
            <circle cx="35" cy="8" r="3.5" fill="#e2e8f0" />
            <circle cx="52" cy="8" r="3.5" fill="#e2e8f0" />
            {/* Glowing Brain AI Icon */}
            <g transform="translate(18, 25)">
              <path
                d="M 17 6 C 11 6, 6 11, 6 17 C 6 22, 9 26, 12 28 C 10 32, 14 36, 18 36 C 22 36, 26 32, 24 28 C 27 26, 30 22, 30 17 C 30 11, 25 6, 17 6 Z"
                fill="#a855f7"
                stroke="#38bdf8"
                strokeWidth="2.5"
                filter="url(#heroGlow)"
              />
              <path d="M 17 12 L 17 30 M 11 18 C 14 18, 14 24, 11 24 M 23 18 C 20 18, 20 24, 23 24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>
            {/* Robot Right Hand Clasp */}
            <circle cx="58" cy="65" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>
        </g>

        {/* BOTTOM BRAND TYPOGRAPHY: "NoteQuiz AI" + "Upload • Learn • Practice • Excel" */}
        <g transform="translate(50, 420)">
          {/* Yellow brush stroke highlight under NoteQuiz */}
          <path d="M 40 70 Q 180 75 250 68" stroke="#facc15" strokeWidth="9" strokeLinecap="round" opacity="0.9" />

          {/* "Note" Text with 3D Depth */}
          <text x="35" y="60" fill="#1e3a8a" fontSize="62" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">
            Note
          </text>
          {/* "Quiz" Text */}
          <text x="180" y="60" fill="#3b82f6" fontSize="62" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">
            Quiz
          </text>

          {/* Glowing AI Brain Speech Badge */}
          <g transform="translate(345, 0)">
            <path
              d="M 20 10 C 5 10, -5 22, 0 35 C -5 48, 5 60, 20 62 C 30 63, 38 68, 45 74 L 46 62 C 75 60, 85 45, 80 32 C 85 18, 70 10, 48 10 Z"
              fill="url(#glowAiBadge)"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            {/* Circuit Nodes */}
            <circle cx="85" cy="20" r="3" fill="#38bdf8" />
            <circle cx="92" cy="38" r="3.5" fill="#a855f7" />
            <circle cx="86" cy="55" r="3" fill="#38bdf8" />
            <path d="M 80 25 L 85 20 M 78 38 L 92 38 M 78 50 L 86 55" stroke="#93c5fd" strokeWidth="2" />
            <text x="38" y="44" fill="#ffffff" fontSize="36" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              AI
            </text>
          </g>

          {/* Slogan / Tagline with Paper Plane */}
          <g transform="translate(90, 95)">
            <text x="0" y="0" fill="#4338ca" fontSize="18" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif">
              Upload  •  Learn  •  Practice  •  Excel
            </text>
            <path d="M 310 -3 Q 325 5 340 -10" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <polygon points="340,-10 332,-5 338,-3" fill="#3b82f6" />
          </g>
        </g>
      </svg>
    </div>
  );

  // Compact Variant: Icon only
  if (variant === 'icon' || variant === 'symbol') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] border border-[#cbd5e1] dark:border-[#3b352f] shadow-xs shrink-0 overflow-hidden ${iconDimensions} ${className}`}
      >
        <MascotAvatar className="w-full h-full p-0.5" />
      </div>
    );
  }

  // Hero Variant: Full stylized scene
  if (variant === 'hero') {
    return (
      <div className={`w-full ${className}`}>
        <HeroIllustration />
      </div>
    );
  }

  // Badge / Navbar / Full Variant
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Robot Mascot Icon in a round-corner container */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/50 dark:from-[#2e2924] dark:to-[#221e1a] border border-[#e8dfd1] dark:border-[#3b352f] shadow-xs shrink-0 transition-transform duration-300 ${
          animate ? 'hover:scale-105' : ''
        } ${
          size === 'sm' ? 'w-8 h-8 p-0.5' : size === 'lg' ? 'w-12 h-12 p-1' : size === 'xl' ? 'w-16 h-16 p-1.5' : 'w-10 h-10 p-1'
        }`}
      >
        <MascotAvatar className="w-full h-full" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold tracking-tight text-[#1e293b] dark:text-[#f0ebe1] text-lg sm:text-xl">
            <span className="text-[#1e3a8a] dark:text-[#93c5fd]">Note</span>
            <span className="text-[#2563eb] dark:text-[#60a5fa]">Quiz</span>
          </span>
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#7c3aed] text-white shadow-xs">
            AI
          </span>
        </div>

        {showTagline && (
          <span className="text-[10px] font-semibold text-[#8c7355] dark:text-[#aa957c] tracking-tight mt-0.5 hidden sm:inline-block">
            Upload • Learn • Practice • Excel
          </span>
        )}
      </div>
    </div>
  );
};
