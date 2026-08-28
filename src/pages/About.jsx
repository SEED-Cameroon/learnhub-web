import heroImage from '../assets/hero.jpg'
import MaterialIcon from '../components/icons/MaterialIcon'

const HOW_IT_WORKS = [
  {
    title: 'Browse',
    description:
      'Explore a wide range of courses tailored to local industry needs, from tech to management.',
    icon: 'search',
    iconBgClass: 'bg-primary-fixed',
    iconColorClass: 'text-primary-fixed-dim',
  },
  {
    title: 'Learn',
    description:
      'Engage with interactive content and expert-led sessions designed for deep skill acquisition.',
    icon: 'menu_book',
    iconBgClass: 'bg-secondary-fixed',
    iconColorClass: 'text-secondary',
  },
  {
    title: 'Support',
    description:
      'Join our community and get the mentorship you need from local and international experts.',
    icon: 'diversity_3',
    iconBgClass: 'bg-tertiary-fixed',
    iconColorClass: 'text-tertiary',
  },
]

const TEAM = [
  {
    name: 'Samuel E.',
    role: 'Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    name: 'Marie L.',
    role: 'Head of Education',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
  },
  {
    name: 'Jean-Paul N.',
    role: 'Tech Lead',
    avatar: 'https://randomuser.me/api/portraits/men/24.jpg',
  },
  {
    name: 'Clarisse B.',
    role: 'Student Success',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
  },
]

export default function About() {
  return (
    <div>
      {/* Mission */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 relative h-[280px] md:h-[420px] rounded-xl overflow-hidden elevation-1">
          <img
            src={heroImage}
            alt="Students collaborating in a bright, modern LearnHub Cameroon classroom"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-6 flex flex-col gap-6">
          <h1 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-extrabold tracking-tight text-on-surface">
            Empowering Local Talent and Students
          </h1>
          <p className="text-base text-on-surface-variant max-w-lg">
            LearnHub Cameroon is dedicated to providing accessible, high-quality education and
            resources to the next generation of Cameroonian leaders and innovators. We bridge the
            gap between education and industry.
          </p>
          <a
            href="#how-it-works"
            className="self-start bg-primary text-on-primary text-sm font-semibold tracking-wide px-8 py-3 rounded-full hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface-container-low scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <h2 className="text-[32px] leading-[40px] font-bold text-center text-on-surface mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="bg-surface-container-lowest rounded-xl p-8 elevation-1 interactive-card flex flex-col items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${step.iconBgClass} ${step.iconColorClass}`}
                >
                  <MaterialIcon name={step.icon} />
                </div>
                <h3 className="text-[24px] leading-8 font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="text-base text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <h2 className="text-[32px] leading-[40px] font-bold text-center text-on-surface mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed transition-transform duration-300 hover:scale-105">
                <img
                  src={member.avatar}
                  alt={`${member.name}, ${member.role}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-on-surface font-semibold text-base">{member.name}</h3>
                <p className="text-outline text-sm">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pb-16 md:pb-24">
        <div className="bg-surface-container rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-primary text-2xl font-bold mb-2">Get In Touch</h2>
            <p className="text-on-surface-variant max-w-md mx-auto md:mx-0">
              Have questions about our programs or want to partner with us? We&apos;d love to
              hear from you.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <a
              href="mailto:contact@learnhub.cm"
              className="flex items-center justify-center md:justify-start gap-3 text-on-surface hover:text-primary transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <MaterialIcon name="mail" className="text-primary" />
              <span className="text-sm font-medium">contact@learnhub.cm</span>
            </a>
            <div className="flex items-center justify-center md:justify-start gap-3 text-on-surface">
              <MaterialIcon name="location_on" className="text-primary" />
              <span className="text-sm font-medium">Bonanjo, Douala, Cameroon</span>
            </div>
            <a
              href="tel:+237600000000"
              className="flex items-center justify-center md:justify-start gap-3 text-on-surface hover:text-primary transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <MaterialIcon name="call" className="text-primary" />
              <span className="text-sm font-medium">+237 600 000 000</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
