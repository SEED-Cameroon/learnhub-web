import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ExternalLink, ImageUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { getTutor, updateTutorProfile } from '@/services/tutors'
import { CATEGORIES } from '@/data/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/components/common/PageHeader'
import { ErrorState, Skeleton } from '@/components/common/States'
import Field, { FormBanner, Panel } from '@/components/studio/Field'
import ProfileHeaderPreview from '@/components/studio/ProfileHeaderPreview'
import { cn } from '@/lib/utils'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const BIO_MAX = 600

function ImageInput({ id, label, help, error, onSelect }) {
  return (
    <Field id={id} label={label} help={help} error={error} optional>
      {(p) => (
        <label
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant hover:border-primary focus-within:outline-2 focus-within:outline-surface-tint',
            error && 'border-error'
          )}
        >
          <ImageUp className="size-5 text-primary" aria-hidden="true" />
          <span>Choose an image</span>
          <input {...p} type="file" accept="image/*" className="sr-only" onChange={(e) => onSelect(e.target.files?.[0])} />
        </label>
      )}
    </Field>
  )
}

export default function TutorProfileEdit() {
  const { user } = useAuth()
  const { data: tutor, error, loading, reload } = useAsync(() => getTutor(user.id), [user?.id])

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ tone: 'error', text: '' })
  const [saving, setSaving] = useState(false)
  const objectUrls = useRef([])

  useEffect(() => {
    if (tutor) {
      setForm({
        name: tutor.name ?? '',
        headline: tutor.headline ?? '',
        subjects: tutor.subjects ?? [],
        city: tutor.city ?? '',
        bio: tutor.bio ?? '',
        avatarUrl: tutor.avatarUrl ?? null,
        bannerUrl: tutor.bannerUrl ?? null,
      })
    }
  }, [tutor])

  useEffect(() => () => objectUrls.current.forEach((u) => URL.revokeObjectURL(u)), [])

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((errs) => ({ ...errs, [field]: undefined }))
    setStatus({ tone: 'error', text: '' })
  }

  const toggleSubject = (subject) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject) ? f.subjects.filter((s) => s !== subject) : [...f.subjects, subject],
    }))
    setErrors((errs) => ({ ...errs, subjects: undefined }))
  }

  const pickImage = (field) => (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((errs) => ({ ...errs, [field]: 'Choose an image file (JPG, PNG or WebP).' }))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((errs) => ({ ...errs, [field]: 'That image is over 2 MB. Choose a smaller one.' }))
      return
    }
    const url = URL.createObjectURL(file)
    objectUrls.current.push(url)
    setForm((f) => ({ ...f, [field]: url, [`${field}File`]: file }))
    setErrors((errs) => ({ ...errs, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = {}
    if (!form.name.trim()) found.name = 'Add the name students will see.'
    if (!form.headline.trim()) found.headline = 'Add a short headline, like “Advanced Mathematics”.'
    if (form.subjects.length === 0) found.subjects = 'Choose at least one subject.'
    if (form.bio.length > BIO_MAX) found.bio = `Keep your bio under ${BIO_MAX} characters.`
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ tone: 'error', text: 'Fix the highlighted fields to save your profile.' })
      return
    }

    setSaving(true)
    setStatus({ tone: 'error', text: '' })
    try {
      // Image upload needs a backend endpoint; the files are kept on the form
      // (avatarUrlFile / bannerUrlFile) ready for a multipart request.
      const { avatarUrlFile: _a, bannerUrlFile: _b, ...changes } = form
      await updateTutorProfile(user.id, { ...changes, name: changes.name.trim(), headline: changes.headline.trim() })
      setStatus({ tone: 'success', text: 'Profile saved. Students now see these changes on your public page.' })
    } catch (err) {
      setStatus({ tone: 'error', text: `Your profile wasn’t saved: ${err?.message || 'try again.'}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Public profile"
        description="This is what students see on your tutor page."
        actions={
          <Button asChild variant="outline" className="h-auto rounded-full px-5 py-2.5">
            <Link to={`/tutors/${user?.id}`}>
              <ExternalLink aria-hidden="true" />
              View public page
            </Link>
          </Button>
        }
      />

      {loading && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]" role="status" aria-label="Loading">
          <Skeleton className="h-[560px] rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}
      {error && <ErrorState error={error} onRetry={reload} title="Your profile didn’t load" />}

      {form && (
        <form noValidate onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <Panel className="flex flex-col gap-6">
            <FormBanner tone={status.tone}>{status.text}</FormBanner>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Display name" error={errors.name}>
                {(p) => <Input {...p} value={form.name} onChange={set('name')} autoComplete="name" className="h-10" />}
              </Field>
              <Field id="city" label="City" optional>
                {(p) => <Input {...p} value={form.city} onChange={set('city')} placeholder="e.g. Douala" className="h-10" />}
              </Field>
            </div>

            <Field id="headline" label="Headline" error={errors.headline} help="One line under your name, like the subject you’re known for.">
              {(p) => <Input {...p} value={form.headline} onChange={set('headline')} maxLength={80} className="h-10" />}
            </Field>

            <fieldset aria-describedby={errors.subjects ? 'subjects-error' : 'subjects-help'}>
              <legend className="text-sm font-semibold text-on-surface">Subjects</legend>
              <p id="subjects-help" className="mt-1 text-sm text-on-surface-variant">Students filter tutors by these.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((subject) => {
                  const on = form.subjects.includes(subject)
                  return (
                    <button
                      key={subject}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleSubject(subject)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                        on
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'
                      )}
                    >
                      {on && <Check className="size-4" aria-hidden="true" />}
                      {subject}
                    </button>
                  )
                })}
              </div>
              {errors.subjects && (
                <p id="subjects-error" className="mt-2 text-sm font-medium text-error">
                  {errors.subjects}
                </p>
              )}
            </fieldset>

            <Field id="bio" label="Bio" error={errors.bio} help={`${form.bio.length} / ${BIO_MAX} characters`}>
              {(p) => <Textarea {...p} value={form.bio} onChange={set('bio')} rows={5} />}
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <ImageInput id="avatar" label="Profile photo" help="Square image, up to 2 MB." error={errors.avatarUrl} onSelect={pickImage('avatarUrl')} />
              <ImageInput id="banner" label="Banner" help="Wide image, up to 2 MB." error={errors.bannerUrl} onSelect={pickImage('bannerUrl')} />
            </div>

            <div className="flex justify-end border-t border-outline-variant/60 pt-6">
              <Button type="submit" disabled={saving} className="h-auto rounded-full px-6 py-2.5 shadow-none">
                {saving ? 'Saving profile…' : 'Save profile'}
              </Button>
            </div>
          </Panel>

          <aside className="flex flex-col gap-3 lg:sticky lg:top-6" aria-label="Preview">
            <h2 className="text-sm font-semibold text-on-surface">Preview</h2>
            <ProfileHeaderPreview profile={{ ...form, verified: tutor.verified, followersCount: tutor.followersCount }} />
          </aside>
        </form>
      )}
    </>
  )
}
