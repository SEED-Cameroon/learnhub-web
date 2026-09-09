// Replace with data fetched from your API / CMS.
// Kept here so page components stay pure UI.
// Content oriented around the Cameroon GCE (O-Level & A-Level) secondary school syllabus.
//
// Video note: youtubeId points to real, subject-matched Cameroon GCE tutorial videos on
// YouTube (embedded via <iframe>, not hosted by us). Swap these for your own recorded
// lessons once you have them — just replace youtubeId with your own video's ID, or add
// a videoUrl (direct file/CDN link) instead and the player will use that if present.

export const CATEGORIES = ["All", "Sciences", "Languages", "Arts & Humanities", "ICT & Business"];

export const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export const MOCK_COURSES = [
  {
    id: "gce-alevel-physics-mechanics",
    title: "GCE A-Level Physics: Mechanics & Waves",
    tutor: "Mr. Fru Divine",
    category: "Sciences",
    priceFcfa: 12000,
    likes: 980,
    durationLabel: "6h 20m",
    badge: "Bestseller",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
  },
  {
    id: "gce-olevel-mathematics",
    title: "GCE O-Level Mathematics: Full Syllabus Revision",
    tutor: "Mme. Ngo Bibiane",
    category: "Sciences",
    priceFcfa: 10000,
    likes: 1540,
    durationLabel: "12h 45m",
    badge: "Bestseller",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
  },
  {
    id: "olevel-chemistry-organic",
    title: "O-Level Chemistry: Atomic Structure & Organic Chemistry",
    tutor: "Dr. Ashu Tabe",
    category: "Sciences",
    priceFcfa: 9000,
    likes: 610,
    durationLabel: "5h 10m",
    badge: "New",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400",
  },
  {
    id: "english-language-composition",
    title: "English Language: Essay & Comprehension",
    tutor: "Mrs. Enow Comfort",
    category: "Languages",
    priceFcfa: 7000,
    likes: 890,
    durationLabel: "4h 30m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
  },
  {
    id: "francais-grammaire-2nd",
    title: "Français : Grammaire et Expression Écrite",
    tutor: "M. Talla Joseph",
    category: "Languages",
    priceFcfa: 7000,
    likes: 405,
    durationLabel: "3h 50m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  },
  {
    id: "literature-in-english-set-books",
    title: "Literature in English: GCE Set Books Analysis",
    tutor: "Mr. Nkeng Solomon",
    category: "Arts & Humanities",
    priceFcfa: 8000,
    likes: 322,
    durationLabel: "7h 15m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  },
  {
    id: "history-cameroon-independence",
    title: "History: Cameroon's Path to Independence & Reunification",
    tutor: "Mme. Atem Grace",
    category: "Arts & Humanities",
    priceFcfa: 6000,
    likes: 275,
    durationLabel: "3h 05m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
  },
  {
    id: "ict-computer-science-olevel",
    title: "Computer Science O-Level: Programming Fundamentals",
    tutor: "Mr. Ebot Kingsley",
    category: "ICT & Business",
    priceFcfa: 11000,
    likes: 1120,
    durationLabel: "9h 40m",
    badge: "New",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
  },
  {
    id: "economics-alevel-basics",
    title: "Economics: Micro & Macro Foundations",
    tutor: "Mr. Njoya Aboubakar",
    category: "ICT & Business",
    priceFcfa: 9500,
    likes: 500,
    durationLabel: "6h 00m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
  },
  {
    id: "biology-olevel-human-systems",
    title: "O-Level Biology: Human Body Systems",
    tutor: "Dr. Mballa Estelle",
    category: "Sciences",
    priceFcfa: 8500,
    likes: 730,
    durationLabel: "5h 55m",
    badge: null,
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400",
  },
];

// Full detail record per course, keyed by id — each course now has its own video,
// description, key learnings, content list and comments (previously every course
// reused the same single Physics fixture).
export const COURSE_DETAILS = {
  "gce-alevel-physics-mechanics": {
    id: "gce-alevel-physics-mechanics",
    title: "GCE A-Level Physics: Mechanics & Waves",
    category: "Sciences",
    level: "Advanced Level",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800",
    youtubeId: "Ja2BjOfL5iA",
    tutor: { id: "fru-divine", name: "Mr. Fru Divine", verified: true, students: "3.2k", followerCount: 1984 },
    likes: 980,
    description: [
      "This module covers the Mechanics and Waves component of the GCE Advanced Level Physics syllabus, worked through using real past GCE questions.",
      "By the end of this session, you'll be comfortable tackling structured calculation questions that regularly appear in the GCE Physics paper.",
    ],
    keyLearnings: [
      "Applying Newton's laws to solve structured GCE mechanics problems.",
      "Understanding wave properties: reflection, refraction, and interference.",
      "Working through past-paper calculation questions step-by-step.",
    ],
    content: [
      { id: "l1", title: "GCE June 2023 Q4a: Advanced Level Physics", duration: "12:40", status: "playing" },
      { id: "l2", title: "Past Paper Walkthrough: Mechanics Questions", duration: "22:10", status: "up_next" },
    ],
    comments: [
      { id: "c1", author: "Achiri N.", timeAgo: "2 days ago", body: "This finally made simple harmonic motion click for me! Please can you do circular motion next?", likes: 18 },
    ],
  },

  "gce-olevel-mathematics": {
    id: "gce-olevel-mathematics",
    title: "GCE O-Level Mathematics: Full Syllabus Revision",
    category: "Sciences",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
    youtubeId: "AXQz0WXFXsU",
    tutor: { id: "ngo-bibiane", name: "Mme. Ngo Bibiane", verified: true, students: "6.1k", followerCount: 3782 },
    likes: 1540,
    description: [
      "A full walkthrough of the GCE O-Level Mathematics Paper 2, June 2024, question by question — with the same mark scheme layout used by GCE examiners.",
      "Great for identifying exactly where marks are gained or lost in structured questions.",
    ],
    keyLearnings: [
      "Structuring full working for maximum method marks.",
      "Common traps in algebra and geometry questions.",
      "Time allocation strategy across a full paper.",
    ],
    content: [
      { id: "l1", title: "GCE O-Level Maths Paper 2 — June 2024", duration: "38:20", status: "playing" },
      { id: "l2", title: "GCE O-Level Maths Paper 1 — June 2017", duration: "24:05", status: "up_next" },
    ],
    comments: [
      { id: "c1", author: "Divine T.", timeAgo: "1 week ago", body: "Please post the O-Level Additional Maths paper next, this format really helps.", likes: 31 },
    ],
  },

  "olevel-chemistry-organic": {
    id: "olevel-chemistry-organic",
    title: "O-Level Chemistry: Atomic Structure & Organic Chemistry",
    category: "Sciences",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800",
    youtubeId: "nmtkesICq0Q",
    tutor: { id: "ashu-tabe", name: "Dr. Ashu Tabe", verified: true, students: "2.4k", followerCount: 1488 },
    likes: 610,
    description: [
      "A revision-focused session on Atomic Structure — one of the most frequently examined topics in GCE O-Level Chemistry.",
      "We build up from basic particle theory to answering full structured questions.",
    ],
    keyLearnings: [
      "Electron configuration and the periodic table.",
      "Isotopes, mass number, and atomic number calculations.",
      "Linking atomic structure to bonding in later topics.",
    ],
    content: [
      { id: "l1", title: "O-Level Chemistry Revision: Atomic Structure", duration: "15:50", status: "playing" },
      { id: "l2", title: "June 2024 Paper 2 Walkthrough", duration: "19:30", status: "up_next" },
    ],
    comments: [
      { id: "c1", author: "Larissa K.", timeAgo: "3 days ago", body: "Can we get a session specifically on the mole concept next?", likes: 12 },
    ],
  },

  "english-language-composition": {
    id: "english-language-composition",
    title: "English Language: Essay & Comprehension",
    category: "Languages",
    level: "Ordinary & Advanced Level",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
    youtubeId: "vuhoi2uFacE",
    tutor: { id: "enow-comfort", name: "Mrs. Enow Comfort", verified: true, students: "4.7k", followerCount: 2914 },
    likes: 890,
    description: [
      "A practical breakdown of how to answer any Essay and Comprehension question in the English Language paper, with a repeatable structure you can apply under exam conditions.",
    ],
    keyLearnings: [
      "Planning a composition in under 10 minutes.",
      "Structuring paragraphs for maximum content and expression marks.",
      "Answering comprehension questions in your own words.",
    ],
    content: [
      { id: "l1", title: "Essay & Comprehension: Full Strategy", duration: "16:45", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Blessing A.", timeAgo: "4 days ago", body: "The paragraph structure tip alone raised my mock score. Thank you!", likes: 27 },
    ],
  },

  "francais-grammaire-2nd": {
    id: "francais-grammaire-2nd",
    title: "Français : Grammaire et Expression Écrite",
    category: "Languages",
    level: "Special Bilingual Education",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    youtubeId: "_q2o7Mi76z0",
    tutor: { id: "talla-joseph", name: "M. Talla Joseph", verified: true, students: "1.1k", followerCount: 682 },
    likes: 405,
    description: [
      "Correction guidée du GCE Special Bilingual Education French (0546), avec un accent sur la grammaire et l'expression écrite.",
    ],
    keyLearnings: [
      "Accord des adjectifs et des participes passés.",
      "Structurer une réponse écrite claire et correcte.",
      "Éviter les erreurs fréquentes des candidats au GCE.",
    ],
    content: [
      { id: "l1", title: "Correction GCE O-Level French 0546", duration: "20:15", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Ariane M.", timeAgo: "5 days ago", body: "Merci, j'avais justement du mal avec les accords !", likes: 9 },
    ],
  },

  "literature-in-english-set-books": {
    id: "literature-in-english-set-books",
    title: "Literature in English: GCE Set Books Analysis",
    category: "Arts & Humanities",
    level: "Advanced Level",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    youtubeId: "A4RnSnr8-Jo",
    tutor: { id: "nkeng-solomon", name: "Mr. Nkeng Solomon", verified: true, students: "1.8k", followerCount: 1116 },
    likes: 322,
    description: [
      "A guided look at how to analyse prescribed texts for the GCE Advanced Level Literature in English paper, covering theme, character, and structure.",
    ],
    keyLearnings: [
      "Building a strong thesis for essay questions on set texts.",
      "Using textual evidence effectively under exam conditions.",
      "Comparing themes across prescribed texts.",
    ],
    content: [
      { id: "l1", title: "GCE A-Level English Language & Literature Overview", duration: "18:30", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Fomum L.", timeAgo: "6 days ago", body: "Could you cover 'And Palm-Wine Will Flow' in a future session?", likes: 14 },
    ],
  },

  "history-cameroon-independence": {
    id: "history-cameroon-independence",
    title: "History: Cameroon's Path to Independence & Reunification",
    category: "Arts & Humanities",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
    youtubeId: "kKHmWr65C1k",
    tutor: { id: "atem-grace", name: "Mme. Atem Grace", verified: true, students: "950", followerCount: 589 },
    likes: 275,
    description: [
      "A narrative walkthrough of Cameroon's journey from German colony through British and French administration to independence and reunification in 1961.",
    ],
    keyLearnings: [
      "Key events from 1884 to 1961.",
      "The role of the UPC and the reunification plebiscite.",
      "Connecting historical events to present-day national identity.",
    ],
    content: [
      { id: "l1", title: "Cameroon's Independence: Untold Stories", duration: "14:20", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Ngum P.", timeAgo: "1 week ago", body: "This explains the Foumban Conference better than my textbook does!", likes: 21 },
    ],
  },

  "ict-computer-science-olevel": {
    id: "ict-computer-science-olevel",
    title: "Computer Science O-Level: Programming Fundamentals",
    category: "ICT & Business",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    youtubeId: "VP87S26kMJU",
    tutor: { id: "ebot-kingsley", name: "Mr. Ebot Kingsley", verified: true, students: "3.9k", followerCount: 2418 },
    likes: 1120,
    description: [
      "A complete walkthrough of the GCE O-Level Computer Science Paper 3 practical, covering programming logic and structured problem solving.",
    ],
    keyLearnings: [
      "Reading and tracing pseudocode/flowcharts.",
      "Structuring an algorithm before writing code.",
      "Common GCE Paper 3 question patterns.",
    ],
    content: [
      { id: "l1", title: "GCE Computer Science Paper 3 — Full Solution", duration: "26:00", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Yannick B.", timeAgo: "3 days ago", body: "Finally understand flowchart tracing questions, thank you!", likes: 16 },
    ],
  },

  "economics-alevel-basics": {
    id: "economics-alevel-basics",
    title: "Economics: Micro & Macro Foundations",
    category: "ICT & Business",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    youtubeId: "BVIPv96c49U",
    tutor: { id: "njoya-aboubakar", name: "Mr. Njoya Aboubakar", verified: true, students: "1.4k", followerCount: 868 },
    likes: 500,
    description: [
      "A revision session covering GCE Ordinary Level Economics Paper 1, working through past questions relevant to Cameroon and other GCE syllabuses.",
    ],
    keyLearnings: [
      "Core micro and macroeconomic definitions examiners expect.",
      "Answering multiple-choice questions efficiently.",
      "Linking economic theory to real-world examples.",
    ],
    content: [
      { id: "l1", title: "GCE O-Level Economics Paper 1 Revision", duration: "17:40", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Aicha N.", timeAgo: "2 days ago", body: "Please do a macroeconomics-focused session next!", likes: 8 },
    ],
  },

  "biology-olevel-human-systems": {
    id: "biology-olevel-human-systems",
    title: "O-Level Biology: Human Body Systems",
    category: "Sciences",
    level: "Ordinary Level",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
    youtubeId: "9bSdI9PczUo",
    tutor: { id: "mballa-estelle", name: "Dr. Mballa Estelle", verified: true, students: "2.2k", followerCount: 1364 },
    likes: 730,
    description: [
      "Guided corrections for GCE Biology Advanced Level Paper 1 questions, with a focus on how to structure full-mark answers on body systems.",
    ],
    keyLearnings: [
      "Labelling and describing key organ systems.",
      "Answering 'describe the sequence of events' questions fully.",
      "Distinguishing frequently confused terms (e.g. tendon vs ligament).",
    ],
    content: [
      { id: "l1", title: "GCE Biology Advanced Level Paper 1 — Solutions", duration: "21:10", status: "playing" },
    ],
    comments: [
      { id: "c1", author: "Cedric F.", timeAgo: "5 days ago", body: "The mitosis vs meiosis table really helped, thanks!", likes: 19 },
    ],
  },
};

// Fallback used only if a course id has no matching detail record.
export const MOCK_COURSE = COURSE_DETAILS["gce-alevel-physics-mechanics"];

export function formatPrice(fcfa) {
  return fcfa === 0 ? "Free" : `FCFA ${fcfa.toLocaleString()}`;
}

// Flat, de-duplicated list of tutors pulled from COURSE_DETAILS — used by the
// Support Tutor flow's tutor selector. Swap for a real /tutors API once available.
export const MOCK_TUTORS = Object.values(COURSE_DETAILS).map((c) => ({
  id: c.tutor.id,
  name: c.tutor.name,
  subject: c.category,
  courseTitle: c.title,
  avatarUrl: null,
}));