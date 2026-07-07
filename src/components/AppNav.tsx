import Link from "next/link";

const LINKS = [
  { href: "/comptes", label: "Comptes" },
  { href: "/lifecycle", label: "Onboarding & lifecycle" },
  { href: "/score-de-risque", label: "Score de risque" },
  { href: "/parametres/score-de-risque", label: "Paramètres" },
];

export function AppNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
        <span className="text-sm font-semibold tracking-tight text-slate-900">
          Cuberfit <span className="text-indigo-600">CRM</span>
        </span>
        <nav className="flex gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
