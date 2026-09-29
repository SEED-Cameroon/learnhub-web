import { Link } from 'react-router-dom'
import { HandCoins, Mail, MapPin, MessagesSquare, Phone, PlayCircle, Search } from 'lucide-react'
import heroImage from '../assets/hero.jpg'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'

const HOW_IT_WORKS = [
  {
    title: 'Find a course',
    description:
      'Browse by subject or search for the exact topic you are revising, from A Level calculus to Excel for work.',
    Icon: Search,
    iconClass: 'bg-primary-fixed text-primary',
  },
  {
    title: 'Watch for free',
    description:
      'Every course is free to watch, on your phone or computer. Pick up where you stopped whenever you come back.',
    Icon: PlayCircle,
    iconClass: 'bg-secondary-fixed text-secondary',
  },
  {
    title: 'Ask and follow',
    description:
      'Ask questions in the comments, like the lessons that helped, and follow tutors to see their new courses first.',
    Icon: MessagesSquare,
    iconClass: 'bg-tertiary-fixed text-tertiary',
  },
]

// Supporting a tutor is a real sequence, so these steps are numbered.
const SUPPORT_STEPS = [
  { title: 'Choose an amount', description: 'Pick 500, 1,000, 2,000 or 5,000 XAF a month, or enter your own.' },
  {
    title: 'Pick your provider',
    description: 'Pay with MTN Mobile Money or Orange Money and enter your phone number.',
  },
  {
    title: 'Approve on your phone',
    description: 'You get a payment prompt on your phone. Enter your PIN to approve it.',
  },
  {
    title: 'Support is confirmed',
    description: 'Once your provider confirms, the subscription shows as active. You can cancel at any time.',
  },
]

const TEAM = [
  { name: 'Samuel Etoundi', role: 'Founder' },
  { name: 'Marie Loga', role: 'Head of education' },
  { name: 'Jean-Paul Nkeng', role: 'Tech lead' },
  { name: 'Clarisse Bessala', role: 'Student success' },
]

export default function About() {
  return (
    <div>
      {/* Mission */}
      <Container as="section" className="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-12 md:gap-6 md:py-20">
        <div className="relative h-[240px] overflow-hidden rounded-xl elevation-1 sm:h-[320px] md:col-span-6 md:h-[420px]">
          <img
            src={heroImage}
            alt="Students working through a lesson together on a tablet"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 md:col-span-6">
          <h1 className="text-[32px] font-extrabold leading-[40px] tracking-tight text-on-surface md:text-[48px] md:leading-[56px]">
            Good teaching should reach every student in Cameroon
          </h1>
          <p className="max-w-lg text-base text-on-surface-variant md:text-lg">
            LearnHub puts courses from Cameroonian teachers online for free, so a student in Garoua can learn from the
            same tutor as a student in Douala. Tutors earn from the students they help, through Mobile Money.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="h-auto rounded-full px-8 py-3 text-sm shadow-none hover:bg-primary hover:opacity-90"
            >
              <Link to="/courses">Browse courses</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto rounded-full px-8 py-3 text-sm">
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>
        </div>
      </Container>

      {/* How it works */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 bg-surface-container-low">
        <Container className="py-16 md:py-24">
          <h2
            id="how-heading"
            className="mb-12 text-center text-2xl font-bold text-on-surface md:text-[32px] md:leading-10"
          >
            How LearnHub works
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map(({ title, description, Icon, iconClass }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-4 rounded-xl bg-surface-container-lowest p-8 elevation-1"
              >
                <div className={`flex size-12 items-center justify-center rounded-full ${iconClass}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-7 text-on-surface">{title}</h3>
                <p className="text-base text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Supporting a tutor */}
      <section id="support" aria-labelledby="support-heading" className="scroll-mt-20">
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <HandCoins className="size-6" aria-hidden="true" />
              </div>
              <h2 id="support-heading" className="text-2xl font-bold text-on-surface md:text-[32px] md:leading-10">
                How supporting a tutor works
              </h2>
              <p className="mt-4 max-w-md text-base text-on-surface-variant">
                Support is a monthly thank-you to a tutor. It never unlocks or locks lessons: every course stays free to
                watch whether you support or not.
              </p>
              <Button asChild variant="outline" className="mt-6 h-auto rounded-full px-6 py-2.5">
                <Link to="/tutors">Find a tutor to support</Link>
              </Button>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2 md:col-span-7">
              {SUPPORT_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-on-surface">{step.title}</h3>
                  <p className="mt-1 text-on-surface-variant">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section aria-labelledby="team-heading" className="bg-surface-container-low">
        <Container className="py-16 md:py-24">
          <h2
            id="team-heading"
            className="mb-12 text-center text-2xl font-bold text-on-surface md:text-[32px] md:leading-10"
          >
            The team
          </h2>
          <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {TEAM.map((member) => (
              <li key={member.name} className="flex flex-col items-center gap-3 text-center">
                <Avatar name={member.name} size="lg" />
                <div>
                  <h3 className="text-base font-semibold text-on-surface">{member.name}</h3>
                  <p className="text-sm text-on-surface-variant">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-heading">
        <Container className="py-16 md:py-24">
          <div className="flex flex-col items-center justify-between gap-8 rounded-xl bg-surface-container p-8 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <h2 id="contact-heading" className="mb-2 text-2xl font-bold text-primary">
                Get in touch
              </h2>
              <p className="mx-auto max-w-md text-on-surface-variant md:mx-0">
                Questions about a course, a payment, or partnering with us? Write to us and we’ll reply within two
                working days.
              </p>
            </div>
            <address className="flex w-full flex-col gap-4 not-italic md:w-auto">
              <a
                href="mailto:contact@learnhub.cm"
                className="flex items-center justify-center gap-3 rounded text-on-surface transition-colors hover:text-primary md:justify-start"
              >
                <Mail className="size-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">contact@learnhub.cm</span>
              </a>
              <p className="flex items-center justify-center gap-3 text-on-surface md:justify-start">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">Bonanjo, Douala, Cameroon</span>
              </p>
              <a
                href="tel:+237600000000"
                className="flex items-center justify-center gap-3 rounded text-on-surface transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="size-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">+237 600 000 000</span>
              </a>
            </address>
          </div>
        </Container>
      </section>
    </div>
  )
}
