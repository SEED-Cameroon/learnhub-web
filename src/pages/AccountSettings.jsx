import { useEffect, useMemo, useRef, useState } from 'react'
import { useSeo } from '@/hooks/useSeo'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMe, updateMe } from '@/services/me'
import { IMAGE_ACCEPT, checkFile, uploadImage } from '@/services/uploads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import PageHeader from '@/components/common/PageHeader'
import FormField from '@/components/account/FormField'
import FormStatus from '@/components/account/FormStatus'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BIO_MAX = 280

const inputClass = 'h-11 bg-surface-container-lowest'

function Section({ title, description, children }) {
  return (
    <section className="grid gap-6 rounded-xl bg-surface-container-lowest p-6 elevation-1 md:grid-cols-[220px_1fr] md:p-8">
      <div>
        <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  )
}

function ProfileForm() {
  const { user, login } = useAuth()
  const [values, setValues] = useState({ name: user?.name ?? '', email: user?.email ?? '', bio: user?.bio ?? '' })
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const fileRef = useRef(null)

  // Local preview until the profile is saved; the file is uploaded on save.
  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])
  const photoUrl = previewUrl ?? user?.avatarUrl

  // The stored session may be missing the bio or photo; fetch the full profile.
  useEffect(() => {
    let cancelled = false
    getMe()
      .then((me) => {
        if (cancelled) return
        setValues((v) => ({ ...v, bio: v.bio || me.bio || '' }))
        if (me.avatarUrl && me.avatarUrl !== user?.avatarUrl) login({ ...user, avatarUrl: me.avatarUrl })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }))

  const onPhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const problem = checkFile(file, 'image')
    if (problem) {
      setErrors((e) => ({ ...e, photo: problem }))
    } else {
      setErrors((e) => ({ ...e, photo: undefined }))
      setPhoto(file)
    }
    event.target.value = ''
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Enter your name.'
    if (!EMAIL_PATTERN.test(values.email)) next.email = 'Enter an email address like name@example.com.'
    if (values.bio.length > BIO_MAX) next.bio = `Keep your bio under ${BIO_MAX} characters.`
    setErrors((e) => ({ photo: e.photo, ...next }))
    if (Object.keys(next).length) return

    setStatus({ state: 'pending', message: '' })
    try {
      let avatarUrl
      if (photo) {
        setStatus({ state: 'pending', message: 'Uploading photo…' })
        try {
          avatarUrl = await uploadImage(photo)
        } catch (err) {
          setErrors((e) => ({ ...e, photo: err?.message || 'The photo didn’t upload. Try again.' }))
          setStatus({ state: 'error', message: 'Your profile wasn’t saved because the photo didn’t upload.' })
          return
        }
      }
      const updated = await updateMe({
        name: values.name.trim(),
        email: values.email.trim(),
        bio: values.bio.trim(),
        ...(avatarUrl && { avatarUrl }),
      })
      login({ ...user, ...updated })
      setPhoto(null)
      setStatus({ state: 'success', message: 'Profile saved.' })
    } catch (err) {
      if (err?.status === 409) {
        setErrors((e) => ({ ...e, email: 'Another account already uses this email.' }))
        setStatus({ state: 'error', message: 'Your profile wasn’t saved. Use a different email.' })
      } else {
        setStatus({ state: 'error', message: err?.message || 'Your profile wasn’t saved. Try again.' })
      }
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <Avatar name={values.name || user?.name} src={photoUrl} size="lg" />
        <div className="flex flex-col gap-2">
          <input ref={fileRef} id="photo" type="file" accept={IMAGE_ACCEPT} className="sr-only" onChange={onPhoto} aria-describedby="photo-help" />
          <Button type="button" variant="outline" className="h-auto self-start rounded-full px-4 py-2" onClick={() => fileRef.current?.click()}>
            <Camera aria-hidden="true" />
            Change photo
          </Button>
          <p id="photo-help" className={errors.photo ? 'text-sm text-error' : 'text-sm text-on-surface-variant'}>
            {errors.photo || (photo ? 'New photo selected. Save your profile to keep it.' : 'JPG, PNG or WebP, up to 2 MB.')}
          </p>
        </div>
      </div>

      <FormField id="name" label="Full name" error={errors.name}>
        {(p) => <Input {...p} value={values.name} onChange={set('name')} autoComplete="name" className={inputClass} />}
      </FormField>

      <FormField id="email" label="Email" error={errors.email}>
        {(p) => <Input {...p} type="email" value={values.email} onChange={set('email')} autoComplete="email" className={inputClass} />}
      </FormField>

      <FormField id="bio" label="Bio" hint={`${values.bio.length}/${BIO_MAX} characters. Shown on comments you post.`} error={errors.bio}>
        {(p) => <Textarea {...p} value={values.bio} onChange={set('bio')} rows={4} className="bg-surface-container-lowest" />}
      </FormField>

      <FormStatus status={status.state} message={status.message} />

      <Button type="submit" disabled={status.state === 'pending'} className="h-auto self-start rounded-full px-6 py-2.5 shadow-none">
        {status.state === 'pending' ? status.message || 'Saving…' : 'Save profile'}
      </Button>
    </form>
  )
}

function PasswordForm() {
  const empty = { currentPassword: '', newPassword: '', confirm: '' }
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!values.currentPassword) next.currentPassword = 'Enter your current password.'
    if (values.newPassword.length < 8) next.newPassword = 'Use at least 8 characters.'
    if (values.confirm !== values.newPassword) next.confirm = 'This doesn’t match the new password.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus({ state: 'pending', message: '' })
    try {
      await updateMe({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      setValues(empty)
      setStatus({ state: 'success', message: 'Password changed.' })
    } catch (err) {
      if (err?.status === 400 && /current password/i.test(err.message ?? '')) {
        setErrors({ currentPassword: 'Current password is incorrect.' })
        setStatus({ state: 'error', message: 'Your password wasn’t changed. Check your current password.' })
      } else {
        setStatus({ state: 'error', message: err?.message || 'Your password wasn’t changed. Try again.' })
      }
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="currentPassword" label="Current password" error={errors.currentPassword}>
        {(p) => <Input {...p} type="password" value={values.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" className={inputClass} />}
      </FormField>
      <FormField id="newPassword" label="New password" hint="At least 8 characters." error={errors.newPassword}>
        {(p) => <Input {...p} type="password" value={values.newPassword} onChange={set('newPassword')} autoComplete="new-password" className={inputClass} />}
      </FormField>
      <FormField id="confirm" label="Confirm new password" error={errors.confirm}>
        {(p) => <Input {...p} type="password" value={values.confirm} onChange={set('confirm')} autoComplete="new-password" className={inputClass} />}
      </FormField>

      <FormStatus status={status.state} message={status.message} />

      <Button type="submit" disabled={status.state === 'pending'} className="h-auto self-start rounded-full px-6 py-2.5 shadow-none">
        {status.state === 'pending' ? 'Changing…' : 'Change password'}
      </Button>
    </form>
  )
}

export default function AccountSettings() {
  useSeo({ title: 'Settings', noindex: true })
  return (
    <Container className="py-10 md:py-12">
      <Link to="/account" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to my account
      </Link>
      <PageHeader title="Settings" description="Update how you appear on LearnHub and how you sign in." />

      <div className="flex max-w-4xl flex-col gap-6">
        <Section title="Profile" description="Your name and photo appear on comments and on tutors’ supporter lists.">
          <ProfileForm />
        </Section>
        <Section title="Password" description="You’ll need your current password to set a new one.">
          <PasswordForm />
        </Section>
      </div>
    </Container>
  )
}
