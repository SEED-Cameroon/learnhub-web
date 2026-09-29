import { Link } from 'react-router-dom'
import { useSeo } from '@/hooks/useSeo'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Container from '@/components/common/Container'

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true })
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <Compass className="mb-6 size-14 text-secondary-container" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-semibold text-on-surface-variant">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">This page doesn’t exist</h1>
      <p className="mt-3 max-w-md text-on-surface-variant">
        The link may be old or mistyped. Try browsing courses, or go back to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="h-auto rounded-full px-6 py-3 shadow-none">
          <Link to="/courses">Browse courses</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto rounded-full px-6 py-3">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </Container>
  )
}
