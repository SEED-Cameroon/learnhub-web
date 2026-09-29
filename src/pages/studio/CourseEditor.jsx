import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createCourse, getMyCourse, updateCourse } from '@/services/studio'
import { CATEGORIES } from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/components/common/PageHeader'
import CourseCard from '@/components/common/CourseCard'
import StatusBadge from '@/components/common/StatusBadge'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import Field, { FormBanner, Panel, selectClass } from '@/components/studio/Field'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  level: 'Beginner',
  priceXaf: '0',
  lessons: [],
}

let lessonSeq = 0
const newLesson = () => ({ id: `new-${Date.now()}-${lessonSeq++}`, title: '', durationMin: '' })

/** Draft only needs a title; publishing needs everything a student will see. */
function validate(form, intent) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Add a course title.'
  else if (form.title.trim().length > 120) errors.title = 'Keep the title under 120 characters.'

  if (intent === 'publish') {
    if (!form.description.trim()) errors.description = 'Add a description so students know what they’ll learn.'
    if (!form.category) errors.category = 'Choose a category.'
    const price = Number(form.priceXaf)
    if (form.priceXaf === '' || !Number.isInteger(price) || price < 0) errors.priceXaf = 'Enter a whole number of XAF, or 0 for a free course.'
    if (form.lessons.length === 0) errors.lessons = 'Add at least one lesson before publishing.'
    form.lessons.forEach((lesson, i) => {
      if (!lesson.title.trim()) errors[`lesson-${i}`] = 'Give this lesson a title.'
    })
  } else if (form.priceXaf !== '' && (Number(form.priceXaf) < 0 || !Number.isInteger(Number(form.priceXaf)))) {
    errors.priceXaf = 'Enter a whole number of XAF, or 0 for a free course.'
  }
  return errors
}

function toPayload(form, status) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    level: form.level,
    priceXaf: Number(form.priceXaf) || 0,
    // Blank lesson rows are dropped; publishing already requires every lesson to have a title.
    lessons: form.lessons.filter((l) => l.title.trim()).map((l, i) => ({
      id: l.id.startsWith('new-') ? `l${i + 1}` : l.id,
      title: l.title.trim(),
      durationMin: Number(l.durationMin) || 0,
    })),
    status,
  }
}

function EditorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]" role="status" aria-label="Loading">
      <Skeleton className="h-[520px] rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}

