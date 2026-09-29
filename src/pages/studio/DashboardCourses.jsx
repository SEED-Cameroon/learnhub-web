import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EyeOff, LibraryBig, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { deleteCourse, listMyCourses, updateCourse } from '@/services/studio'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import CourseThumbnail from '@/components/common/CourseThumbnail'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import { FormBanner } from '@/components/studio/Field'
import { formatCount, formatXaf } from '@/lib/format'
import { cn } from '@/lib/utils'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
]

function RowActions({ course, onToggle, onDelete, busy, compact = false }) {
  const published = course.status === 'published'
  const toggleLabel = published ? 'Unpublish' : 'Publish'
  // Compact (desktop table): icon buttons with the action in the tooltip and accessible name.
  const size = compact ? 'icon' : 'sm'
  const label = (text) => (compact ? null : text)

  return (
    <div className={cn('flex items-center gap-1', compact ? 'justify-end' : 'flex-wrap')}>
      <Button asChild variant="ghost" size={size}>
        <Link to={`/dashboard/courses/${course.id}/edit`} aria-label={`Edit ${course.title}`} title="Edit">
          <Pencil aria-hidden="true" />
          {label('Edit')}
        </Link>
      </Button>
      <Button variant="ghost" size={size} onClick={() => onToggle(course)} disabled={busy} aria-label={`${toggleLabel} ${course.title}`} title={toggleLabel}>
        {published ? <EyeOff aria-hidden="true" /> : <Send aria-hidden="true" />}
        {label(toggleLabel)}
      </Button>
      <Button variant="ghost" size={size} className="text-error hover:text-error" onClick={() => onDelete(course)} aria-label={`Delete ${course.title}`} title="Delete course">
        <Trash2 aria-hidden="true" />
        {label('Delete')}
      </Button>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}

export default function DashboardCourses() {
  const { data: courses, error, loading, reload, setData } = useAsync(listMyCourses, [])
  const [filter, setFilter] = useState('all')
  const [toDelete, setToDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState({ tone: 'success', text: '' })

  const counts = {
    all: courses?.length ?? 0,
    published: courses?.filter((c) => c.status === 'published').length ?? 0,
    draft: courses?.filter((c) => c.status === 'draft').length ?? 0,
  }
  const visible = courses?.filter((c) => filter === 'all' || c.status === filter) ?? []

  // Optimistic: flip the status straight away, roll back if the request fails.
  const handleToggle = async (course) => {
    const next = course.status === 'published' ? 'draft' : 'published'
    setBusyId(course.id)
    setData((list) => list.map((c) => (c.id === course.id ? { ...c, status: next } : c)))
    try {
      await updateCourse(course.id, { status: next })
      setNotice({ tone: 'success', text: next === 'published' ? `“${course.title}” published` : `“${course.title}” unpublished` })
    } catch (err) {
      setData((list) => list.map((c) => (c.id === course.id ? { ...c, status: course.status } : c)))
      setNotice({ tone: 'error', text: `Couldn’t change “${course.title}”: ${err.message}` })
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    await deleteCourse(toDelete.id)
    setData((list) => list.filter((c) => c.id !== toDelete.id))
    setNotice({ tone: 'success', text: `Course deleted: “${toDelete.title}”` })
  }

  return (
    <>
      <PageHeader
        title="My courses"
        description="Edit, publish or remove your courses. Drafts are only visible to you."
        actions={
          <Button asChild className="h-auto rounded-full px-5 py-2.5 shadow-none">
            <Link to="/dashboard/courses/new">
              <Plus aria-hidden="true" />
              New course
            </Link>
          </Button>
        }
      />

      {loading && <TableSkeleton />}
      {error && <ErrorState error={error} onRetry={reload} title="Your courses didn’t load" />}

      {courses && courses.length === 0 && (
        <EmptyState
          icon={LibraryBig}
          title="You haven’t created a course yet"
          action={
            <Button asChild className="h-auto rounded-full px-5 py-2.5 shadow-none">
              <Link to="/dashboard/courses/new">New course</Link>
            </Button>
          }
        >
          Start with one short course. Save it as a draft and publish it when it’s ready.
        </EmptyState>
      )}

      {courses && courses.length > 0 && (
        <div className="space-y-4">
          <div role="tablist" aria-label="Filter courses" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  filter === f.value
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'
                )}
              >
                {f.label} <span className="opacity-75">({counts[f.value]})</span>
              </button>
            ))}
          </div>

          {notice.text && <FormBanner tone={notice.tone}>{notice.text}</FormBanner>}

          {visible.length === 0 ? (
            <EmptyState icon={LibraryBig} title={filter === 'draft' ? 'No drafts' : 'Nothing published yet'}>
              {filter === 'draft' ? 'Every course you have is published.' : 'Publish a draft to make it visible to students.'}
            </EmptyState>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-container-lowest md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Course</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">Views</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">Likes</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">Comments</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">Earnings</th>
                      <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {visible.map((course) => (
                      <tr key={course.id} className="align-middle">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <CourseThumbnail course={course} className="w-24 shrink-0 rounded-md" />
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-medium text-on-surface">{course.title}</p>
                              <p className="text-xs text-on-surface-variant">{course.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={course.status} /></td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatCount(course.viewsCount)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatCount(course.likesCount)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatCount(course.commentsCount)}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium text-tertiary-container whitespace-nowrap">
                          {formatXaf(course.earningsXaf ?? 0)}
                        </td>
                        <td className="px-2 py-3">
                          <RowActions compact course={course} onToggle={handleToggle} onDelete={setToDelete} busy={busyId === course.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="space-y-3 md:hidden">
                {visible.map((course) => (
                  <li key={course.id} className="overflow-hidden rounded-xl border border-outline-variant/70 bg-surface-container-lowest">
                    <div className="flex gap-3 p-4">
                      <CourseThumbnail course={course} className="w-24 shrink-0 self-start rounded-md" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-medium text-on-surface">{course.title}</p>
                        <div className="mt-2"><StatusBadge status={course.status} /></div>
                      </div>
                    </div>
                    <dl className="grid grid-cols-4 gap-2 border-t border-outline-variant/60 px-4 py-3 text-center text-xs">
                      {[
                        ['Views', formatCount(course.viewsCount)],
                        ['Likes', formatCount(course.likesCount)],
                        ['Comments', formatCount(course.commentsCount)],
                        ['Earnings', `${formatCount(course.earningsXaf ?? 0)} XAF`],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-on-surface-variant">{label}</dt>
                          <dd className={cn('mt-0.5 font-semibold text-on-surface', label === 'Earnings' && 'text-tertiary-container')}>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="border-t border-outline-variant/60 px-2 py-1.5">
                      <RowActions course={course} onToggle={handleToggle} onDelete={setToDelete} busy={busyId === course.id} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete course"
        description={toDelete && `This permanently removes “${toDelete.title}” and all of its comments. Students who liked it will no longer see it. This can’t be undone.`}
        confirmLabel="Delete course"
        onConfirm={handleDelete}
      />
    </>
  )
}
