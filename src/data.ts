import { Tool, BlogPost, FAQItem, Testimonial } from './types';

export const TOOLS: Tool[] = [
  // Downloader Tools
  {
    id: 'pinterest',
    name: 'Pinterest Downloader',
    description: 'Download high-quality images and videos directly from Pinterest boards and pins legally.',
    category: 'downloader',
    icon: 'Pin',
    popular: true,
    trending: true,
    latest: false,
    slug: 'pinterest-downloader',
    metaTitle: 'Free Pinterest Downloader - Download Pinterest Pins & Videos',
    metaDescription: 'Extract and download high-quality images, GIFs, and videos from Pinterest. Simple, fast, and 100% free with copyright compliance guidelines.'
  },
  {
    id: 'instagram',
    name: 'Instagram Downloader',
    description: 'Fetch and view public Instagram photos and reels, with instructions on legal content saving.',
    category: 'downloader',
    icon: 'Instagram',
    popular: true,
    trending: false,
    latest: false,
    slug: 'instagram-downloader',
    metaTitle: 'Legally Save Public Instagram Content & Reels',
    metaDescription: 'Learn how to securely backup public Instagram reels and photos. View metadata and download public images with ease.'
  },
  {
    id: 'facebook',
    name: 'Facebook Video Downloader',
    description: 'Save and view public Facebook video content while adhering to creator licensing terms.',
    category: 'downloader',
    icon: 'Facebook',
    popular: false,
    trending: true,
    latest: false,
    slug: 'facebook-downloader',
    metaTitle: 'Public Facebook Video Link Extractor & Saver',
    metaDescription: 'Download your own or public-domain Facebook videos in standard definition. Fast processing with detailed licensing guidelines.'
  },
  {
    id: 'twitter',
    name: 'X (Twitter) Downloader',
    description: 'Retrieve public X/Twitter images and videos using safe, developer-compliant techniques.',
    category: 'downloader',
    icon: 'Twitter',
    popular: true,
    trending: false,
    latest: false,
    slug: 'x-twitter-downloader',
    metaTitle: 'Free X Video Downloader - Save Twitter Videos',
    metaDescription: 'Safe, easy-to-use tool to save high-quality media from X (Twitter). Learn about content usage policies and download securely.'
  },
  {
    id: 'reddit',
    name: 'Reddit Media Downloader',
    description: 'Extract public videos, GIFs, and image arrays from Reddit threads with audio synchrony.',
    category: 'downloader',
    icon: 'Reddit',
    popular: false,
    trending: true,
    latest: true,
    slug: 'reddit-downloader',
    metaTitle: 'Reddit Downloader - Download Reddit Videos with Audio',
    metaDescription: 'Easily save high-definition Reddit videos with audio tracks intact. Supports direct links and provides clear platform rules.'
  },
  {
    id: 'vimeo',
    name: 'Vimeo Video Downloader',
    description: 'Retrieve public, downloadable Vimeo videos and extracts detailed video metadata.',
    category: 'downloader',
    icon: 'Video',
    popular: false,
    trending: false,
    latest: false,
    slug: 'vimeo-downloader',
    metaTitle: 'Vimeo Video Downloader & Frame Extractor',
    metaDescription: 'Extract information and safe download options for public Vimeo videos. Respect creator permissions and access original resolutions.'
  },
  {
    id: 'dailymotion',
    name: 'Dailymotion Downloader',
    description: 'Export video metadata and stream resolutions for public Dailymotion videos.',
    category: 'downloader',
    icon: 'Tv',
    popular: false,
    trending: false,
    latest: true,
    slug: 'dailymotion-downloader',
    metaTitle: 'Free Dailymotion Video Info & Download Tool',
    metaDescription: 'Safe parsing for public Dailymotion streams. Check resolutions, extract thumbnail covers, and download compliant files.'
  },
  {
    id: 'image-downloader',
    name: 'Image Extractor',
    description: 'Extract and batch-download all images from any public webpage URL in seconds.',
    category: 'downloader',
    icon: 'Image',
    popular: true,
    trending: true,
    latest: true,
    slug: 'image-downloader',
    metaTitle: 'Webpage Image Extractor - Batch Download Images',
    metaDescription: 'Enter any website link and instantly scrape, preview, and download all host assets and images in compressed formats.'
  },
  {
    id: 'thumbnail-downloader',
    name: 'YouTube Thumbnail Saver',
    description: 'Retrieve HD YouTube and Vimeo thumbnail covers in maximum original resolution.',
    category: 'downloader',
    icon: 'Download',
    popular: true,
    trending: false,
    latest: false,
    slug: 'thumbnail-downloader',
    metaTitle: 'YouTube Thumbnail Downloader - Free HD cover saver',
    metaDescription: 'Grab high-definition (1080p, 720p, 480p) YouTube video thumbnail covers instantly. Simply paste the video link to download.'
  },

  // AI Tools
  {
    id: 'bg-remover',
    name: 'Background Eraser AI',
    description: 'AI-assisted and precise manual background remover for product images and portraits.',
    category: 'ai',
    icon: 'Eraser',
    popular: true,
    trending: true,
    latest: false,
    slug: 'background-remover',
    metaTitle: 'Free AI Background Remover - Transparent Image Generator',
    metaDescription: 'Remove image backgrounds automatically in one click or paint over sections manually. Fast, local canvas-based rendering with transparent exports.'
  },
  {
    id: 'upscaler',
    name: 'Image Upscaler & Sharpener',
    description: 'Enhance and upscale lower-resolution images with real-time digital filter restoration.',
    category: 'ai',
    icon: 'Maximize',
    popular: true,
    trending: false,
    latest: false,
    slug: 'image-upscaler',
    metaTitle: 'AI Image Upscaler - Increase Image Resolution',
    metaDescription: 'Upscale your photos by 2x or 4x without losing quality. Employs advanced sharpening and interpolation techniques.'
  },
  {
    id: 'compressor',
    name: 'Image Compressor',
    description: 'Reduce file size by up to 90% without visible quality loss. Instant comparison.',
    category: 'ai',
    icon: 'Minimize',
    popular: true,
    trending: true,
    latest: false,
    slug: 'image-compressor',
    metaTitle: 'Smart Image Compressor - Reduce Photo KB Size Online',
    metaDescription: 'Compress PNG, JPEG, and WebP images. Real-time file size estimation, adjustable quality slider, and bulk downloads.'
  },
  {
    id: 'converter',
    name: 'Image Format Converter',
    description: 'Convert pictures between PNG, JPG, WebP, and PDF locally and securely.',
    category: 'ai',
    icon: 'RefreshCw',
    popular: false,
    trending: false,
    latest: false,
    slug: 'image-converter',
    metaTitle: 'Free Image Converter - JPG, PNG, WebP, PDF',
    metaDescription: 'Fast, secure client-side image converter. Convert batches of files without uploading them to any external server.'
  },
  {
    id: 'qr-gen',
    name: 'Dynamic QR Code Generator',
    description: 'Design beautiful, customized QR codes with custom colors and logo spacing.',
    category: 'ai',
    icon: 'QrCode',
    popular: true,
    trending: true,
    latest: true,
    slug: 'qr-generator',
    metaTitle: 'Custom QR Code Generator - Free High-Res QR Creator',
    metaDescription: 'Create custom QR codes for websites, WiFi, contacts, or texts. Customize color gradients, add icons, and export as SVG/PNG.'
  },
  {
    id: 'text-qr',
    name: 'Text-to-QR Creator',
    description: 'Translate raw messages, documents, or encrypted tokens into standard QR grids.',
    category: 'ai',
    icon: 'FileText',
    popular: false,
    trending: false,
    latest: false,
    slug: 'text-to-qr',
    metaTitle: 'Free Text to QR Code Converter Online',
    metaDescription: 'Convert any text block, coupon code, or message into a scan-ready QR code in high definition. Perfect for tickets and labels.'
  },
  {
    id: 'pdf-conv',
    name: 'Interactive PDF Converter',
    description: 'Compile plain text, code, or images into professional, downloadable PDF books.',
    category: 'ai',
    icon: 'FileCode',
    popular: false,
    trending: false,
    latest: true,
    slug: 'pdf-converter',
    metaTitle: 'Free Text & Image to PDF Converter Online',
    metaDescription: 'Convert images, plain text, and markdown scripts directly into a clean, printable PDF document inside your browser.'
  },
  {
    id: 'word-counter',
    name: 'SEO Word Counter & Density',
    description: 'Track word count, reading times, readability index, and keyword density.',
    category: 'ai',
    icon: 'ListOrdered',
    popular: false,
    trending: false,
    latest: false,
    slug: 'word-counter',
    metaTitle: 'Professional Word Counter & Keyword Density Tool',
    metaDescription: 'Free online text counter. Analyze characters, words, sentences, reading time, and identify top-ranking keywords instantly.'
  },
  {
    id: 'password-gen',
    name: 'Secure Password Generator',
    description: 'Create mathematically random passwords with strict customizable entropy settings.',
    category: 'ai',
    icon: 'Lock',
    popular: false,
    trending: false,
    latest: false,
    slug: 'password-generator',
    metaTitle: 'Strong Password Generator - Secure Random Passwords',
    metaDescription: 'Create complex, unhackable passwords locally. Toggle uppercase, numbers, symbols, length, and evaluate crypt-strength.'
  },
  {
    id: 'palette-gen',
    name: 'AI Color Palette Generator',
    description: 'Generate beautiful aesthetic color palettes with Google Gemini AI assistance.',
    category: 'ai',
    icon: 'Palette',
    popular: true,
    trending: true,
    latest: true,
    slug: 'color-palette-generator',
    metaTitle: 'AI Color Palette Generator - Hex Themes Designer',
    metaDescription: 'Generate balanced color combinations. Uses Gemini AI to translate mood words into matching cohesive material palette hex-codes.'
  },
  {
    id: 'json-formatter',
    name: 'JSON Beautifier & AI Repair',
    description: 'Format, validate, minify, and automatically repair corrupted JSON via AI.',
    category: 'ai',
    icon: 'Code',
    popular: false,
    trending: false,
    latest: false,
    slug: 'json-formatter',
    metaTitle: 'JSON Formatter & AI Validator - Repair Malformed JSON',
    metaDescription: 'Validate and format raw JSON text. Integrates Gemini AI to diagnose syntax errors and automatically reconstruct corrupted structures.'
  },
  {
    id: 'seo-console',
    name: 'Google Search Console & SEO Webmaster Tool',
    description: 'Verify your Google Search Console ownership, add Google Analytics, examine sitemaps, and run real-time crawler SEO audits.',
    category: 'ai',
    icon: 'Activity',
    popular: true,
    trending: true,
    latest: true,
    slug: 'seo-console',
    metaTitle: 'Google Search Console Verification & SEO Webmaster Center',
    metaDescription: 'Claim Google Search Console ownership, deploy Google Analytics measurement tracking, and test search visibility scores in one unified workspace.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'A Guide to Digital Media Rights and Online Downloader Safety (2026)',
    slug: 'media-rights-downloader-safety',
    excerpt: 'Understanding licensing, copyright compliance, and secure local file backups when utilizing free online download tools.',
    publishedAt: 'July 24, 2026',
    category: 'Legal & Safety',
    tags: ['Fair Use', 'Copyright', 'Safety', 'Media Backups'],
    readingTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Alexander Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: 'Alexander is a media law expert and technical writer focusing on digital copyrights and online consumer tools.'
    },
    content: `
## Understanding Fair Use and Media Downloader Compliance

Free online download tools are powerful utilities for creators, students, and media archivists. However, utilizing these tools requires a clear understanding of intellectual property rights, platform policies, and digital ethics. This guide outlines how to browse and backup public content safely while strictly respecting licensing laws.

### 1. What is Fair Use?
In many jurisdictions, the doctrine of **Fair Use** permits the limited use of copyrighted material without acquiring permission from the rights holder. Common fair use scenarios include:
*   **Criticism & Commentary:** Quoting or utilizing small snippets in reviews.
*   **News Reporting:** Illustrating current events with relevant media.
*   **Educational Purpose:** Saving reference materials for research or class projects.
*   **Archival Preservation:** Keeping a personal backup of media that might get deleted.

### 2. General Rules of Thumb for Downloader Safety
When you need to download a video, image, or thumbnail, always keep these three golden rules in mind:
1.  **Do Not Redistribute:** Never sell, re-upload, or monetize downloaded media without authorization.
2.  **Credit the Creator:** If you reference public domain or creative commons files, always attribute the source.
3.  **Ensure Safety:** Only use trusted, client-side tools like DownloadHub AI that do not require third-party logins or suspicious extensions.

### 3. Staying Legally Safe
Most mainstream platforms (X, Reddit, Pinterest) allow creators to post public-facing links. Using public extracts to research, study, or archive information is generally considered safe. By adhering to digital compliance, you ensure that download tools remain a helpful, transparent aspect of the modern web ecosystem.
`
  },
  {
    id: 'blog-2',
    title: 'The AI Revolution in Everyday Web Tools',
    slug: 'ai-revolution-everyday-web-tools',
    excerpt: 'How client-side computation and LLMs are transforming simple utilities like converters and validators into smart tools.',
    publishedAt: 'June 18, 2026',
    category: 'Technology',
    tags: ['AI Utilities', 'Web Apps', 'Gemini AI', 'SaaS'],
    readingTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      bio: 'Elena is a Senior UI/UX Engineer specializing in AI integrations and performant responsive web apps.'
    },
    content: `
## Elevating Simple Tools with Deep AI Capabilities

For decades, online tools like word counters, color palettizers, and JSON formatters were static. They relied entirely on simple regex or local formulas. In 2026, the inclusion of server-side LLMs like **Google Gemini AI** has revolutionized these systems.

### 1. Smart Repair of Syntax
A typical JSON validator tells you *where* the comma is missing. An AI-powered formatter can parse the broken text, infer your structure, and **repair the JSON automatically**. This saves developers hours of manual troubleshooting.

### 2. Context-Aware Color Palette Generation
Instead of picking random colors on a wheel, designers can prompt Gemini with conceptual cues: *"give me a palette inspired by a quiet rainy evening in Kyoto"*. The AI translates emotional aesthetics into concrete hex codes that respect contrast rules.

### 3. Automated SEO Optimization
When scraping or converting images, generating appropriate alt-text has historically been skipped. Now, vision models can inspect raw visual base64 data, generate accurate descriptions, and export perfectly tailored alt-tags and image titles directly.

As full-stack technology matures, the line between lightweight tools and enterprise software continues to blur, democratizing high-quality technical assistance for everyone.
`
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Are online downloaders legal to use?',
    answer: 'Yes, downloaders are legally compliant tools when used for personal backup, research, criticism, or when downloading copyright-free, creative commons, or public-domain media. Users must always respect the creator\'s terms of service and avoid commercial redistribution of copyrighted material.'
  },
  {
    question: 'Do these tools upload my images to external servers?',
    answer: 'Most of our AI utility tools (like the Image Compressor, Format Converter, and PDF Builder) perform processing entirely client-side inside your browser canvas. Your sensitive visual assets never leave your computer, ensuring absolute privacy. AI-guided features (like background removal requests or JSON repairs) send data securely to our server via SSL and are not retained.'
  },
  {
    question: 'How does the AI Color Palette Generator work?',
    answer: 'Our palette generator connects securely to Google Gemini AI. When you input a mood or vibe (e.g. "cyberpunk Tokyo night" or "organic herbal cosmetic brand"), Gemini translates this semantic request into five beautifully coordinated hex colors, providing contrast ratios and design tips.'
  },
  {
    question: 'Is DownloadHub AI mobile-friendly?',
    answer: 'Absolutely. Every page and widget is crafted desktop-first for precision and mobile-first for flexible layouts. It is fully responsive, touch-friendly, and optimized as a Progressive Web App (PWA) so you can bookmark and run it from your smartphone home screen.'
  },
  {
    question: 'Can the JSON Formatter repair corrupt files?',
    answer: 'Yes! While normal formatters fail when a parenthesis or double-quote is missing, our built-in "AI Auto-Repair" sends the broken segment to Gemini. The model analyzes the syntax, rectifies the missing characters, and returns beautifully formatted, clean JSON.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Marcus Brody',
    role: 'Creative Director',
    company: 'PixelForge Studios',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    content: 'The Image Extractor and Compressor are staples of my daily workflow. What used to require complex software now takes two clicks inside a clean, high-contrast dashboard. The speed is phenomenal!'
  },
  {
    id: 'test-2',
    name: 'Sarah Jenkins',
    role: 'SEO Strategist',
    company: 'UpScale Growth',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    content: 'An incredible suite of SEO tools! The AI Color Palette and Word Counter with density analyses are best-in-class. Clean UI, extremely readable typography, and absolutely zero clichéd, slow templates.'
  },
  {
    id: 'test-3',
    name: 'Kenji Sato',
    role: 'Full-stack Educator',
    company: 'CodeCamp Global',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    content: 'My students use the PDF Converter and JSON Beautifier daily. The AI Auto-Repair function for JSON is like magic for beginners struggling with broken structures. 10/10 developer craft.'
  }
];
