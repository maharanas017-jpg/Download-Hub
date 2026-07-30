import React, { useState } from 'react';
import { Copy, Check, FileText, BarChart2, ShieldAlert } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  
  const words = cleanText ? cleanText.split(/\s+/) : [];
  const wordCount = words.length;
  
  const sentences = cleanText ? cleanText.split(/[.!?]+/).filter(Boolean) : [];
  const sentenceCount = sentences.length;

  const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean) : [];
  const paragraphCount = paragraphs.length;

  // Syllable count estimation
  const countSyllables = (word: string) => {
    let w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    w = w.replace(/^y/, '');
    const syllables = w.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const totalSyllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  // Reading difficulty (Flesch Kincaid Reading Ease)
  // formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  let readingEase = 100;
  let difficultyLabel = 'Very Easy';
  if (wordCount > 0 && sentenceCount > 0) {
    const ease = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);
    readingEase = Math.min(100, Math.max(0, Math.round(ease)));
    if (readingEase < 30) difficultyLabel = 'College Graduate (Difficult)';
    else if (readingEase < 50) difficultyLabel = 'College Level (Fairly Hard)';
    else if (readingEase < 60) difficultyLabel = 'High School (Plain English)';
    else if (readingEase < 70) difficultyLabel = '7th & 8th Grade (Fairly Easy)';
    else if (readingEase < 80) difficultyLabel = '6th Grade (Easy)';
    else difficultyLabel = '5th Grade (Very Easy)';
  }

  // Reading and Speaking Time
  const readingTimeSec = Math.round((wordCount / 225) * 60); // 225 wpm average
  const speakingTimeSec = Math.round((wordCount / 150) * 60); // 150 wpm average

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  // Keyword density
  const getKeywordDensity = () => {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'in', 'of', 'that', 'this', 'with', 'it', 'as', 'has', 'have', 'had', 'i', 'you', 'he', 'she', 'we', 'they', 'our', 'us', 'their']);
    const frequency: Record<string, number> = {};
    
    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanWord && cleanWord.length > 2 && !stopWords.has(cleanWord)) {
        frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: wordCount > 0 ? ((count / wordCount) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const densities = getKeywordDensity();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto animate-fade-in" id="word-counter-tool">
      {/* Metrics Header Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Words</span>
          <span className="text-2xl font-bold text-slate-800" id="wc-words-val">{wordCount}</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Characters</span>
          <span className="text-2xl font-bold text-slate-800" id="wc-chars-val">{charCountWithSpaces}</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sentences</span>
          <span className="text-2xl font-bold text-slate-800" id="wc-sentences-val">{sentenceCount}</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paragraphs</span>
          <span className="text-2xl font-bold text-slate-800" id="wc-paragraphs-val">{paragraphCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <textarea
              className="w-full min-h-[280px] bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition placeholder-slate-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your content here to begin live SEO analysis..."
              id="word-counter-textarea"
            />
            {text && (
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-4 right-4 flex items-center gap-1.5 py-1 px-2.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                id="word-counter-copy-btn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>No spaces: {charCountNoSpaces} chars</span>
            <span>Est. syllables: {totalSyllables}</span>
          </div>
        </div>

        {/* Detailed Insights Column */}
        <div className="space-y-6">
          {/* Readability Score */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Readability Insights</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Flesch Reading Ease:</span>
                <span className="font-bold text-slate-700">{readingEase}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${readingEase}%` }}
                />
              </div>
              <p className="text-xs font-medium text-blue-800 bg-blue-50/50 p-2 rounded-md">
                Estimated level: <strong>{difficultyLabel}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <div>
                <span className="block text-slate-400">Reading Time</span>
                <span className="font-semibold text-slate-700">{formatTime(readingTimeSec)}</span>
              </div>
              <div>
                <span className="block text-slate-400">Speaking Time</span>
                <span className="font-semibold text-slate-700">{formatTime(speakingTimeSec)}</span>
              </div>
            </div>
          </div>

          {/* Keyword Density List */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Top Keyword Density</span>
            </div>

            {densities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Type more keywords to calculate density metrics...</p>
            ) : (
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                {densities.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 bg-slate-200/50 px-1.5 py-0.5 rounded">
                      {item.keyword}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">({item.count}x)</span>
                      <span className="font-bold text-slate-700 w-10 text-right">{item.density}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
