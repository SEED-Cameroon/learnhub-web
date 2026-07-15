import { Outlet } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          LearnHub
        </span>
      </header>
      <main className="flex-1">{children ?? <Outlet />}</main>
    </div>
  )
}

export default Layout
