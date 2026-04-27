"use client";

import Image from "next/image";

const LOGOS = [
  { src: "/logos/mckinsey.png", alt: "McKinsey" },
  { src: "/logos/bcg.png", alt: "BCG" },
  { src: "/logos/bain.png", alt: "Bain" },
  { src: "/logos/oliver-wyman.jpg", alt: "Oliver Wyman" },
];

const SCROLL_LOGOS = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

export function LogoMarquee() {
  return (
    <div className="bg-white rounded-lg border border-li-border py-5 overflow-hidden">
      <div className="flex animate-marquee items-center gap-20">
        {SCROLL_LOGOS.map((logo, i) => (
          <div key={i} className="flex-shrink-0 opacity-20">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={32}
              className="h-7 w-auto object-contain grayscale"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
