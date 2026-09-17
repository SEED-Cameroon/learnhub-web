import { useMemo, useState } from "react";
import TutorCard from "../../learnhub-web/cards/TutorCard";

const categories = ["All Subjects", "Mathematics", "Computer Science", "Business & Finance", "Languages"];

const initialTutors = [
  {
    id: 1,
    name: "Dr. Foning",
    headline: "Advanced Mathematics",
    category: "Mathematics",
    verified: true,
    followersCount: 12000,
    isFollowing: false,
    avatarUrl: "https://i.pravatar.cc/160?img=12",
  },
  {
    id: 2,
    name: "Sarah N.",
    headline: "Full-Stack Development",
    category: "Computer Science",
    verified: true,
    followersCount: 8500,
    isFollowing: false,
    avatarUrl: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: 3,
    name: "Mr. Kamga",
    headline: "Corporate Finance",
    category: "Business & Finance",
    verified: false,
    followersCount: 5200,
    isFollowing: true,
    avatarUrl: "https://i.pravatar.cc/160?img=11",
  },
  {
    id: 4,
    name: "Mme. Bella",
    headline: "French Literature",
    category: "Languages",
    verified: true,
    followersCount: 15000,
    isFollowing: false,
    avatarUrl: "https://i.pravatar.cc/160?img=32",
  },
];

export default function Tutors() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Subjects");
  const [tutors, setTutors] = useState(initialTutors);

  const visibleTutors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tutors.filter((tutor) => {
      const matchesCategory = activeCategory === "All Subjects" || tutor.category === activeCategory;
      const matchesQuery = !normalizedQuery || `${tutor.name} ${tutor.headline}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, tutors]);

  function handleFollow(tutor) {
    setTutors((currentTutors) => currentTutors.map((currentTutor) => (
      currentTutor.id === tutor.id
        ? { ...currentTutor, isFollowing: !currentTutor.isFollowing }
        : currentTutor
    )));
  }

  return (
    <div className="bg-[#fbfcff]">
      <main className="mx-auto max-w-7xl px-6 pb-14 pt-14 sm:px-10 lg:px-12">
        <h1 className="text-4xl font-bold tracking-tight text-blue-950 sm:text-5xl">Find Your Mentor</h1>

        <div className="relative mt-8 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by subject, name, or skill..."
            aria-label="Search tutors"
            className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3" aria-label="Tutor subjects">
          {categories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2 text-xs font-semibold transition ${active ? "border-blue-900 bg-blue-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-900"}`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} onFollow={handleFollow} className="min-w-0" />
          ))}
        </div>

        {visibleTutors.length === 0 && <p className="py-16 text-center text-sm text-slate-500">No tutors match your search.</p>}

        <div className="mt-10 flex justify-center">
          <button type="button" className="rounded-full border border-blue-900 bg-white px-7 py-2.5 text-xs font-semibold text-blue-900 transition hover:bg-blue-50">
            Load More Tutors
          </button>
        </div>
      </main>
    </div>
  );
}
