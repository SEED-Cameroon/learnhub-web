function About() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            About LearnHub
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Learning made more accessible
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            LearnHub is a learning platform designed to connect learners with
            tutors and make quality educational content easier to discover.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                For learners
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Discover courses, explore tutors, follow learning content,
                interact with other learners, and build your knowledge at your
                own pace.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                For tutors
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Share your knowledge through courses, build an audience, and
                create opportunities around your teaching experience.
              </p>
            </article>
          </div>

          <section className="mt-8 rounded-xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold">
              Our purpose
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-300">
              LearnHub aims to create a simple educational environment where
              learners can find useful content and tutors can share their
              expertise with a wider community.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}

export default About;