import { useState } from 'react'
import { ArrowDown, ArrowUp, Film, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VIDEO_ACCEPT, checkFile, uploadVideo } from '@/services/uploads'
import { youtubeId } from '@/lib/video'

let nextId = 0
export const newLesson = () => ({ id: `new-${++nextId}`, title: '', summary: '', durationMin: '', videoUrl: '', videoCredit: '' })

const move = (list, from, to) => {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function LessonRow({ lesson, index, count, errors, onChange, onMove, onRemove, onBusy }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const field = (key) => `lesson-${lesson.id}-${key}`
  const set = (key) => (e) => onChange({ ...lesson, [key]: e.target.value })

  const pick = async (file) => {
    if (!file) return
    const problem = checkFile(file, 'video')
    if (problem) return setUploadError(problem)
    setUploadError('')
    setUploading(true)
    onBusy(true)
    try {
      onChange({ ...lesson, videoUrl: await uploadVideo(file), videoCredit: '' })
    } catch (err) {
      setUploadError(err?.message || 'The video didn’t upload. Try again.')
    } finally {
      setUploading(false)
      onBusy(false)
    }
  }

  const videoError = uploadError || errors?.videoUrl
  const isYouTube = Boolean(youtubeId(lesson.videoUrl))

  return (
    <li className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">{index + 1}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" aria-label={`Move lesson ${index + 1} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
            <ArrowUp />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label={`Move lesson ${index + 1} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
            <ArrowDown />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label={`Remove lesson ${index + 1}`} className="text-error hover:text-error" onClick={onRemove}>
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px]">
        <div>
          <label htmlFor={field('title')} className="text-sm font-medium text-on-surface">Lesson title</label>
          <Input
            id={field('title')}
            value={lesson.title}
            onChange={set('title')}
            maxLength={140}
            aria-invalid={Boolean(errors?.title)}
            aria-describedby={errors?.title ? `${field('title')}-error` : undefined}
            className="mt-1 h-10"
          />
          {errors?.title && <p id={`${field('title')}-error`} className="mt-1 text-sm text-error">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor={field('duration')} className="text-sm font-medium text-on-surface">Minutes</label>
          <Input id={field('duration')} type="number" min="0" inputMode="numeric" value={lesson.durationMin} onChange={set('durationMin')} className="mt-1 h-10" />
        </div>
      </div>

      <label htmlFor={field('summary')} className="mt-3 block text-sm font-medium text-on-surface">
        Summary <span className="font-normal text-on-surface-variant">(optional)</span>
      </label>
      <Textarea id={field('summary')} value={lesson.summary} onChange={set('summary')} rows={2} maxLength={600} className="mt-1" />

      <p className="mt-3 text-sm font-medium text-on-surface">Video</p>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <label className={'flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant hover:border-primary focus-within:outline-2 focus-within:outline-surface-tint' + (uploading ? ' pointer-events-none opacity-70' : '')}>
          {uploading ? <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" /> : <Film className="size-4 text-primary" aria-hidden="true" />}
          <span aria-live="polite">{uploading ? 'Uploading…' : 'Upload video'}</span>
          <input type="file" accept={VIDEO_ACCEPT} className="sr-only" disabled={uploading} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        <Input
          aria-label={`Lesson ${index + 1} video link`}
          type="url"
          inputMode="url"
          value={lesson.videoUrl}
          onChange={set('videoUrl')}
          placeholder="…or paste a YouTube or video link"
          disabled={uploading}
          aria-invalid={Boolean(videoError)}
          className="h-10"
        />
      </div>
      {videoError && <p className="mt-1 text-sm text-error">{videoError}</p>}
      {isYouTube && (
        <div className="mt-3">
          <label htmlFor={field('credit')} className="text-sm font-medium text-on-surface">Video credit</label>
          <Input id={field('credit')} value={lesson.videoCredit} onChange={set('videoCredit')} maxLength={120} placeholder="e.g. freeCodeCamp.org on YouTube" className="mt-1 h-10" />
          <p className="mt-1 text-xs text-on-surface-variant">If the video isn’t yours, name its creator. Students see this under the player.</p>
        </div>
      )}
    </li>
  )
}

/** Level, "What you'll learn" and the lesson list for a course. */
export default function OutlineEditor({ outcomes, lessons, errors, onOutcomes, onLessons, onBusy }) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-sm font-semibold text-on-surface">What students will learn</legend>
        <p className="text-xs text-on-surface-variant">Short points, one per line. Shown on the course page.</p>
        <Textarea
          aria-label="What students will learn, one point per line"
          value={outcomes.join('\n')}
          onChange={(e) => onOutcomes(e.target.value.split('\n'))}
          rows={4}
          className="mt-2"
          placeholder={'Explain what Git does\nCreate a repository and commit'}
        />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-on-surface">Lessons</legend>
        <p className="text-xs text-on-surface-variant">Students watch them in this order.</p>
        {lessons.length > 0 && (
          <ol className="mt-3 flex flex-col gap-3">
            {lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                count={lessons.length}
                errors={errors?.[lesson.id]}
                onBusy={onBusy}
                onChange={(next) => onLessons(lessons.map((l) => (l.id === lesson.id ? next : l)))}
                onMove={(to) => onLessons(move(lessons, i, to))}
                onRemove={() => onLessons(lessons.filter((l) => l.id !== lesson.id))}
              />
            ))}
          </ol>
        )}
        <Button type="button" variant="outline" className="mt-3 h-auto rounded-full px-5 py-2" onClick={() => onLessons([...lessons, newLesson()])}>
          <Plus aria-hidden="true" />
          Add lesson
        </Button>
      </fieldset>
    </div>
  )
}
