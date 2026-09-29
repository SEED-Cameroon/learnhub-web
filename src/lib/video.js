/** YouTube video id from watch, youtu.be, embed or shorts links; otherwise null. */
export function youtubeId(url = '') {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtu.be') return u.pathname.slice(1) || null
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const match = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/)
      return match ? match[2] : null
    }
  } catch {
    // not a URL
  }
  return null
}

/** Still image for a YouTube video, used as a thumbnail when none is uploaded. */
export const youtubeThumbnail = (url) => {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
}
