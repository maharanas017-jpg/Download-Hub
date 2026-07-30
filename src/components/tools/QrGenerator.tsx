import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode, Sparkles } from 'lucide-react';

interface QrGeneratorProps {
  initialType?: 'url' | 'text';
}

export default function QrGenerator({ initialType = 'url' }: QrGeneratorProps) {
  const [text, setText] = useState('https://downloadhub-ai.com');
  const [qrColor, setQrColor] = useState('#1e3a8a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);
  const [scale, setScale] = useState(8);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateQR = async () => {
    try {
      if (!text.trim()) return;
      const options = {
        errorCorrectionLevel: errorCorrection,
        margin: margin,
        scale: scale,
        color: {
          dark: qrColor,
          light: bgColor,
        },
      };

      // Draw to canvas
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, options);
        // Also generate data URL for easy downloading
        const dataUrl = await QRCode.toDataURL(text, options);
        setImageUrl(dataUrl);
      }
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, qrColor, bgColor, margin, scale, errorCorrection]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `downloadhub_qr_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto" id="qr-generator-tool">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Configuration Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Enter Content (URL, Text, or Credentials)
            </label>
            <div className="relative">
              <textarea
                className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste link, contact details, or messages here..."
                id="qr-content-input"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute bottom-3 right-3 p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition"
                title="Copy input text"
                id="qr-copy-input-btn"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">QR Code Color</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                  id="qr-color-picker"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">{qrColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Background Color</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                  id="qr-bg-color-picker"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Margin Padding: {margin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                id="qr-margin-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Resolution Size (Scale): {scale * 29}x{scale * 29}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                id="qr-scale-slider"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Error Correction Strength</label>
              <p className="text-xs text-slate-400 mb-2">Higher correction allows scanning even if partially dirty or covered.</p>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setErrorCorrection(level)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-md border text-center transition ${
                      errorCorrection === level
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    id={`qr-ecc-${level}`}
                  >
                    {level === 'L' && 'Low (7%)'}
                    {level === 'M' && 'Medium (15%)'}
                    {level === 'Q' && 'Quartile (25%)'}
                    {level === 'H' && 'High (30%)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Render Preview & Export */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-100 text-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 relative group">
            <canvas ref={canvasRef} className="max-w-[240px] max-h-[240px]" id="qr-preview-canvas" />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center pointer-events-none">
              <QrCode className="w-8 h-8 text-white drop-shadow-md" />
            </div>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition"
              id="qr-download-btn"
            >
              <Download className="w-4 h-4" /> Download QR Code (PNG)
            </button>

            <div className="flex gap-2 text-xs justify-center text-slate-500">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> Vector quality</span>
              <span>•</span>
              <span>Unlimited free scans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
