// Default site content — used to seed the database and as a graceful
// fallback when no database is reachable (the public site still renders).
// Everything here is editable from the admin panel once seeded.

export const DEFAULT_SETTINGS = {
  site_name: 'HPX.DEV',
  site_owner: 'Harmanpreet Singh',
  tagline: 'Design-led engineering studio',
  hero_kicker: 'Full-stack developer · Agency founder · Visual storyteller',
  hero_title: 'Software with a pulse.',
  hero_accent_word: 'pulse.',
  hero_copy:
    'I am Harmanpreet Singh — founder of HPX Studio. I build fast, deliberate digital products end-to-end: strategy, design, engineering and the monitoring that keeps them healthy long after launch.',
  statement:
    'I build products that feel fast, look intentional, and tell stories users remember.',
  availability: 'Available for new builds',
  contact_email: 'yournamepleaseplease@gmail.com',
  location_label: 'Punjab, India',
  location_coords: '31.9622° N, 75.6185° E',
  logo_url: '',
  logo_text: 'HPX.DEV',
  favicon_url: '',
  footer_note: 'Designed & engineered by HPX Studio. No templates were harmed.',
  // 'dark' | 'light' — starting theme for first-time visitors (they can toggle)
  default_theme: 'dark',

  // Page + section switches — flip any of these off from Admin → Settings.
  pages: {
    projects: true,
    blog: true,
    plans: true,
    contact: true,
  },
  sections: {
    hero: true,
    statement: true,
    stats: true,
    projects: true,
    tech: true,
    process: true,
    plans: true,
    testimonials: true,
    blog: true,
    faq: true,
    contact: true,
  },

  seo: {
    meta_title: 'Harmanpreet Singh — Full-Stack Developer & Studio Founder | HPX.DEV',
    meta_description:
      'HPX.DEV is the studio of Harmanpreet Singh — a full-stack developer building high-performance web and mobile products with design precision. Projects, engineering tips, and transparent plans.',
    keywords:
      'full-stack developer, web development studio, react developer, next.js, node.js, punjab india, hpx',
    og_image: '',
    twitter_handle: '',
    gtm_id: '',
    ga_id: '',
    custom_head: '',
    verification_google: '',
  },

  stats: [
    { value: '5+', label: 'Years shipping products' },
    { value: '30+', label: 'Projects delivered' },
    { value: '95+', label: 'Avg. Lighthouse score' },
    { value: '24/7', label: 'Uptime monitoring' },
  ],

  process: [
    {
      step: '01',
      title: 'Discover',
      copy: 'Every build starts with the "why". I map business goals to a technical roadmap before a single pixel moves.',
    },
    {
      step: '02',
      title: 'Design',
      copy: 'Wireframes to polished prototypes — interfaces where every pixel has a purpose, backed by real color theory.',
    },
    {
      step: '03',
      title: 'Build',
      copy: 'Clean architecture, type-safe code, production-hardened infrastructure. Engineered for real-world pressure.',
    },
    {
      step: '04',
      title: 'Launch & monitor',
      copy: 'Shipping is the midpoint. Health checks, speed audits and analytics keep every product accountable.',
    },
  ],
}

