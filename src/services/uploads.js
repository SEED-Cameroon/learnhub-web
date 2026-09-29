import { apiClient } from './apiClient'

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
export const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime'

/** Checks a picked file before uploading; returns an error message or ''. */
export function checkFile(file, kind) {
  const [accept, max, label] =
    kind === 'video' ? [VIDEO_ACCEPT, VIDEO_MAX_BYTES, '100 MB'] : [IMAGE_ACCEPT, IMAGE_MAX_BYTES, '2 MB']
  if (!accept.split(',').includes(file.type)) {
    return kind === 'video' ? 'Choose an MP4, WebM or MOV video.' : 'Choose a JPG, PNG, WebP or GIF image.'
  }
  if (file.size > max) return `This file is larger than ${label}. Choose a smaller one.`
  return ''
}

/** POST /uploads/image → the image's public URL. */
export async function uploadImage(file) {
  const data = await apiClient.upload('/uploads/image', file)
  return data.url
}

/** POST /uploads/video (tutors) → the video's public URL. */
export async function uploadVideo(file) {
  const data = await apiClient.upload('/uploads/video', file)
  return data.url
}
