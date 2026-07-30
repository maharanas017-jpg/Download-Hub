import React, { useState, useEffect } from 'react';
import {
  Search, Sparkles, ArrowLeft, BookOpen, HelpCircle, Heart, Mail, FileText,
  Shield, Clock, User, Share2, ExternalLink, Code, Award, Activity,
  TrendingUp, Layers, Compass, DollarSign, Check, CheckCircle, Download,
  Upload, MessageSquare, ChevronDown, ChevronUp, Copy, BookOpenCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Static Data
import { Tool, BlogPost, FAQItem, Testimonial } from './types';
import { TOOLS, BLOG_POSTS, FAQS, TESTIMONIALS } from './data';

// Custom Subcomponents
import QrGenerator from './components/tools/QrGenerator';
import WordCounter from './components/tools/WordCounter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import ColorPaletteGenerator from './components/tools/ColorPaletteGenerator';
import JsonFormatter from './components/tools/JsonFormatter';
import ImageTools from './components/tools/ImageTools';
import VideoDownloaders from './components/tools/VideoDownloaders';
import PdfConverter from './components/tools/PdfConverter';
import SeoConsole from './components/tools/SeoConsole';

export default function App() {
  // Navigation State
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [activeLegal, setActiveLegal] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'downloader' | 'ai'>('all');
  const [filterTag, setFilterTag] = useState<'all' | 'popular' | 'trending' | 'latest'>('all');

  // Interactive local states
  const [blogComments, setBlogComments] = useState<Record<string, Array<{ author: string; text: string; date: string }>>>({});
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Live Simulated Metrics State (Analytics)
  const [liveSessions, setLiveSessions] = useState(128);
  const [totalDownloads, setTotalDownloads] = useState(94210);
  const [serverLoad, setServerLoad] = useState(14);

  // Core Web Vitals simulated telemetry
  useEffect(() => {
    const sessionInterval = setInterval(() => {
      setLiveSessions(prev => Math.max(80, prev + Math.floor(Math.random() * 9) - 4));
      setServerLoad(prev => Math.max(5, Math.min(95, prev + Math.floor(Math.random() * 5) - 2)));
    }, 4000);

    const downloadsInterval = setInterval(() => {
      setTotalDownloads(prev => prev + Math.floor(Math.random() * 3));
    }, 2500);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(downloadsInterval);
    };
  }, []);

  // SEO & Schema.org Dynamic Metadata Injection
  useEffect(() => {
    let title = 'DownloadHub AI - All-in-One Online Downloader & Smart AI Utilities';
    let desc = 'The fastest, privacy-first SaaS utility suite for instant image compression, video savers, custom QR code styling, and AI-enabled diagnostics.';

    if (activeTool) {
      title = `${activeTool.metaTitle} | DownloadHub AI`;
      desc = activeTool.metaDescription;
    } else if (activeBlog) {
      title = `${activeBlog.title} | DownloadHub Blog`;
      desc = activeBlog.excerpt;
    } else if (activeLegal) {
      title = `${activeLegal.toUpperCase().replace('-', ' ')} Policy | DownloadHub AI`;
      desc = `Official legal documentation regarding DownloadHub AI ${activeLegal} terms and compliant usage.`;
    }

    document.title = title;

    // 1. Dynamic Description Meta tag
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', desc);

    // 2. Dynamic Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // 3. Dynamic Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', desc);

    // 4. Dynamic Canonical Link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const pageSlug = activeTool ? `/tools/${activeTool.slug}` : activeBlog ? `/blog/${activeBlog.slug}` : activeLegal ? `/${activeLegal}` : '';
    canonicalLink.setAttribute('href', window.location.origin + pageSlug);

    // 5. Dynamic Google Search Console claim tag
    const storedGsc = localStorage.getItem('downloadhub_gsc_token');
    let gscMeta = document.querySelector('meta[name="google-site-verification"]');
    if (storedGsc && storedGsc.trim()) {
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', storedGsc.trim());
    } else if (gscMeta) {
      gscMeta.remove();
    }

    // Inject Schema.org JSON-LD dynamically
    let existingSchema = document.getElementById('downloadhub-schema');
    if (existingSchema) existingSchema.remove();

    const schemaObj = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://downloadhub-ai.com/#organization",
          "name": "DownloadHub AI",
          "url": "https://downloadhub-ai.com",
          "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
        },
        {
          "@type": "WebSite",
          "@id": "https://downloadhub-ai.com/#website",
          "url": "https://downloadhub-ai.com",
          "name": "DownloadHub AI",
          "description": desc,
          "publisher": { "@id": "https://downloadhub-ai.com/#organization" },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://downloadhub-ai.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'downloadhub-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObj);
    document.head.appendChild(script);

  }, [activeTool, activeBlog, activeLegal]);

  // Handle newsletter signup
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent, slug: string) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    const newComment = {
      author: commentAuthor,
      text: commentText,
      date: 'Just now'
    };

    setBlogComments(prev => ({
      ...prev,
      [slug]: [newComment, ...(prev[slug] || [])]
    }));

    setCommentAuthor('');
    setCommentText('');
  };

  // Filter tools based on query & selected tag
  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    let matchesTag = true;
    if (filterTag === 'popular') matchesTag = !!tool.popular;
    else if (filterTag === 'trending') matchesTag = !!tool.trending;
    else if (filterTag === 'latest') matchesTag = !!tool.latest;

    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* 1. Header Navigation bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              setActiveTool(null);
              setActiveBlog(null);
              setActiveLegal(null);
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">DownloadHub</span>
              <span className="text-xs font-bold text-blue-600 ml-1 bg-blue-50 px-1.5 py-0.5 rounded-md">AI</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <button 
              onClick={() => { setActiveTool(null); setActiveBlog(null); setActiveLegal(null); }}
              className="hover:text-slate-900 transition-colors"
              id="nav-link-tools"
            >
              All Tools
            </button>
            <button 
              onClick={() => { setActiveTool(null); setActiveBlog(BLOG_POSTS[0]); setActiveLegal(null); }}
              className="hover:text-slate-900 transition-colors"
              id="nav-link-blog"
            >
              Compliant Guide
            </button>
            <button 
              onClick={() => { setActiveTool(null); setActiveBlog(null); setActiveLegal('about'); }}
              className="hover:text-slate-900 transition-colors"
              id="nav-link-about"
            >
              About Us
            </button>
            <button 
              onClick={() => { setActiveTool(null); setActiveBlog(null); setActiveLegal('contact'); }}
              className="hover:text-slate-900 transition-colors"
              id="nav-link-contact"
            >
              Contact
            </button>
          </nav>

          {/* Core Web Vitals Status indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Lighthouse Score: 99+</span>
            </div>
            
            <button
              onClick={() => {
                // Instantly open image compressor as showcase
                const comp = TOOLS.find(t => t.id === 'compressor');
                if (comp) setActiveTool(comp);
              }}
              className="flex items-center gap-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm shadow-blue-500/10"
              id="quick-start-cta"
            >
              Quick Compress
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-12">

        <AnimatePresence mode="wait">
          
          {/* A. If viewing specific tool */}
          {activeTool ? (
            <motion.div
              key={`tool-${activeTool.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Tool Navigation Breadcrumbs */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTool(null)}
                  className="flex items-center gap-2 py-1.5 px-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition shadow-sm"
                  id="tool-back-btn"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveTool(null)}>Home</span>
                  <span>/</span>
                  <span className="capitalize">{activeTool.category} Utilities</span>
                  <span>/</span>
                  <span className="font-semibold text-slate-600">{activeTool.name}</span>
                </div>
              </div>

              {/* Title & SEO Description Block */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="py-1 px-2.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase rounded-full tracking-wider select-none">
                      {activeTool.category} Suite
                    </span>
                    {activeTool.popular && (
                      <span className="py-1 px-2.5 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase rounded-full tracking-wider select-none">
                        High Demand
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeTool.name}</h1>
                  <p className="text-sm text-slate-500 max-w-2xl">{activeTool.description}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('SEO-optimized shareable page link copied to clipboard!');
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition"
                    title="Share Page"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamically Render selected Tool */}
              <div id="dynamic-tool-render-area">
                {activeTool.id === 'qr-gen' || activeTool.id === 'text-qr' ? <QrGenerator /> : null}
                {activeTool.id === 'word-counter' ? <WordCounter /> : null}
                {activeTool.id === 'password-gen' ? <PasswordGenerator /> : null}
                {activeTool.id === 'palette-gen' ? <ColorPaletteGenerator /> : null}
                {activeTool.id === 'json-formatter' ? <JsonFormatter /> : null}
                {activeTool.id === 'pdf-conv' ? <PdfConverter /> : null}
                {activeTool.id === 'seo-console' ? <SeoConsole /> : null}
                
                {['compressor', 'converter', 'upscaler', 'bg-remover'].includes(activeTool.id) ? (
                  <ImageTools initialMode={activeTool.id as any} />
                ) : null}

                {['pinterest', 'instagram', 'facebook', 'twitter', 'reddit', 'vimeo', 'dailymotion', 'thumbnail-downloader', 'image-downloader'].includes(activeTool.id) ? (
                  <VideoDownloaders toolId={activeTool.id} />
                ) : null}
              </div>

              {/* Monetization Banner slot under active workspace */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-center text-slate-400 text-xs font-bold relative overflow-hidden flex flex-col justify-center min-h-[90px]">
                <div className="absolute top-1.5 left-2 bg-slate-200/50 px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-extrabold">Sponsored Placement</div>
                <p className="text-slate-600 text-sm mb-1">Premium Hosting and Fast Servers are supported by our partners</p>
                <p className="text-[10px] text-blue-500 hover:underline cursor-pointer">Adsterra Premium Partner Hub — Advertise with Us</p>
              </div>

              {/* Related Tools navigation in footer of workspace */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider">Related Product Utilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TOOLS.filter(t => t.category === activeTool.category && t.id !== activeTool.id).slice(0, 3).map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:border-blue-400 transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold text-blue-600 block mb-1 group-hover:underline">{tool.name}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeBlog ? (
            
            /* B. If viewing specific Blog post */
            <motion.div
              key={`blog-${activeBlog.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Breadcrumb & post */}
              <div className="lg:col-span-2 space-y-6">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="flex items-center gap-2 py-1.5 px-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition shadow-sm mb-2"
                  id="blog-back-btn"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="space-y-4">
                  <span className="py-1 px-2.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase rounded-full tracking-wider">
                    {activeBlog.category}
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{activeBlog.title}</h1>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeBlog.readingTime}</span>
                    <span>•</span>
                    <span>{activeBlog.publishedAt}</span>
                  </div>

                  <img src={activeBlog.coverImage} alt={activeBlog.title} className="w-full h-80 object-cover rounded-xl shadow-sm border border-slate-100" />
                </div>

                {/* Blog core markdown text */}
                <article className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                  {activeBlog.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-bold text-slate-900 pt-3 border-b border-slate-100 pb-1">{para.replace('## ', '')}</h2>;
                    }
                    if (para.startsWith('### ')) {
                      return <h3 key={i} className="text-sm font-bold text-slate-800 pt-2">{para.replace('### ', '')}</h3>;
                    }
                    if (para.startsWith('* ')) {
                      return (
                        <div key={i} className="pl-4 space-y-1">
                          {para.split('\n').map((li, idx) => (
                            <p key={idx} className="list-item list-disc text-xs text-slate-600 font-medium">
                              {li.replace('* ', '')}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return <p key={i} className="leading-relaxed">{para}</p>;
                  })}
                </article>

                {/* Local Blog Comments system */}
                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Discussion Comments</h3>
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={(e) => handleCommentSubmit(e, activeBlog.slug)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Your Name"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        required
                        id="blog-comment-author"
                      />
                    </div>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Share your thoughts or questions about compliance rules..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      id="blog-comment-body"
                    />
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Post Comment
                    </button>
                  </form>

                  {/* Comments lists */}
                  <div className="space-y-4 pt-3">
                    {!(blogComments[activeBlog.slug]?.length) ? (
                      <p className="text-xs text-slate-400 italic">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                      <div className="space-y-3.5">
                        {blogComments[activeBlog.slug].map((cmt, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed space-y-1">
                            <div className="flex justify-between font-bold text-slate-800">
                              <span>{cmt.author}</span>
                              <span className="font-medium text-slate-400 text-[10px]">{cmt.date}</span>
                            </div>
                            <p className="text-slate-600">{cmt.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right author sidebar */}
              <div className="space-y-6">
                {/* Author profile */}
                <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm text-center space-y-3">
                  <img src={activeBlog.author.avatar} alt={activeBlog.author.name} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-blue-100" />
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">{activeBlog.author.name}</h4>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Verified Publisher</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{activeBlog.author.bio}</p>
                </div>

                {/* Related tool tip */}
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm space-y-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Recommended Tool
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">Ensure absolute compliance when scanning web assets with our Webpage Scraper utility.</p>
                  <button
                    onClick={() => {
                      const t = TOOLS.find(x => x.id === 'image-downloader');
                      if (t) setActiveTool(t);
                    }}
                    className="w-full py-2 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-slate-50 transition"
                  >
                    Open Image Extractor
                  </button>
                </div>
              </div>
            </motion.div>
          ) : activeLegal ? (
            
            /* C. If viewing specific Legal Page */
            <motion.div
              key={`legal-${activeLegal}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <button
                onClick={() => setActiveLegal(null)}
                className="flex items-center gap-2 py-1.5 px-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition shadow-sm"
                id="legal-back-btn"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm space-y-6 text-slate-700 leading-relaxed text-xs">
                
                {activeLegal === 'about' && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-tight">About DownloadHub AI</h1>
                    <p>Welcome to <strong>DownloadHub AI</strong>, a premium, unified digital workstation crafted in 2026. We are passionate engineers, SEO specialists, and designers committed to delivering robust, light-speed, and secure offline-first utilities for creators around the world.</p>
                    <p>We champion <strong>user privacy</strong>. Over 90% of our computational processing (including image compression, canvas formatting, PDF generation, and password calculations) executes directly inside your browser cache. Your photos never leave your device.</p>
                    <h3 className="font-bold text-slate-900 text-sm pt-2">Our Mission</h3>
                    <p>To demystify tech workflows, replace bulky premium installations with single-view, accessibility-ready web tools, and empower digital users with legally compliant, ethical internet tools.</p>
                  </div>
                )}

                {activeLegal === 'contact' && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-tight">Contact Customer Relations</h1>
                    <p>Have an improvement suggestion, bug report, or DMCA compliance query? Our team is active 24/7 to support you.</p>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry successfully routed to helpdesk! We will respond within 4 hours.'); }} className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                          <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                          <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subject Matter</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs">
                          <option>Technical Support</option>
                          <option>API Partnerships</option>
                          <option>DMCA Compliance & Copyright</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Message Description</label>
                        <textarea required className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs min-h-[120px] focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow transition">
                        Dispatch Message
                      </button>
                    </form>
                  </div>
                )}

                {activeLegal === 'privacy' && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-tight">Privacy Policy</h1>
                    <p>At DownloadHub AI, accessible from downloadhub-ai.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by DownloadHub AI and how we use it.</p>
                    <p><strong>Log Files:</strong> DownloadHub AI follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
                    <p><strong>Local Execution:</strong> Your photos, images, text files, and code structures parsed by our converters remain in your device cache. We do not transmit or copy your media files to external host cloud environments.</p>
                  </div>
                )}

                {activeLegal === 'terms' && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-tight">Terms and Conditions</h1>
                    <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use DownloadHub AI if you do not agree to take all of the terms and conditions stated on this page.</p>
                    <p><strong>Usage License:</strong> Permission is granted to temporarily use our tools for personal, non-commercial transitory viewing or media conversion workflows. You must not: redistributes media without author approval, abuse API endpoints, or conduct load attacks on our networks.</p>
                  </div>
                )}

                {activeLegal === 'dmca' && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-tight">DMCA Compliance & Takedown</h1>
                    <p>DownloadHub AI respects the intellectual property rights of creators and operates fully under the guidelines of the Digital Millennium Copyright Act (DMCA).</p>
                    <p>Our systems do not host, store, or cache media files. Our services act purely as immediate, real-time client-side converters and scrapers of publicly accessible web components. If you believe your copyrighted content has been queried or parsed in violation of your rights, please submit a written takedown notice to our relations team at <strong>legal@downloadhub-ai.com</strong> including licensing proof and exact URLs.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            
            /* D. MAIN DASHBOARD HOME */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 animate-fade-in"
            >
              {/* Real-time platform analytics header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Global Live Hits</span>
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-800 text-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>{liveSessions} Users</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Serviced</span>
                  <span className="font-extrabold text-slate-800 text-lg">{totalDownloads.toLocaleString()} Hits</span>
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Node Server CPU</span>
                  <span className="font-extrabold text-slate-800 text-lg">{serverLoad}% Load</span>
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">SSL Integrity</span>
                  <span className="font-extrabold text-emerald-600 text-lg flex items-center gap-1">
                    <Shield className="w-4 h-4" /> SECURE
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Search & Category Filter Section */}
              <div className="text-center space-y-6 py-6 border-b border-slate-100">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
                    Professional, Unified Downloader &amp; AI Utilities
                  </h1>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Instantly compress images, generate custom QR codes, analyze document density, or save media backups safely. Privacy-first, browser-executed algorithms.
                  </p>
                </div>

                {/* Main search bar */}
                <div className="max-w-xl mx-auto relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-5 h-5 group-hover:text-blue-600 transition" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-slate-400"
                    placeholder="Search across all 20+ micro-tools..."
                    id="dashboard-search-input"
                  />
                </div>

                {/* Grid categories button filter */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { id: 'all', label: 'All Utilities', icon: Compass },
                    { id: 'downloader', label: 'Downloaders', icon: Download },
                    { id: 'ai', label: 'AI Studio', icon: Sparkles }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as any)}
                        className={`flex items-center gap-2 py-2 px-4 rounded-full font-bold text-xs border transition ${
                          selectedCategory === cat.id
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                        id={`cat-filter-${cat.id}`}
                      >
                        <CatIcon className="w-3.5 h-3.5" /> {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tag filters (Popular, Trending, Latest) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Tools Directory</span>
                <div className="flex gap-2 text-xs font-semibold text-slate-500">
                  {['all', 'popular', 'trending', 'latest'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(tag as any)}
                      className={`hover:text-slate-800 border-b-2 px-1 pb-1 transition ${
                        filterTag === tag ? 'border-blue-600 text-slate-900 font-bold' : 'border-transparent'
                      }`}
                      id={`tag-filter-${tag}`}
                    >
                      {tag.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Micro Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="tools-grid-list">
                {filteredTools.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-400 italic text-sm">
                    No matching micro-tools found for "{searchQuery}". Try searching for 'Compress' or 'QR'.
                  </div>
                ) : (
                  filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
                      id={`tool-card-${tool.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 bg-slate-50 border border-slate-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Sparkles className="w-4.5 h-4.5" />
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {tool.popular && (
                              <span className="py-0.5 px-2 bg-amber-50 text-amber-700 font-bold text-[8px] uppercase tracking-wider rounded-md">
                                POPULAR
                              </span>
                            )}
                            {tool.trending && (
                              <span className="py-0.5 px-2 bg-emerald-50 text-emerald-700 font-bold text-[8px] uppercase tracking-wider rounded-md">
                                TRENDING
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600">{tool.name}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tool.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] font-bold text-blue-600">
                        <span className="uppercase tracking-wider">{tool.category} utility</span>
                        <span className="flex items-center gap-1 hover:underline">Open Workspace &rarr;</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Integrated Blog Highlights */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Technical Creator Guides</h2>
                    <p className="text-xs text-slate-400">Essential reading on copyright safety, fair use, and compression benchmarks.</p>
                  </div>
                  <button
                    onClick={() => setActiveBlog(BLOG_POSTS[0])}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                    id="blog-view-all-cta"
                  >
                    View Blog <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {BLOG_POSTS.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setActiveBlog(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-400 shadow-sm transition flex flex-col sm:flex-row cursor-pointer"
                      id={`blog-card-${post.id}`}
                    >
                      <img src={post.coverImage} alt={post.title} className="w-full sm:w-44 h-36 object-cover" />
                      <div className="p-4 flex flex-col justify-between space-y-2 flex-1">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">{post.category}</span>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-2 hover:text-blue-600 transition leading-snug">{post.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                          <span>{post.publishedAt}</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured collateral material: FAQs Section */}
              <div className="space-y-6 pt-6 border-t border-slate-100" id="faqs-accordion-container">
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Frequently Answered Queries</h2>
                  <p className="text-xs text-slate-400">Everything you need to know about safety, privacy-standards, and image tools.</p>
                </div>

                <div className="max-w-3xl mx-auto border border-slate-100 rounded-xl bg-white divide-y divide-slate-100 shadow-sm">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="space-y-2 p-4">
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-xs font-extrabold text-slate-800 hover:text-blue-600 transition"
                        id={`faq-btn-${idx}`}
                      >
                        <span>{faq.question}</span>
                        {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {expandedFaq === idx && (
                        <p className="text-xs text-slate-500 leading-relaxed pt-1" id={`faq-answer-${idx}`}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators / Testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                {TESTIMONIALS.map(item => (
                  <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 text-xs">
                    <p className="text-slate-500 italic leading-relaxed">"{item.content}"</p>
                    <div className="flex items-center gap-2.5">
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-blue-50" />
                      <div>
                        <p className="font-extrabold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.role} at {item.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Monetization Placeholder - High CPM Responsive Foot Ads Block */}
      <div className="bg-slate-100 border-y border-slate-200/60 py-6 text-center text-xs font-bold text-slate-400 space-y-1 mt-12 relative overflow-hidden" id="sticky-footer-ad-spot">
        <div className="absolute top-1 right-2 bg-slate-200/50 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">Premium Ad Placement</div>
        <p className="text-slate-600">Promoted Offer: High-Speed VPN with Military-grade Encryption - 82% Off today!</p>
        <p className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer">Support our server stack by visiting sponsors</p>
      </div>

      {/* 4. Sticky footer newsletter and detailed sitemap indexes */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800" id="main-app-footer">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">DownloadHub AI</span>
            </div>
            <p className="leading-relaxed text-slate-500">Fast, offline-first digital utility dashboard. Compress photos, generate bespoke QR codes, analyze copywriting keywords, and download safely.</p>
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500" /> AES-256 Web Cache Security Enabled
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Popular Downloaders</h4>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'pinterest'); if (t) setActiveTool(t); }} className="hover:text-white transition">Pinterest Video Downloader</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'instagram'); if (t) setActiveTool(t); }} className="hover:text-white transition">Instagram Reel Extractor</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'twitter'); if (t) setActiveTool(t); }} className="hover:text-white transition">X/Twitter Media Downloader</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'image-downloader'); if (t) setActiveTool(t); }} className="hover:text-white transition">Webpage Image Scraper</button></li>
            </ul>
          </div>

          {/* Popular AI Utilities */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">AI Studio</h4>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'compressor'); if (t) setActiveTool(t); }} className="hover:text-white transition">Lossless Image Compressor</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'palette-gen'); if (t) setActiveTool(t); }} className="hover:text-white transition">Gemini Color Palette Generator</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'json-formatter'); if (t) setActiveTool(t); }} className="hover:text-white transition">AI JSON Validator & Repair</button></li>
              <li><button onClick={() => { const t = TOOLS.find(x => x.id === 'qr-gen'); if (t) setActiveTool(t); }} className="hover:text-white transition">Dynamic Custom QR Creator</button></li>
            </ul>
          </div>

          {/* Newsletter signup form */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Newsletter Digest</h4>
            <p className="text-slate-500 leading-relaxed">Subscribe to receive monthly security logs, performance micro-tips, and product updates.</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                required
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
                id="newsletter-email-field"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded shadow transition">
                Join
              </button>
            </form>
            {newsletterSuccess && (
              <p className="text-emerald-400 font-semibold text-[10px] animate-fade-in">Successfully subscribed to newsletters!</p>
            )}
          </div>
        </div>

        {/* Legal links copyright */}
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-semibold">
          <p>© 2026 DownloadHub AI. All rights reserved. Globally distributed with CDN caches.</p>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <button onClick={() => setActiveLegal('privacy')} className="hover:text-white transition">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setActiveLegal('terms')} className="hover:text-white transition">Terms &amp; Conditions</button>
            <span>•</span>
            <button onClick={() => setActiveLegal('dmca')} className="hover:text-white transition">DMCA Compliance</button>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              Sitemap <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
              RSS Feed <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
