import { useState } from "react";
import TutorCard from "../../learnhub-web/cards/TutorCard";

const sampleTutors = [
  {
    id: 1,
    name: "Amina Mensah",
    headline: "Mathematics and exam preparation",
    verified: true,
    followersCount: 1240,
    isFollowing: false,
  },
  {
    id: 2,
    name: "Kwame Boateng",
    headline: "Frontend development mentor",
    verified: true,
    followersCount: 860,
    isFollowing: false,
  },
  {
    id: 3,
    name: "Nana Owusu",
    headline: "Business English and communication",
    verified: false,
    followersCount: 430,
    isFollowing: false,
  },
];

function Home() {
  const [tutors, setTutors] = useState(sampleTutors);

  function handleFollow(tutor) {
    setTutors((currentTutors) =>
      currentTutors.map((currentTutor) =>
        currentTutor.id === tutor.id
          ? { ...currentTutor, isFollowing: !currentTutor.isFollowing }
          : currentTutor,
      ),
    );
  }

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            LearnHub
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Learn from local tutors, build practical skills, and grow with your community.
          </p>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Explore mentors</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Featured tutors</h2>
            </div>
            <span className="text-sm text-slate-500">{tutors.length} available</span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onFollow={handleFollow} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home
