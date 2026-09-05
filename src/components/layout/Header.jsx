import { Search, GraduationCap } from "lucide-react";

// activePage: "courses" | "tutors" | "about" | null
export default function Header({ activePage = null, isAuthenticated = false, userAvatarUrl = null }) {
  const navLink = (label, key) => (
    <a
      href={`/${key}`}
      className={
        "text-sm font-medium transition-colors " +
        (activePage === key
          ? "text-[#12234F] underline underline-offset-8 decoration-2"
          : "text-slate-600 hover:text-[#12234F]")
      }
    >
      {label}
    </a>
  );

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <GraduationCap className="h-5 w-5 text-[#F0A93B]" />
          <span className="text-[15px] font-bold text-[#12234F]">
            LearnHub Cameroon
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLink("Courses", "courses")}
          {navLink("Tutors", "tutors")}
          {navLink("About", "about")}
        </nav>

        <div className="hidden flex-1 max-w-xs items-center rounded-md border border-slate-300 px-3 py-1.5 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="ml-2 w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {isAuthenticated ? (
          <img
            src={userAvatarUrl || "https://i.pravatar.cc/32"}
            alt="Account"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex shrink-0 items-center gap-3">
            <a href="/login" className="text-sm font-medium text-slate-700 hover:text-[#12234F]">
              Login
            </a>
            <a
              href="/signup"
              className="rounded-md bg-[#12234F] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#0D1938]"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>
    </header>
  );
}