// Public address of the site, used for canonical links, social previews and
// structured data. Set VITE_SITE_URL when the site moves to its own domain.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://learnhub-omega-one.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'LearnHub Cameroon'
export const DEFAULT_DESCRIPTION =
  'Free courses in coding, AI, business and languages from Cameroonian tutors. Follow the teachers who help you and support them with MTN Mobile Money or Orange Money.'
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`