export const SEED_PROJECTS = [
  {
    slug: 'diet-n-health-tracker',
    title: 'Diet-N-Health Tracker',
    category: 'Mobile Application',
    description:
      'A comprehensive mobile health and nutrition tracking application with diet logging, health monitoring, and analytics built for offline-first mobile experiences.',
    content:
      '## The problem\n\nHealth apps assume a permanent connection. Rural users lose their data the moment the network drops.\n\n## The build\n\nAn offline-first architecture keeps every log local and syncs opportunistically. Recharts powers the visual analytics layer, Capacitor wraps it into a native Android experience, and Supabase handles auth + cloud sync.\n\n## Outcomes\n\n- Offline-first mobile app with a native Android experience\n- Comprehensive nutrition tracking with dietary filters\n- Real-time health data visualization and analytics',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'React Router', 'Capacitor', 'Recharts', 'LocalStorage', 'Supabase'],
    highlights: [
      'Offline-first mobile app with native Android experience',
      'Comprehensive nutrition tracking with dietary filters',
      'Real-time health data visualization and analytics',
    ],
    live_url: 'https://diet-n-health-tracker.vercel.app/',
    repo_url: '',
    featured: 1,
    sort_order: 1,
  },
  {
    slug: 'xp-player',
    title: 'XP-Player',
    category: 'Mobile Application',
    description:
      'A modern, feature-rich Android music player with YouTube integration, background playback, playlist management, and lock screen controls.',
    content:
      '## The problem\n\nMusic apps lock basic features behind subscriptions.\n\n## The build\n\nA React + Capacitor player that streams any YouTube video as audio through a custom proxy server and the Invidious API, with full background playback and lock-screen controls.\n\n## Outcomes\n\n- Plays any YouTube video as audio with background playback\n- Multiple themes and accent colors — a truly personal app\n- Shuffle, repeat and smart queue generation',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'Vite', 'Capacitor.js', 'Custom Proxy Server', 'Invidious API', 'YouTube API'],
    highlights: [
      'Can play any YouTube video as audio with background playback',
      'Multiple player themes and accent color options',
      'Multiple playback modes: shuffle, repeat, smart queue generation',
    ],
    live_url: 'https://xp-player.vercel.app/',
    repo_url: '',
    featured: 1,
    sort_order: 2,
  },
  {
    slug: 'multiplayer-games',
    title: 'Multiplayer Games',
    category: 'Game Development',
    description:
      'A collection of real-time multiplayer games including Tic-Tac-Toe, Bingo, and Dots and Boxes, playable across network with live gameplay synchronization. Self-hosted on a Raspberry Pi.',
    content:
      '## The build\n\nReal-time game state synchronization over network sockets, with low-latency move validation and turn management. Hosted on my own Raspberry Pi server.\n\n## Outcomes\n\n- Real-time game state sync across network players\n- Multiple game modes in a single platform\n- Low-latency move validation for seamless gameplay',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    tech: ['HTML', 'JavaScript', 'Batch Script', 'Network Sockets', 'Real-time Sync'],
    highlights: [
      'Real-time game state synchronization across network players',
      'Multiple game modes in single platform',
      'Low-latency move validation and turn management',
    ],
    live_url: '',
    repo_url: '',
    featured: 1,
    sort_order: 3,
  },
  {
    slug: 'lx-encrypted-chat',
    title: 'LX Encrypted Chat',
    category: 'Web Application',
    description:
      'Secure, encrypted messaging platform with friend request system, real-time status, image sharing, and end-to-end encryption for private communications. Self-hosted on a Raspberry Pi.',
    content:
      '## The build\n\nEnd-to-end AES encryption over Socket.io with persistent MariaDB storage, bcrypt-hashed credentials and a friend-request privacy gate.\n\n## Outcomes\n\n- End-to-end AES encryption for secure messaging\n- Friend request system to control privacy and access\n- Real-time chat with image sharing and persistent storage',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    tech: ['Node.js', 'Express', 'Socket.io', 'MariaDB', 'Crypto-JS', 'bcryptjs'],
    highlights: [
      'End-to-end AES encryption for secure messaging',
      'Friend request system to control privacy and access',
      'Real-time chat with image sharing and persistent storage',
    ],
    live_url: '',
    repo_url: '',
    featured: 1,
    sort_order: 4,
  },
  {
    slug: 'serp-erp',
    title: 'SERP',
    category: 'ERP System',
    description:
      'A custom ERP system for a major healthcare franchise provider, featuring sales tracking, CRM and dozens of modules that streamline daily operations.',
    content:
      '## The build\n\nA PHP + MySQL ERP with a Node.js service layer, integrated directly with Tally for real-time voucher reports and entries. Built for high reliability — this system runs critical business operations daily.\n\n## Outcomes\n\n- Integrated with Tally for real-time voucher report and entry\n- Vacant-area checks for franchise appointments\n- High-reliability architecture for critical business operations',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    tech: ['PHP', 'MySQL', 'Node.js', 'JavaScript', 'REST APIs', 'Bootstrap'],
    highlights: [
      'Integrated with Tally for real-time Voucher Report and Entry',
      'Checks for vacant areas for franchise appointments',
      'High reliability for critical business operations',
    ],
    live_url: '',
    repo_url: '',
    featured: 1,
    sort_order: 5,
  },
]

export const SEED_SKILLS = [
  { name: 'JavaScript', category: 'Languages', level: 95, sort_order: 1 },
  { name: 'TypeScript', category: 'Languages', level: 85, sort_order: 2 },
  { name: 'PHP', category: 'Languages', level: 88, sort_order: 3 },
  { name: 'SQL', category: 'Languages', level: 90, sort_order: 4 },
  { name: 'React', category: 'Frameworks', level: 95, sort_order: 5 },
  { name: 'Next.js', category: 'Frameworks', level: 88, sort_order: 6 },
  { name: 'Node.js', category: 'Frameworks', level: 90, sort_order: 7 },
  { name: 'GSAP', category: 'Frameworks', level: 80, sort_order: 8 },
  { name: 'Capacitor', category: 'Frameworks', level: 85, sort_order: 9 },
  { name: 'Android Studio', category: 'Tools', level: 75, sort_order: 10 },
  { name: 'Photoshop', category: 'Tools', level: 82, sort_order: 11 },
  { name: 'Lightroom', category: 'Tools', level: 85, sort_order: 12 },
  { name: 'Git & CI', category: 'Tools', level: 88, sort_order: 13 },
  { name: 'Claude', category: 'AI Workflow', level: 92, sort_order: 14 },
  { name: 'Copilot', category: 'AI Workflow', level: 85, sort_order: 15 },
]

