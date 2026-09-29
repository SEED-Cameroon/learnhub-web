import { cn } from '@/lib/utils'

/** Page width + gutters shared by every public page. */
export default function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-10', className)}>{children}</Tag>
}