function LessonsEditor({ lessons, errors, onChange }) {
  const update = (index, patch) => onChange(lessons.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  const move = (index, delta) => {
    const next = [...lessons]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    onChange(next)
  }

  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={errors.lessons ? 'lessons-error' : undefined}>
      <legend className="text-sm font-semibold text-on-surface">Lessons</legend>
      <p className="-mt-1 text-sm text-on-surface-variant">Students see lessons in this order.</p>

      {lessons.length > 0 && (
        <ol className="flex flex-col gap-2">
          {lessons.map((lesson, i) => (
            <li key={lesson.id} className="rounded-lg border border-outline-variant/70 bg-surface-container-low p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <span className="mt-2 w-6 shrink-0 text-sm font-semibold text-on-surface-variant" aria-hidden="true">
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <label htmlFor={`lesson-title-${lesson.id}`} className="sr-only">
                    Lesson {i + 1} title
                  </label>
                  <Input
                    id={`lesson-title-${lesson.id}`}
                    value={lesson.title}
                    placeholder="Lesson title"
                    onChange={(e) => update(i, { title: e.target.value })}
                    aria-invalid={errors[`lesson-${i}`] ? true : undefined}
                    aria-describedby={errors[`lesson-${i}`] ? `lesson-error-${lesson.id}` : undefined}
                    className="h-10 bg-surface-container-lowest"
                  />
                  {errors[`lesson-${i}`] && (
                    <p id={`lesson-error-${lesson.id}`} className="mt-1 text-sm font-medium text-error">
                      {errors[`lesson-${i}`]}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <label htmlFor={`lesson-min-${lesson.id}`} className="sr-only">
                    Lesson {i + 1} length in minutes
                  </label>
                  <Input
                    id={`lesson-min-${lesson.id}`}
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={lesson.durationMin}
                    placeholder="Min"
                    onChange={(e) => update(i, { durationMin: e.target.value })}
                    className="h-10 w-20 bg-surface-container-lowest"
                  />
                  <span className="mr-1 text-sm text-on-surface-variant">min</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move lesson ${i + 1} up`}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === lessons.length - 1} aria-label={`Move lesson ${i + 1} down`}>
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="text-error hover:text-error" onClick={() => onChange(lessons.filter((_, j) => j !== i))} aria-label={`Remove lesson ${i + 1}`}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Button type="button" variant="outline" className="self-start rounded-full" onClick={() => onChange([...lessons, newLesson()])}>
        <Plus aria-hidden="true" />
        Add lesson
      </Button>
      {errors.lessons && (
        <p id="lessons-error" className="text-sm font-medium text-error">
          {errors.lessons}
        </p>
      )}
    </fieldset>
  )
}

export default function CourseEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('draft')
  const [loadState, setLoadState] = useState({ loading: isEdit, error: null, attempt: 0 })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(null) // 'draft' | 'publish' | null

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setLoadState((s) => ({ ...s, loading: true, error: null }))
    getMyCourse(id)
      .then((course) => {
        if (cancelled) return
        setForm({
          title: course.title ?? '',
          description: course.description ?? '',
          category: course.category ?? '',
          level: course.level ?? 'Beginner',
          priceXaf: String(course.priceXaf ?? 0),
          lessons: (course.lessons ?? []).map((l) => ({ ...l, durationMin: String(l.durationMin ?? '') })),
        })
        setStatus(course.status ?? 'draft')
        setLoadState((s) => ({ ...s, loading: false }))
      })
      .catch((error) => !cancelled && setLoadState((s) => ({ ...s, loading: false, error })))
    return () => {
      cancelled = true
    }
  }, [id, isEdit, loadState.attempt])

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((errs) => ({ ...errs, [field]: undefined }))
  }

  const submit = async (intent) => {
    const found = validate(form, intent)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) {
      setFormError(intent === 'publish' ? 'Fix the highlighted fields to publish this course.' : 'Fix the highlighted fields to save this draft.')
      return
    }

    // Publishing or keeping a published course live; "Save draft" always unpublishes.
    const nextStatus = intent === 'publish' ? 'published' : 'draft'
    setPending(intent)
    try {
      const payload = toPayload(form, nextStatus)
      if (isEdit) await updateCourse(id, payload)
      else await createCourse(payload)
      navigate('/dashboard/courses')
    } catch (err) {
      setFormError(err?.fieldErrors ? 'Some fields need attention.' : `Your course wasn’t saved: ${err?.message || 'try again.'}`)
      if (err?.fieldErrors) setErrors(err.fieldErrors)
    } finally {
      setPending(null)
    }
  }

  const backLink = (
    <Link to="/dashboard/courses" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
      <ChevronLeft className="size-4" aria-hidden="true" />
      My courses
    </Link>
  )

  if (loadState.loading) return <>{backLink}<EditorSkeleton /></>

  if (loadState.error) {
    return (
      <>
        {backLink}
        {loadState.error.status === 404 ? (
          <EmptyState
            title="This course doesn’t exist"
            action={
              <Button asChild className="rounded-full shadow-none">
                <Link to="/dashboard/courses">Back to my courses</Link>
              </Button>
            }
          >
            It may have been deleted, or it belongs to another tutor.
          </EmptyState>
        ) : (
          <ErrorState error={loadState.error} onRetry={() => setLoadState((s) => ({ ...s, attempt: s.attempt + 1 }))} title="This course didn’t load" />
        )}
      </>
    )
  }

  const preview = {
    ...form,
    id: id ?? 'preview',
    title: form.title || 'Your course title',
    priceXaf: Number(form.priceXaf) || 0,
    lessons: form.lessons.map((l) => ({ ...l, durationMin: Number(l.durationMin) || 0 })),
    likesCount: 0,
    commentsCount: 0,
    tutor: { name: user?.name ?? 'You', avatarUrl: user?.avatarUrl },
  }

  return (
    <>
      {backLink}
      <PageHeader
        title={isEdit ? 'Edit course' : 'New course'}
        description={isEdit ? <span className="flex items-center gap-2">Current status <StatusBadge status={status} /></span> : 'Save a draft any time. Publishing makes it visible to every student.'}
      />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          submit('publish')
        }}
        className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start"
      >
        <Panel className="flex flex-col gap-6">
          <FormBanner>{formError}</FormBanner>

          <Field id="title" label="Title" error={errors.title}>
            {(p) => <Input {...p} value={form.title} onChange={set('title')} maxLength={140} placeholder="e.g. Calculus for GCE A Level" className="h-10" />}
          </Field>

          <Field id="description" label="Description" error={errors.description} help="What will students be able to do after this course?">
            {(p) => <Textarea {...p} value={form.description} onChange={set('description')} rows={5} />}
          </Field>

          <div className="grid gap-6 sm:grid-cols-3">
            <Field id="category" label="Category" error={errors.category}>
              {(p) => (
                <select {...p} value={form.category} onChange={set('category')} className={selectClass}>
                  <option value="">Choose…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field id="level" label="Level">
              {(p) => (
                <select {...p} value={form.level} onChange={set('level')} className={selectClass}>
                  {LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field id="priceXaf" label="Price (XAF)" error={errors.priceXaf} help="0 makes the course free.">
              {(p) => <Input {...p} type="number" min="0" step="500" inputMode="numeric" value={form.priceXaf} onChange={set('priceXaf')} className="h-10" />}
            </Field>
          </div>

          <LessonsEditor
            lessons={form.lessons}
            errors={errors}
            onChange={(lessons) => {
              setForm((f) => ({ ...f, lessons }))
              setErrors((errs) => ({ ...errs, lessons: undefined }))
            }}
          />

          <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/60 pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="h-auto rounded-full px-6 py-2.5" disabled={Boolean(pending)} onClick={() => submit('draft')}>
              {pending === 'draft' ? 'Saving draft…' : 'Save draft'}
            </Button>
            <Button type="submit" className="h-auto rounded-full px-6 py-2.5 shadow-none" disabled={Boolean(pending)}>
              {pending === 'publish' ? 'Publishing…' : status === 'published' ? 'Save and keep published' : 'Publish'}
            </Button>
          </div>
        </Panel>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-6" aria-label="Preview">
          <h2 className="text-sm font-semibold text-on-surface">How students will see it</h2>
          <div className="pointer-events-none" inert>
            <CourseCard course={preview} />
          </div>
        </aside>
      </form>
    </>
  )
}
