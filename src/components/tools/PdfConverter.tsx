import React, { useState, useRef } from 'react';
import { FileCode, Download, Check, RefreshCw, FileText, Sparkles, BookOpen } from 'lucide-react';

export default function PdfConverter() {
  const [docTitle, setDocTitle] = useState('DownloadHub AI Technical Spec');
  const [docContent, setDocContent] = useState(`## 1. Introduction
DownloadHub AI is a professional, SEO-optimized suite of micro-tools designed to provide high-speed, client-side visual compression, format conversions, and AI-enabled diagnostics.

## 2. Core Capabilities
* Client-Side Image Compressor (Canvas Pipeline)
* AI Color Palette Generator (Gemini Grounding)
* Secure Password Entropy Designer
* JSON Beautifier & Syntax Auto-Repair Engine

## 3. Privacy Standards
All core visual converters operate entirely locally. Your secure documents, image arrays, and JSON payloads never touch external server hosts unless explicitly requested.`);
  const [theme, setTheme] = useState<'minimal' | 'corporate' | 'creative'>('minimal');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      // Trigger native browser printing optimized for PDF download
      window.print();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto" id="pdf-converter-tool">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Configuration Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Document Title</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Project Proposal"
              id="pdf-title-input"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Document Content (supports MD indicators)</label>
            <p className="text-[10px] text-slate-400">Use "##" for headings, "*" for bullet lists, or write paragraphs.</p>
            <textarea
              className="w-full min-h-[220px] bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Enter details..."
              id="pdf-content-textarea"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Cover Theme Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['minimal', 'corporate', 'creative'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setTheme(style)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border capitalize transition ${
                    theme === style
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition disabled:opacity-50"
            id="pdf-compile-btn"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Compile & Export PDF
          </button>
        </div>

        {/* Live PDF Page Preview */}
        <div className="flex flex-col">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5 justify-between">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> PDF Paper Preview</span>
            <span>A4 Size Ratio</span>
          </div>

          <div
            ref={previewRef}
            className={`border border-slate-200 shadow rounded-xl p-8 bg-white min-h-[440px] max-h-[480px] overflow-y-auto font-sans flex flex-col justify-between ${
              theme === 'corporate' ? 'border-t-8 border-t-slate-800' : ''
            } ${
              theme === 'creative' ? 'border-t-8 border-t-blue-600' : ''
            }`}
            id="pdf-preview-pane"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <h1 className="text-xl font-bold text-slate-800">{docTitle || 'Untitled Document'}</h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                  COMPILED ON DOWNLOADHUB AI • JULY 2026
                </p>
              </div>

              {/* Content render simulation */}
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                {docContent.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-sm font-bold text-slate-800 pt-2">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('* ')) {
                    return (
                      <li key={i} className="list-disc ml-4 font-medium">
                        {line.replace('* ', '')}
                      </li>
                    );
                  }
                  return line.trim() ? <p key={i}>{line}</p> : <div key={i} className="h-2" />;
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 flex justify-between">
              <span>Secure Document Integrity</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
