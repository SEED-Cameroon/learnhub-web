import { Link } from 'react-router-dom'
import { BadgeCheck, MessagesSquare, PlayCircle, Smartphone } from 'lucide-react'
import heroImage from '../assets/hero.jpg'
import { Button } from '@/components/ui/button'
import Container from '@/components/common/Container'

const BELIEFS = [
  {
    title: 'Lessons should be free to watch',
    description: 'No paywalls, no locked chapters. A student who can’t pay learns exactly what a student who can learns.',
    Icon: PlayCircle,
  },
  {
    title: 'Local teachers teach best',
    description:
      'Tutors who have sat the GCE, the Bac and the public-service exams know where students get stuck, and explain it in context.',
    Icon: BadgeCheck,
  },
  {
    title: 'Good teaching deserves to be paid',
    description:
      'Students who are helped can support a tutor each month with Mobile Money. The money goes to the teacher, not to unlock content.',
    Icon: Smartphone,
  },
  {
    title: 'Questions make lessons better',
    description: 'Every course has comments where students ask and tutors answer, so the next student finds the answer too.',
    Icon: MessagesSquare,
  },
]

// Supporting a tutor is a real sequence, so these steps are numbered.
const SUPPORT_STEPS = [
  { title: 'Choose an amount', description: 'Pick 500, 1,000, 2,000 or 5,000 XAF a month, or enter your own.' },
  { title: 'Pick your provider', description: 'Pay with MTN Mobile Money or Orange Money and enter your number.' },
  { title: 'Approve on your phone', description: 'A payment prompt arrives on your phone. Enter your PIN to approve it.' },
  { title: 'Support is confirmed', description: 'Once your provider confirms, it shows as active. Cancel any time.' },
]

export default function About() {
  return (
    <div>
      {/* Mission */}
      <section aria-labelledby="mission-heading" className="relative z-10 bg-primary text-on-primary">
        <div className="thumb-dots pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
        <Container className="relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1
              id="mission-heading"
              className="rise-in text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-[60px]"
              style={{ '--d': '0ms' }}
            >
              Good teaching should reach every student in Cameroon
            </h1>
            <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-primary-fixed" style={{ '--d': '100ms' }}>
              LearnHub puts courses from Cameroonian teachers online for free, so a student in Garoua can learn from the
              same tutor as a student in Douala. Tutors earn from the students they help, through Mobile Money.
            </p>
          </div>

          {/* Kept near the photo's native 657px width so it stays sharp. */}
          <div
            className="rise-in mx-auto w-full max-w-[520px] overflow-hidden rounded-[28px] ring-1 ring-white/15 lg:col-span-5 lg:mr-0"
            style={{ '--d': '200ms' }}
          >
            <img
              src={heroImage}
              alt="Students working through a LearnHub lesson together on a tablet"
              className="aspect-[4/3.4] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* What we believe */}
      <section aria-labelledby="beliefs-heading">
        <Container className="grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="beliefs-heading"
              className="text-3xl font-bold tracking-tight text-primary text-balance md:text-[40px] md:leading-[1.1]"
            >
              What we believe
            </h2>
            <p className="mt-5 max-w-md text-lg text-on-surface-variant">
              Four ideas shape every decision we make, from how courses are priced to how tutors get paid.
            </p>
          </div>

          <ul className="divide-y divide-outline-variant lg:col-span-6 lg:col-start-7">
            {BELIEFS.map(({ title, description, Icon }) => (
              <li key={title} className="flex gap-5 py-7 first:pt-0 last:pb-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary-container">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                  <p className="mt-1.5 text-on-surface-variant">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Supporting a tutor */}
      <section id="support" aria-labelledby="support-heading" className="scroll-mt-20 bg-surface-container-low">
        <Container className="py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 id="support-heading" className="text-3xl font-bold tracking-tight text-on-surface md:text-[40px] md:leading-[1.1]">
              How supporting a tutor works
            </h2>
            <p className="mt-4 text-lg text-on-surface-variant">
              Support is a monthly thank-you. It never unlocks or locks lessons: every course stays free whether you
              support or not.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-0 md:grid-cols-4 md:gap-6">
            {/* Connecting line: vertical on mobile, horizontal on desktop */}
            <span
              aria-hidden="true"
              className="absolute top-5 bottom-5 left-5 w-px bg-outline-variant md:top-5 md:right-[12.5%] md:bottom-auto md:left-[12.5%] md:h-px md:w-auto"
            />
            {SUPPORT_STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 pb-9 last:pb-0 md:flex-col md:items-center md:gap-0 md:pb-0 md:text-center">
                <span
                  className={
                    i === SUPPORT_STEPS.length - 1
                      ? 'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-sm font-bold text-tertiary-fixed ring-8 ring-surface-container-low'
                      : 'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary ring-8 ring-surface-container-low'
                  }
                >
                  {i + 1}
                </span>
                <div className="pt-1.5 md:pt-5">
                  <h3 className="text-lg font-semibold text-on-surface">{step.title}</h3>
                  <p className="mt-1 text-on-surface-variant md:mx-auto md:max-w-[15rem]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <Button asChild variant="outline" className="mt-12 h-auto rounded-full border-primary px-6 py-3 text-primary">
            <Link to="/tutors">Find a tutor to support</Link>
          </Button>
        </Container>
      </section>

      {/* Questions */}
      <section aria-labelledby="questions-heading">
        <Container className="py-16 md:py-20">
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <h2 id="questions-heading" className="text-xl font-bold text-on-surface">
                Questions about a course?
              </h2>
              <p className="mt-1 max-w-xl text-on-surface-variant">
                Ask in the comments under the course. Tutors and other students answer there, so everyone learns from
                the reply.
              </p>
            </div>
            <Button asChild variant="outline" className="h-auto shrink-0 rounded-full border-primary px-6 py-3 text-primary">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Closing calls to action */}
      <Container as="section" aria-labelledby="cta-heading" className="pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[28px] bg-primary px-6 py-12 text-center text-on-primary md:px-14 md:py-16">
          <div className="thumb-dots pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
          <h2 id="cta-heading" className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Start with one lesson today
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-lg text-primary-fixed">
            Watch a course for free, or share what you know with students across Cameroon.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="h-auto rounded-full bg-secondary-container px-8 py-3 text-sm font-semibold text-on-secondary-container shadow-none hover:bg-secondary-container/85"
            >
              <Link to="/courses">Browse courses</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-full border-white/40 bg-transparent px-8 py-3 text-sm text-on-primary hover:bg-white/10 hover:text-on-primary"
            >
              <Link to="/register?role=tutor">Become a tutor</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
