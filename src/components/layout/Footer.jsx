export default function Footer() {
  return (
    <footer className="w-full bg-[#F0F2FA] border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-bold text-[#12234F]">LearnHub Cameroon</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            © 2026 LearnHub Cameroon. Empowering local tutors and students.
          </p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="text-xs font-semibold text-slate-700">Platform</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              <li><a href="/courses" className="hover:text-[#12234F]">Courses</a></li>
              <li><a href="/tutors" className="hover:text-[#12234F]">Tutors</a></li>
              <li><a href="/support" className="hover:text-[#12234F]">Support</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Legal</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              <li><a href="/privacy" className="hover:text-[#12234F]">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#12234F]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}