"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CuberfitLogo } from "@/components/CuberfitLogo";

type IconProps = { className?: string };

function IconComptes({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconLifecycle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.2 4.6v3.4h-3.4M6.8 19.4V16h3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconScore({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3 4 6.5v5c0 5 3.4 8 8 9.5 4.6-1.5 8-4.5 8-9.5v-5L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12.2l2.1 2.1L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCampagnes({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H7l1 4h2l-1-4h1l7 3V6l-7 3H5.5A1.5 1.5 0 0 0 4 10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 9.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconTickets({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v1a1.7 1.7 0 0 0 0 3v1a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 13.5v-1a1.7 1.7 0 0 0 0-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 7v10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
    </svg>
  );
}
function IconParametres({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4M17.8 17.8l-1.4-1.4M7.6 7.6 6.2 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const LINKS = [
  { href: "/comptes", label: "Comptes", icon: IconComptes },
  { href: "/lifecycle", label: "Onboarding & lifecycle", icon: IconLifecycle },
  { href: "/score-de-risque", label: "Score de risque", icon: IconScore },
  { href: "/campagnes", label: "Campagnes", icon: IconCampagnes },
  { href: "/tickets", label: "Tickets", icon: IconTickets },
];

const SETTINGS_LINK = { href: "/parametres/score-de-risque", label: "Paramètres", icon: IconParametres };

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderLink(link: (typeof LINKS)[number]) {
    const active = isActive(link.href);
    const Icon = link.icon;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-[#3333CE] text-white shadow-sm"
            : "text-[#5C6584] hover:bg-[#EEF0FC] hover:text-[#1B2340]"
        }`}
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-[#8891B0] group-hover:text-[#3333CE]"}`} />
        <span className="truncate">{link.label}</span>
      </Link>
    );
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E4E7F5] bg-white">
      <div className="flex items-center px-5 py-5">
        <CuberfitLogo size={30} />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        <span className="mb-1 mt-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#A6ACC4]">
          CRM
        </span>
        {LINKS.map(renderLink)}
      </nav>

      <div className="border-t border-[#E4E7F5] px-3 py-3">
        {renderLink(SETTINGS_LINK)}
      </div>
    </aside>
  );
}
