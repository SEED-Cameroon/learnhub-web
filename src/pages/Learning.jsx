import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function Learning() {
  const navigate = useNavigate();
  const { id } = useParams();

  const courses = {
    "1": {
      title: "Web Development",
      icon: "💻",
      lessons: [
        "Introduction to Web Development",
        "HTML Fundamentals",
        "CSS and Page Styling",
        "Responsive Web Design",
        "JavaScript Fundamentals",
        "DOM Manipulation",
        "Building Interactive Websites",
        "Final Web Project",
      ],
    },
    "2": {
      title: "Mathematics",
      icon: "📐",
      lessons: [
        "Numbers and Algebra",
        "Functions",
        "Geometry",
        "Trigonometry",
        "Sequences",
        "Calculus",
        "Statistics",
        "Problem Solving",
      ],
    },
    "3": {
      title: "Physics",
      icon: "⚡",
      lessons: [
        "Measurements and Units",
        "Motion",
        "Forces",
        "Energy",
        "Electricity",
        "Waves",
        "Light",
        "Practical Applications",
      ],
    },
    "4": {
      title: "Computer Science",
      icon: "🖥️",
      lessons: [
        "Introduction to Computer Science",
        "Computer Systems",
        "Algorithms",
        "Programming Fundamentals",
        "Data Structures",
        "Problem Solving",
        "Databases",
        "Software Development",
      ],
    },
    "5": {
      title: "French Language",
      icon: "🇫🇷",
      lessons: [
        "Basic Vocabulary",
        "French Grammar",
        "Everyday Conversations",
        "Reading Comprehension",
        "Writing Skills",
        "Listening Practice",
        "Speaking Practice",
        "Final Assessment",
      ],
    },
    "6": {
      title: "Entrepreneurship",
      icon: "🚀",
      lessons: [
        "Introduction to Entrepreneurship",
        "Finding Business Ideas",
        "Market Research",
        "Business Models",
        "Marketing",
        "Financial Planning",
        "Building a Team",
        "Launching a Business",
      ],
    },
  };

  const course = courses[id];

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(`learnhub_progress_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentLesson, setCurrentLesson] = useState(0);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Course Not Found
          </h1>

          <button
            onClick={() => navigate("/my-courses")}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round(
    (completed.length / course.lessons.length) * 100
  );

  const completeLesson = () => {
    if (!completed.includes(currentLesson)) {
      const updated = [...completed, currentLesson];

      setCompleted(updated);

      localStorage.setItem(
        `learnhub_progress_${id}`,
        JSON.stringify(updated)
      );
    }

    if (currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-extrabold text-blue-600"
          >
            LearnHub
          </button>

          <button
            onClick={() => navigate("/my-courses")}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            ← My Courses
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Course Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl">
              {course.icon}
            </div>

            <div>
              <p className="text-sm text-blue-100">
                LEARNING COURSE
              </p>

              <h1 className="text-3xl font-extrabold">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8">

            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Lessons */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Course Lessons
            </h2>

            <div className="mt-5 space-y-2">

              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson}
                  onClick={() => setCurrentLesson(index)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition ${
                    currentLesson === index
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      completed.includes(index)
                        ? "bg-green-500 text-white"
                        : currentLesson === index
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {completed.includes(index) ? "✓" : index + 1}
                  </span>

                  <span>{lesson}</span>

                </button>
              ))}

            </div>

          </aside>

          {/* Lesson Content */}
          <section className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <span className="text-sm font-bold text-blue-600">
                LESSON {currentLesson + 1} OF {course.lessons.length}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                {course.lessons[currentLesson]}
              </h2>

              <div className="mt-8 rounded-2xl bg-slate-50 p-6">

                <h3 className="text-xl font-bold text-slate-900">
                  Lesson Overview
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  Welcome to this lesson on{" "}
                  <strong>{course.lessons[currentLesson]}</strong>.
                  This learning module provides structured explanations,
                  examples, and activities to help you develop a strong
                  understanding of the topic.
                </p>

                <p className="mt-4 leading-8 text-slate-600">
                  Study the material carefully, take notes, and complete the
                  activities before moving to the next lesson.
                </p>

              </div>

              <div className="mt-8 flex flex-wrap justify-between gap-3">

                <button
                  disabled={currentLesson === 0}
                  onClick={() =>
                    setCurrentLesson(currentLesson - 1)
                  }
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <button
                  onClick={completeLesson}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
                >
                  {currentLesson === course.lessons.length - 1
                    ? "Complete Course"
                    : "Complete Lesson →"}
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Learning;