import React from 'react';
import { useApp } from '../context/AppContext';

interface StationeryBackgroundProps {
  opacity?: number;
  className?: string;
}

export const StationeryBackground: React.FC<StationeryBackgroundProps> = ({
  opacity = 1,
  className = ''
}) => {
  const { settings } = useApp();
  const isDark = settings?.theme === 'dark';

  return (
    <div 
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      {/* 1. Subtle Notebook Graph/Dot Grid Pattern in Neutral Grays */}
      <div 
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.20]"
        style={{
          backgroundImage: isDark 
            ? `radial-gradient(circle at 1px 1px, rgba(156, 163, 175, 0.18) 1px, transparent 0)` 
            : `radial-gradient(circle at 1px 1px, rgba(107, 114, 128, 0.16) 1.2px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* 2. Top-Left: Geometry Compass & Arc in Monochrome Graphite Gray */}
      <div className="absolute -top-6 -left-6 sm:top-4 sm:left-4 w-48 sm:w-64 h-48 sm:h-64 opacity-50 dark:opacity-30 transform -rotate-12 animate-float-slow">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Compass Body in Gray Wireframe Line Art */}
          <g stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Top Pivot Knob */}
            <circle cx="100" cy="30" r="8" fill={isDark ? '#374151' : '#e5e7eb'} stroke={isDark ? '#9ca3af' : '#6b7280'} />
            <line x1="100" y1="22" x2="100" y2="12" strokeWidth="3" />
            <circle cx="100" cy="10" r="3" fill={isDark ? '#d1d5db' : '#4b5563'} />
            
            {/* Left Leg (Needle point) */}
            <path d="M94 36 L60 145 L56 160" />
            {/* Metal needle tip */}
            <polygon points="56,160 54,175 58,162" fill={isDark ? '#d1d5db' : '#374151'} />
            
            {/* Right Leg (Pencil holder arm) */}
            <path d="M106 36 L138 135" />
            {/* Compass Pencil Clamp in Silver Gray */}
            <rect x="132" y="128" width="16" height="14" rx="2" fill={isDark ? '#374151' : '#f3f4f6'} stroke={isDark ? '#9ca3af' : '#6b7280'} />
            <line x1="140" y1="128" x2="140" y2="142" />
            <circle cx="148" cy="135" r="2.5" fill={isDark ? '#d1d5db' : '#9ca3af'} />

            {/* Clamped Pencil in Shaded Charcoal & Medium Gray */}
            <path d="M142 110 L156 170 L150 185 L144 170 Z" fill={isDark ? '#4b5563' : '#d1d5db'} stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" />
            {/* Graphite tip */}
            <polygon points="150,185 147,178 153,178" fill={isDark ? '#111827' : '#1f2937'} />
            
            {/* Compass Adjustment Wing / Spreader Arc */}
            <path d="M72 90 Q100 102 126 90" strokeDasharray="3 3" stroke={isDark ? '#6b7280' : '#9ca3af'} />
            <circle cx="99" cy="96" r="4" fill={isDark ? '#4b5563' : '#d1d5db'} />
          </g>
          
          {/* Compass Drawing Arc (dotted gray line) */}
          <path 
            d="M45 168 A 110 110 0 0 0 162 178" 
            stroke={isDark ? '#6b7280' : '#9ca3af'} 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
            opacity="0.6" 
          />
        </svg>
      </div>

      {/* 3. Top-Right: Student Backpack / Bag in Neutral Charcoal & Slate Gray */}
      <div className="absolute -top-10 -right-8 sm:top-3 sm:right-6 w-52 sm:w-72 h-52 sm:h-72 opacity-50 dark:opacity-25 transform rotate-12 animate-float">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Top Hanging Loop Handle */}
          <path d="M85 45 C85 25, 115 25, 115 45" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          
          {/* Backpack Main Body in Soft Muted Gray */}
          <rect 
            x="50" 
            y="45" 
            width="100" 
            height="115" 
            rx="24" 
            fill={isDark ? '#262a2d' : '#f3f4f6'} 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="2.5" 
          />
          
          {/* Top Flap / Main Zipper Arc */}
          <path 
            d="M58 80 Q100 68 142 80" 
            stroke={isDark ? '#6b7280' : '#9ca3af'} 
            strokeWidth="2" 
            strokeDasharray="3 2" 
          />
          
          {/* Front Storage Pocket */}
          <rect 
            x="64" 
            y="95" 
            width="72" 
            height="52" 
            rx="12" 
            fill={isDark ? '#1f2428' : '#e5e7eb'} 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="2" 
          />
          
          {/* Front Pocket Zipper in Slate Gray */}
          <line x1="72" y1="108" x2="128" y2="108" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="2" strokeDasharray="3 1" />
          {/* Zipper Pull Tag */}
          <rect x="85" y="108" width="5" height="10" rx="1.5" fill={isDark ? '#6b7280' : '#4b5563'} />

          {/* Diamond Lash Tab */}
          <polygon 
            points="100,122 108,130 100,138 92,130" 
            fill={isDark ? '#374151' : '#d1d5db'} 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="1.5" 
          />
          <line x1="97" y1="128" x2="97" y2="132" stroke={isDark ? '#e5e7eb' : '#374151'} strokeWidth="1.5" />
          <line x1="103" y1="128" x2="103" y2="132" stroke={isDark ? '#e5e7eb' : '#374151'} strokeWidth="1.5" />

          {/* Side Water Bottle Net Pocket */}
          <path d="M48 95 C43 95, 42 125, 48 135" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" fill="none" />
          <line x1="45" y1="105" x2="49" y2="105" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" />
          <line x1="44" y1="118" x2="49" y2="118" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" />

          {/* Side Ruler Sticking Out in Gray Gradient */}
          <rect x="146" y="60" width="8" height="55" rx="1" transform="rotate(8 146 60)" fill={isDark ? '#374151' : '#e5e7eb'} stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1" />
          <line x1="147" y1="70" x2="152" y2="71" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1" />
          <line x1="147" y1="80" x2="151" y2="81" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1" />
          <line x1="147" y1="90" x2="153" y2="91" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1" />
        </svg>
      </div>

      {/* 4. Bottom-Left: Pencil & Wedge Eraser in Monochrome Shades of Gray */}
      <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:left-10 w-56 sm:w-80 h-56 sm:h-80 opacity-50 dark:opacity-30 transform rotate-6 animate-float">
        <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Beveled Wedge Eraser in Gray Tone Shading */}
          <g transform="translate(25, 80) rotate(-22)">
            {/* Rubber block bottom dark gray face */}
            <path d="M10 30 L65 30 L85 55 L30 55 Z" fill={isDark ? '#374151' : '#d1d5db'} stroke={isDark ? '#6b7280' : '#4b5563'} strokeWidth="2" />
            {/* Rubber block top lighter gray face */}
            <path d="M10 30 L65 30 L60 10 L5 10 Z" fill={isDark ? '#4b5563' : '#e5e7eb'} stroke={isDark ? '#6b7280' : '#4b5563'} strokeWidth="2" />
            {/* Eraser Paper Sleeve */}
            <path d="M25 20 L55 20 L70 42 L40 42 Z" fill={isDark ? '#1f2937' : '#f9fafb'} stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" />
            {/* Brand Stamp on sleeve */}
            <text x="35" y="32" fontSize="7" fontWeight="bold" fill={isDark ? '#d1d5db' : '#6b7280'} fontFamily="sans-serif">4B RUB</text>
            {/* Gray Eraser Crumbs */}
            <circle cx="8" cy="58" r="1.5" fill={isDark ? '#6b7280' : '#9ca3af'} />
            <circle cx="16" cy="62" r="1" fill={isDark ? '#6b7280' : '#9ca3af'} />
            <circle cx="75" cy="60" r="1.5" fill={isDark ? '#6b7280' : '#9ca3af'} />
          </g>

          {/* Long Hexagonal Drafting Pencil in Gray Graphite Design */}
          <g transform="translate(60, 20) rotate(48)">
            {/* Pencil Body Shaft in Neutral Gray */}
            <rect x="20" y="20" width="120" height="16" rx="2" fill={isDark ? '#374151' : '#e5e7eb'} stroke={isDark ? '#6b7280' : '#4b5563'} strokeWidth="2" />
            <line x1="20" y1="25" x2="140" y2="25" stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1.5" />
            <line x1="20" y1="31" x2="140" y2="31" stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1.5" />
            
            {/* Sharpened Wooden Cone Tip in Light Gray */}
            <polygon points="140,20 170,28 140,36" fill={isDark ? '#4b5563' : '#f3f4f6'} stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" />
            {/* Dark Graphite Lead Tip */}
            <polygon points="160,25.5 170,28 160,30.5" fill={isDark ? '#111827' : '#1f2937'} />
            
            {/* Metal Ferrule Collar */}
            <rect x="8" y="20" width="12" height="16" fill={isDark ? '#6b7280' : '#cbd5e1'} stroke={isDark ? '#9ca3af' : '#64748b'} strokeWidth="1.5" />
            <line x1="12" y1="20" x2="12" y2="36" stroke={isDark ? '#4b5563' : '#94a3b8'} />
            <line x1="16" y1="20" x2="16" y2="36" stroke={isDark ? '#4b5563' : '#94a3b8'} />

            {/* Pencil End Rubber Tip in Gray */}
            <path d="M-2 20 L8 20 L8 36 L-2 36 Q-6 28 -2 20" fill={isDark ? '#4b5563' : '#d1d5db'} stroke={isDark ? '#6b7280' : '#4b5563'} strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* 5. Bottom-Right: Transparent Set Square Ruler & Protractor in Gray Line Art */}
      <div className="absolute -bottom-8 -right-8 sm:bottom-4 sm:right-8 w-56 sm:w-72 h-56 sm:h-72 opacity-50 dark:opacity-25 transform -rotate-6 animate-float-slow">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* 45-Degree Triangle Set Square Ruler in Translucent Gray */}
          <polygon 
            points="30,170 170,170 30,30" 
            fill={isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.35)'} 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          {/* Inner Triangle Cutout */}
          <polygon 
            points="55,145 135,145 55,65" 
            fill={isDark ? '#1c1917' : '#f7f4ed'} 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          {/* Measurement Ticks along baseline */}
          <line x1="40" y1="170" x2="40" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          <line x1="50" y1="170" x2="50" y2="165" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1" />
          <line x1="60" y1="170" x2="60" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          <line x1="70" y1="170" x2="70" y2="165" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1" />
          <line x1="80" y1="170" x2="80" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          <line x1="90" y1="170" x2="90" y2="165" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1" />
          <line x1="100" y1="170" x2="100" y2="160" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="2" />
          <line x1="120" y1="170" x2="120" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          <line x1="140" y1="170" x2="140" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          <line x1="160" y1="170" x2="160" y2="162" stroke={isDark ? '#9ca3af' : '#4b5563'} strokeWidth="1.5" />
          
          {/* 90-Degree Angle Corner Symbol */}
          <rect x="30" y="158" width="12" height="12" fill="none" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" />

          {/* Semicircle Protractor Floating Beside in Gray Blueprint Style */}
          <g transform="translate(90, 40) rotate(25) scale(0.65)">
            <path d="M20 70 A 50 50 0 0 1 120 70 Z" fill={isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(229, 231, 235, 0.4)'} stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2" />
            <circle cx="70" cy="70" r="3" fill={isDark ? '#9ca3af' : '#6b7280'} />
            <line x1="70" y1="70" x2="70" y2="24" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="70" y1="70" x2="105" y2="35" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="70" y1="70" x2="35" y2="35" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
        </svg>
      </div>

      {/* 6. Middle Doodles (Paperclip, Marker, Sticky Note) all in Monochrome Gray */}
      {/* Paperclip */}
      <div className="hidden md:block absolute top-1/4 left-10 w-12 h-20 opacity-35 dark:opacity-20 transform rotate-45 animate-drift">
        <svg viewBox="0 0 40 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M10 20 L10 50 C10 60, 30 60, 30 50 L30 15 C30 5, 18 5, 18 15 L18 45 C18 50, 25 50, 25 45 L25 22" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Highlighter Pen in Gray Sketch Tones */}
      <div className="hidden lg:block absolute top-1/3 right-12 w-24 h-40 opacity-35 dark:opacity-20 transform -rotate-40 animate-float-slow">
        <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Highlighter Body */}
          <rect x="15" y="30" width="30" height="55" rx="6" fill={isDark ? '#374151' : '#e5e7eb'} stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2" />
          {/* Grip lines */}
          <line x1="22" y1="45" x2="38" y2="45" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="55" x2="38" y2="55" stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" />
          {/* Chisel Tip */}
          <polygon points="22,30 38,30 35,15 28,15" fill={isDark ? '#4b5563' : '#d1d5db'} stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="1.5" />
          {/* Cap Base Ring */}
          <rect x="12" y="80" width="36" height="8" rx="2" fill={isDark ? '#1f2937' : '#9ca3af'} />
        </svg>
      </div>

      {/* Sticky Note in Muted Gray Sketch Tones */}
      <div className="hidden xl:block absolute bottom-1/3 left-16 w-28 h-28 opacity-35 dark:opacity-20 transform -rotate-12 animate-float">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Sticky Note square */}
          <path d="M10 10 L85 10 L85 70 L65 90 L10 90 Z" fill={isDark ? '#2b2f33' : '#f3f4f6'} stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" />
          {/* Folded corner */}
          <polygon points="85,70 65,70 65,90" fill={isDark ? '#374151' : '#e5e7eb'} stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="1.5" />
          {/* Checklist lines */}
          <line x1="25" y1="30" x2="70" y2="30" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="45" x2="65" y2="45" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="60" x2="55" y2="60" stroke={isDark ? '#9ca3af' : '#6b7280'} strokeWidth="2" strokeLinecap="round" />
          {/* Little Star in Gray */}
          <polygon points="72,55 74,60 79,60 75,63 76,68 72,65 68,68 69,63 65,60 70,60" fill={isDark ? '#9ca3af' : '#6b7280'} />
        </svg>
      </div>

      {/* Math / Geometry Symbols in Subtle Pencil Gray */}
      <div className="absolute top-1/2 right-1/4 opacity-25 dark:opacity-15 font-mono text-xs text-gray-500 dark:text-gray-400 select-none pointer-events-none">
        <div className="transform rotate-12">∫ f(x) dx = F(x) + C</div>
      </div>
      <div className="absolute top-2/3 left-1/3 opacity-25 dark:opacity-15 font-mono text-xs text-gray-500 dark:text-gray-400 select-none pointer-events-none">
        <div className="transform -rotate-6">a² + b² = c²  •  θ = 45°</div>
      </div>
    </div>
  );
};
