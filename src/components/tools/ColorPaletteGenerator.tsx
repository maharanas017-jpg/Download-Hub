import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, Download, RefreshCw, Layers } from 'lucide-react';

interface ColorItem {
  hex: string;
  name: string;
  textContrast: 'white' | 'black';
}

export default function ColorPaletteGenerator() {
  const [prompt, setPrompt] = useState('cozy lavender field at twilight');
  const [colors, setColors] = useState<ColorItem[]>([
    { hex: '#4a3e56', name: 'Twilight Purple', textContrast: 'white' },
    { hex: '#7c6a8f', name: 'Lavender Mist', textContrast: 'white' },
    { hex: '#b5a4c4', name: 'Soft Thistle', textContrast: 'black' },
    { hex: '#e3dbe8', name: 'Sweet Lilac', textContrast: 'black' },
    { hex: '#9a8fa3', name: 'Shadowed Sage', textContrast: 'white' },
  ]);
  const [tips, setTips] = useState('Combine Twilight Purple with Sweet Lilac for high visual accessibility. Use Soft Thistle as subtle borders.');
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const generateAIPalette = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      if (data.colors && Array.isArray(data.colors)) {
        setColors(data.colors);
      }
      if (data.tips) {
        setTips(data.tips);
      }
    } catch (err) {
      console.error('Error generating AI palette:', err);
      // Fallback fallback palette
      setTips('Failed to reach Gemini server. Showing a cozy autumn backup palette.');
      setColors([
        { hex: '#8C3A2B', name: 'Crimson Leaf', textContrast: 'white' },
        { hex: '#D97A3E', name: 'Burnt Orange', textContrast: 'white' },
        { hex: '#F2C166', name: 'Soft Mustard', textContrast: 'black' },
        { hex: '#4A593D', name: 'Forest Moss', textContrast: 'white' },
        { hex: '#F2E8DF', name: 'Warm Cream', textContrast: 'black' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCSS = () => {
    const cssContent = `:root {
  --color-primary: ${colors[0]?.hex || '#4a3e56'};
  --color-secondary: ${colors[1]?.hex || '#7c6a8f'};
  --color-accent: ${colors[2]?.hex || '#b5a4c4'};
  --color-neutral-dark: ${colors[3]?.hex || '#e3dbe8'};
  --color-neutral-light: ${colors[4]?.hex || '#9a8fa3'};
}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palette-variables.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto" id="palette-generator-tool">
      <div className="space-y-6">
        {/* Form Input */}
        <form onSubmit={generateAIPalette} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Palette className="w-5 h-5" />
            </span>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-11 pr-4 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a mood, season, or branding (e.g. 'retro beach party 1980s')..."
              disabled={loading}
              id="palette-prompt-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition disabled:opacity-50"
            id="palette-generate-btn"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'AI Curating...' : 'Generate AI Palette'}
          </button>
        </form>

        {/* Color Bars Display */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-[240px] sm:h-[180px]" id="palette-color-grid">
          {colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color.hex }}
              className="relative group rounded-xl p-4 flex flex-col justify-end h-full shadow-sm hover:scale-[1.02] transition-all cursor-pointer overflow-hidden border border-black/5"
              onClick={() => handleCopyHex(color.hex)}
              id={`palette-color-block-${index}`}
            >
              {/* Top info overlay */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition duration-200">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  color.textContrast === 'white' ? 'bg-white/20 text-white' : 'bg-black/10 text-black'
                }`}>
                  Click to copy
                </span>
              </div>

              {/* Text metadata */}
              <div className={color.textContrast === 'white' ? 'text-white' : 'text-slate-800'}>
                <p className="text-xs font-bold truncate tracking-wide">{color.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="font-mono text-sm font-bold">{color.hex}</p>
                  <span>
                    {copiedHex === color.hex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info box & Export */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Designer Advice
            </span>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{tips}</p>
          </div>

          <button
            type="button"
            onClick={downloadCSS}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-lg shadow-sm transition whitespace-nowrap"
            id="palette-css-download-btn"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSS Variables
          </button>
        </div>
      </div>
    </div>
  );
}
