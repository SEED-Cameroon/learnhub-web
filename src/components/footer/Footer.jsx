const Footer = () => {
  return (
    <footer className="bg-surface-container-low w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 py-12 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold text-primary">LearnHub Cameroon</span>
          <p className="text-sm text-on-surface-variant max-w-sm">
            © 2024 LearnHub Cameroon. Empowering local tutors and students.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:col-start-3">
          <nav className="flex flex-col gap-2">
            <a
              href="#courses"
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            >
              Courses
            </a>
            <a
              href="#tutors"
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            >
              Tutors
            </a>
            <a
              href="#support"
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            >
              Support
            </a>
            <a
              href="#privacy"
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            >
              Terms of Service
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