export const SEED_PLANS = [
  {
    name: 'Launch',
    tagline: 'For personal brands & early startups',
    price: '499',
    currency: '$',
    period: 'one-time',
    features: [
      'Up to 5-page marketing site or portfolio',
      'Custom design — no templates, ever',
      '95+ Lighthouse performance target',
      'SEO foundation: meta, sitemap, schema',
      '2 revision rounds',
      '2 weeks of post-launch support',
    ],
    highlighted: 0,
    badge: '',
    cta_label: 'Start a Launch build',
    cta_link: '/contact?plan=launch',
    sort_order: 1,
    active: 1,
  },
  {
    name: 'Growth',
    tagline: 'For businesses that need an engine, not a brochure',
    price: '1,499',
    currency: '$',
    period: 'per project',
    features: [
      'Full web app or e-commerce build',
      'Custom CMS / admin panel',
      'Database design (MySQL or PostgreSQL)',
      'Analytics + uptime monitoring included',
      'Blog engine with full SEO tooling',
      '4 revision rounds',
      '60 days of post-launch support',
    ],
    highlighted: 1,
    badge: 'Most popular',
    cta_label: 'Plan a Growth build',
    cta_link: '/contact?plan=growth',
    sort_order: 2,
    active: 1,
  },
  {
    name: 'Scale',
    tagline: 'For products with real users and real stakes',
    price: 'Custom',
    currency: '',
    period: 'retainer',
    features: [
      'Dedicated development partnership',
      'Mobile apps (Android) + web platform',
      'ERP / CRM / internal tooling',
      'Performance & infrastructure audits',
      'Priority support with SLA',
      'Continuous monitoring & health reports',
    ],
    highlighted: 0,
    badge: '',
    cta_label: 'Talk about Scale',
    cta_link: '/contact?plan=scale',
    sort_order: 3,
    active: 1,
  },
]

export const SEED_POSTS = [
  {
    slug: 'offline-first-mindset',
    title: 'Ship faster with an offline-first mindset',
    excerpt:
      'Treating the network as an enhancement — not a requirement — changed how I architect every mobile app. Here is the exact pattern I use.',
    category: 'Engineering Tips',
    tags: ['mobile', 'architecture', 'performance'],
    cover_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    content:
      "The first version of my Diet-N-Health Tracker synced every tap to the cloud. It felt fine on office Wi-Fi and fell apart on a village 3G connection.\n\n## The mental flip\n\nStop asking *\"how do I sync this?\"* and start asking *\"why does this need a server at all?\"*\n\n1. **Local is the source of truth.** Every write lands in LocalStorage/SQLite first. The UI never waits on a network round-trip.\n2. **Sync is a background chore.** A queue drains whenever connectivity returns. Conflicts resolve with last-write-wins plus a changelog.\n3. **The server is a backup, not a boss.** Users can export their entire dataset at any time.\n\n## What you gain\n\n- Instant UI — every interaction is a local read\n- Zero data loss on flaky networks\n- A dramatically simpler error-handling story\n\nStart your next app as if the server does not exist. Add it back as a luxury.",
    status: 'published',
    featured: 1,
  },
  {
    slug: 'memorable-interface-color-theory',
    title: 'The color theory I use to make interfaces memorable',
    excerpt:
      'Most developer portfolios are blue. Memorability starts where convention ends — a practical system for picking a palette people can recall a week later.',
    category: 'Design',
    tags: ['design', 'color', 'branding'],
    cover_image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1200&q=80',
    content:
      "Ask someone to describe five developer portfolios they saw last month. They will describe one — the one that broke the blue-and-purple gradient mold.\n\n## The 60-30-10 rule, weaponized\n\n- **60% — a base with temperature.** Pure #000 is dead; pure #FFF is clinical. I use warm near-blacks (`#0C0B09`) or warm ivories. Temperature is felt before it is seen.\n- **30% — a neutral that agrees with the base.** Muted warm greys, never cool greys on a warm base.\n- **10% — one accent with a name.** If a user can name your accent (\"that amber site\"), you have won memorability. Two accents max, and the second only for state.\n\n## Contrast is non-negotiable\n\nEvery text/background pair must clear WCAG AA (4.5:1). Memorable never gets to mean unreadable.\n\n## Test for recall, not beauty\n\nShow someone the site for 10 seconds. A day later ask what color it was. If they answer instantly, ship it.",
    status: 'published',
    featured: 1,
  },
  {
    slug: 'lighthouse-95-react',
    title: 'Squeezing 95+ Lighthouse scores out of React apps',
    excerpt:
      'A checklist I run on every build before launch — the eight changes that reliably move a React app from the 70s into the high 90s.',
    category: 'Engineering Tips',
    tags: ['performance', 'react', 'seo'],
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    content:
      "Performance is a feature users feel in the first 100 milliseconds. Here is my pre-launch checklist:\n\n## The big eight\n\n1. **Render on the server.** SSR/SSG for anything a crawler or first paint needs.\n2. **Kill the waterfall.** Preload fonts, inline critical CSS, defer everything else.\n3. **Images: dimensions + lazy + modern formats.** Layout shift is the silent killer of CLS.\n4. **Split by route, not by component.** Over-splitting creates request storms.\n5. **Measure the main thread.** Any task over 50ms gets profiled — usually a JSON parse or a chart lib.\n6. **Cache with intent.** Static assets: 1 year immutable. HTML: revalidate.\n7. **Third-party scripts load last.** Analytics after `load`, chat widgets on interaction.\n8. **Test on a $100 phone with 3G throttling.** Your users do not have your laptop.\n\nRun this list and the high 90s stop being luck.",
    status: 'published',
    featured: 0,
  },
]

