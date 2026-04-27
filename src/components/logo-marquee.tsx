"use client";

import Image from "next/image";

const LOGOS = [
  { src: "/logos/mckinsey.png", alt: "McKinsey" },
  { src: "/logos/bcg.png", alt: "BCG" },
  { src: "/logos/bain.png", alt: "Bain" },
  { src: "/logos/oliver-wyman.jpg", alt: "Oliver Wyman" },
];

// Double the logos for seamless infinite scroll
const SCROLL_LOGOS = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

export function LogoMarquee() {
  return (
    <div className="bg-slate-50 border-y border-slate-100 py-6 overflow-hidden">
      <div className="flex animate-marquee items-center gap-16">
        {SCROLL_LOGOS.map((logo, i) => (
          <div key={i} className="flex-shrink-0 opacity-30 hover:opacity-60 transition-opacity">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={40}
              className="h-8 w-auto object-contain grayscale"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
