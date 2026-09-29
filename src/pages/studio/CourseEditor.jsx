import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Film, ImageUp, Loader2, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createCourse, getMyCourse, updateCourse } from '@/services/studio'
import { IMAGE_ACCEPT, VIDEO_ACCEPT, checkFile, uploadImage, uploadVideo } from '@/services/uploads'
import { CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/components/common/PageHeader'
import CourseCard from '@/components/common/CourseCard'
import StatusBadge from '@/components/common/StatusBadge'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import Field, { FormBanner, Panel, selectClass } from '@/components/studio/Field'

// The editor shows exactly the fields the API stores for a course.
const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  priceXaf: '0',
  thumbnailUrl: '',
  previewVideoUrl: '',
}

const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * A new course needs the title, description and category the API requires,
 * even as a draft; publishing also needs a valid price.
 */
function validate(form, intent, { isEdit }) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Add a course title.'
  else if (form.title.trim().length > 120) errors.title = 'Keep the title under 120 characters.'

  for (const field of ['thumbnailUrl', 'previewVideoUrl']) {
    if (form[field].trim() && !isHttpUrl(form[field].trim())) errors[field] = 'Enter a full web address starting with https://'
  }

  const needsBasics = intent === 'publish' || !isEdit
  if (needsBasics) {
    if (!form.description.trim()) errors.description = 'Add a description so students know what they’ll learn.'
    if (!form.category) errors.category = 'Choose a category.'
  }

  if (intent === 'publish') {
    const price = Number(form.priceXaf)
    if (form.priceXaf === '' || !Number.isInteger(price) || price < 0) errors.priceXaf = 'Enter a whole number of XAF, or 0 for a free course.'
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
    priceXaf: Number(form.priceXaf) || 0,
    thumbnailUrl: form.thumbnailUrl.trim(),
    previewVideoUrl: form.previewVideoUrl.trim(),
    status,
  }
}

/**
 * Thumbnail / preview video: upload a file (it goes up straight away and
 * fills in the URL) or paste a link to one hosted elsewhere.
 */
function MediaField({ id, kind, label, help, value, onChange, error, onError, onBusy }) {
  const [uploading, setUploading] = useState(false)
  const isVideo = kind === 'video'
  const Icon = isVideo ? Film : ImageUp

  const pick = async (file) => {
    if (!file) return
    const problem = checkFile(file, kind)
    if (problem) return onError(problem)
    onError(undefined)
    setUploading(true)
    onBusy(true)
    try {
      onChange(await (isVideo ? uploadVideo(file) : uploadImage(file)))
    } catch (err) {
      onError(err?.message || 'The upload didn’t finish. Try again.')
    } finally {
      setUploading(false)
      onBusy(false)
    }
  }

  return (
    <Field id={id} label={label} optional error={error} help={help}>
      {(p) => (
        <div className="flex flex-col gap-3">
          {value && !uploading && (
            <div className="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
              {isVideo ? (
                <video src={value} controls preload="metadata" className="aspect-video w-full bg-on-surface" />
              ) : (
                <img src={value} alt="Thumbnail preview" className="aspect-video w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label={`Remove ${isVideo ? 'video' : 'thumbnail'}`}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-on-surface/70 text-white hover:bg-on-surface"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
          <label
            className={
              'flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant hover:border-primary focus-within:outline-2 focus-within:outline-surface-tint' +
              (uploading ? ' pointer-events-none opacity-70' : '')
            }
          >
            {uploading ? <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" /> : <Icon className="size-5 text-primary" aria-hidden="true" />}
            <span aria-live="polite">
              {uploading
                ? isVideo
                  ? 'Uploading video… large files can take a few minutes'
                  : 'Uploading image…'
                : value
                  ? `Replace ${isVideo ? 'video' : 'image'}`
                  : `Upload ${isVideo ? 'a video (MP4, WebM or MOV, up to 100 MB)' : 'an image (JPG, PNG or WebP, up to 2 MB)'}`}
            </span>
            <input
              type="file"
              accept={isVideo ? VIDEO_ACCEPT : IMAGE_ACCEPT}
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                pick(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
          <Input
            {...p}
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste a link: https://"
            className="h-10"
            disabled={uploading}
          />
        </div>
      )}
    </Field>
  )
}

function EditorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]" role="status" aria-label="Loading">
      <Skeleton className="h-[520px] rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
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
  const [uploads, setUploads] = useState(0) // files still uploading
  const trackUpload = (busy) => setUploads((n) => Math.max(0, n + (busy ? 1 : -1)))
  const setField = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((errs) => ({ ...errs, [field]: undefined }))
  }
  const setFieldError = (field) => (message) => setErrors((errs) => ({ ...errs, [field]: message }))

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
          priceXaf: String(course.priceXaf ?? 0),
          thumbnailUrl: course.thumbnailUrl ?? '',
          previewVideoUrl: course.previewVideoUrl ?? '',
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
    if (uploads > 0) return
    const found = validate(form, intent, { isEdit })
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
    thumbnailUrl: isHttpUrl(form.thumbnailUrl.trim()) ? form.thumbnailUrl.trim() : '',
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

          <div className="grid gap-6 sm:grid-cols-2">
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
            <Field id="priceXaf" label="Price (XAF)" error={errors.priceXaf} help="0 makes the course free.">
              {(p) => <Input {...p} type="number" min="0" step="500" inputMode="numeric" value={form.priceXaf} onChange={set('priceXaf')} className="h-10" />}
            </Field>
          </div>

          <MediaField
            id="thumbnailUrl"
            kind="image"
            label="Thumbnail"
            help="A wide image (16:9). Leave empty to use the subject artwork."
            value={form.thumbnailUrl}
            onChange={setField('thumbnailUrl')}
            error={errors.thumbnailUrl}
            onError={setFieldError('thumbnailUrl')}
            onBusy={trackUpload}
          />
          <MediaField
            id="previewVideoUrl"
            kind="video"
            label="Preview video"
            help="Plays on the course page for every student."
            value={form.previewVideoUrl}
            onChange={setField('previewVideoUrl')}
            error={errors.previewVideoUrl}
            onError={setFieldError('previewVideoUrl')}
            onBusy={trackUpload}
          />

          <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/60 pt-6 sm:flex-row sm:justify-end">
            {uploads > 0 && <p className="self-center text-sm text-on-surface-variant sm:mr-auto">Wait for the upload to finish before saving.</p>}
            <Button type="button" variant="outline" className="h-auto rounded-full px-6 py-2.5" disabled={Boolean(pending) || uploads > 0} onClick={() => submit('draft')}>
              {pending === 'draft' ? 'Saving draft…' : 'Save draft'}
            </Button>
            <Button type="submit" className="h-auto rounded-full px-6 py-2.5 shadow-none" disabled={Boolean(pending) || uploads > 0}>
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