export const SEED_TESTIMONIALS = [
  {
    author: 'Operations Director',
    role: 'Healthcare Franchise Provider',
    company: 'SERP client',
    quote:
      'The ERP HPX built runs our daily operations — sales, CRM, Tally integration. It has been reliable through every peak season since launch.',
    rating: 5,
    sort_order: 1,
    active: 1,
  },
  {
    author: 'Startup Founder',
    role: 'Early-stage SaaS',
    company: '',
    quote:
      'Harmanpreet thinks like a product owner, not a contractor. He challenged half our spec and the product shipped better and earlier because of it.',
    rating: 5,
    sort_order: 2,
    active: 1,
  },
  {
    author: 'Agency Partner',
    role: 'Design Studio',
    company: '',
    quote:
      'We hand HPX the builds we cannot afford to get wrong. Fast, communicative, and the Lighthouse scores speak for themselves.',
    rating: 5,
    sort_order: 3,
    active: 1,
  },
]

export const SEED_FAQS = [
  {
    question: 'What does a typical project timeline look like?',
    answer:
      'A Launch-tier site ships in 2–3 weeks. Growth builds run 4–8 weeks depending on scope. You get a milestone schedule in week one and progress updates every few days — never radio silence.',
    sort_order: 1,
    active: 1,
  },
  {
    question: 'Do you work with clients outside India?',
    answer:
      'Yes — I work remotely with clients worldwide. Async-first communication with scheduled overlap calls keeps timezones from ever blocking progress.',
    sort_order: 2,
    active: 1,
  },
  {
    question: 'Who owns the code when the project ends?',
    answer:
      'You do. Full source code, database schema, deployment docs and admin credentials are handed over at launch. No lock-in, ever.',
    sort_order: 3,
    active: 1,
  },
  {
    question: 'What happens after launch?',
    answer:
      'Every plan includes a post-launch support window, and every build ships with uptime monitoring and analytics. For ongoing work, the Scale retainer covers continuous improvements and health reports.',
    sort_order: 4,
    active: 1,
  },
  {
    question: 'Can you take over an existing project?',
    answer:
      'Usually, yes. I start with a paid audit — code quality, performance, security — then give you an honest recommendation: refactor, rebuild, or walk away.',
    sort_order: 5,
    active: 1,
  },
]

export const SEED_SOCIALS = [
  { label: 'GitHub', url: 'https://github.com/hpx07', icon: 'github', sort_order: 1, active: 1 },
  { label: 'Email', url: 'mailto:yournamepleaseplease@gmail.com', icon: 'mail', sort_order: 2, active: 1 },
  { label: 'Location', url: 'https://www.google.com/maps?q=31.9502,75.6175', icon: 'map-pin', sort_order: 3, active: 1 },
]

export const SEED_MONITORS = [
  { name: 'Diet-N-Health Tracker', url: 'https://diet-n-health-tracker.vercel.app/', active: 1 },
  { name: 'XP-Player', url: 'https://xp-player.vercel.app/', active: 1 },
]
