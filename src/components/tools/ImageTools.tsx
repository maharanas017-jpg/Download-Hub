import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Minimize, Maximize, RefreshCw, Eraser, Sparkles, Image as ImageIcon, ZoomIn, Check, AlertCircle } from 'lucide-react';

type ToolMode = 'compressor' | 'converter' | 'upscaler' | 'bg-remover';

export default function ImageTools({ initialMode = 'compressor' }: { initialMode?: ToolMode }) {
  const [mode, setMode] = useState<ToolMode>(initialMode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Configuration options
  const [quality, setQuality] = useState<number>(75);
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2);
  const [sharpenLevel, setSharpenLevel] = useState<number>(30);
  const [brushSize, setBrushSize] = useState<number>(20);
  const [eraserColorThreshold, setEraserColorThreshold] = useState<number>(20);

  // Canvas References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadNewFile(file);
    }
  };

  const loadNewFile = (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedSize(0);
    setCompressedUrl('');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadNewFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 1. Process Compressor
  const runCompress = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const mimeType = selectedFile?.type || 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, quality / 100);
    setCompressedUrl(dataUrl);

    // Estimate file size from base64
    const stringLength = dataUrl.length - 'data:image/png;base64,'.length;
    const sizeInBytes = Math.round(stringLength * 0.75);
    setCompressedSize(sizeInBytes);
  };

  // 2. Process Format Converter
  const runConverter = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL(targetFormat, 0.85);
    setCompressedUrl(dataUrl);

    const stringLength = dataUrl.length - `data:${targetFormat};base64,`.length;
    const sizeInBytes = Math.round(stringLength * 0.75);
    setCompressedSize(sizeInBytes);
  };

  // 3. Process Upscaler & Sharpener
  const runUpscaler = () => {
    if (!imageRef.current || !canvasRef.current) return;
    setLoading(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const img = imageRef.current!;
      
      const newWidth = img.naturalWidth * upscaleFactor;
      const newHeight = img.naturalHeight * upscaleFactor;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Enable bicubic image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Apply Matrix Sharpening if factor > 0
      if (sharpenLevel > 0) {
        try {
          const imgData = ctx.getImageData(0, 0, newWidth, newHeight);
          const data = imgData.data;
          const original = new Uint8ClampedArray(data);
          
          // Basic 3x3 sharpening matrix
          // [ 0, -1,  0 ]
          // [-1,  5, -1 ]
          // [ 0, -1,  0 ]
          const mix = sharpenLevel / 100;
          for (let y = 1; y < newHeight - 1; y++) {
            for (let x = 1; x < newWidth - 1; x++) {
              const i = (y * newWidth + x) * 4;
              for (let c = 0; c < 3; c++) {
                const idx = i + c;
                const top = ((y - 1) * newWidth + x) * 4 + c;
                const bottom = ((y + 1) * newWidth + x) * 4 + c;
                const left = (y * newWidth + (x - 1)) * 4 + c;
                const right = (y * newWidth + (x + 1)) * 4 + c;

                const centerVal = original[idx];
                const edgeSum = original[top] + original[bottom] + original[left] + original[right];
                const sharpVal = centerVal * 5 - edgeSum;
                
                // Blend original and sharpened
                data[idx] = Math.min(255, Math.max(0, centerVal * (1 - mix) + sharpVal * mix));
              }
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.error('Sharpening failed due to canvas security:', e);
        }
      }

      const format = selectedFile?.type || 'image/jpeg';
      const dataUrl = canvas.toDataURL(format);
      setCompressedUrl(dataUrl);
      setCompressedSize(Math.round((dataUrl.length - 22) * 0.75));
      setLoading(false);
    }, 100);
  };

  // 4. Process Background Remover
  const runBgRemover = () => {
    if (!imageRef.current || !canvasRef.current) return;
    setLoading(true);

    setTimeout(() => {
      const canvas = canvasRef.current!;
      const img = imageRef.current!;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Chroma key background subtraction
      // Usually, remove white or light gray background by default
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Find dominant color or assume near-white/light-grey background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];

          // If pixel is near-white or matches typical solid backdrop
          if (r > 210 && g > 210 && b > 210) {
            data[i+3] = 0; // Transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        console.error('Bg removal canvas error:', e);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setCompressedUrl(dataUrl);
      setLoading(false);
    }, 1500);
  };

  // Canvas Manual Brush Eraser tool
  const handleCanvasMouseDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'bg-remover' || !canvasRef.current) return;
    if (e.buttons !== 1) return; // Only erase if left mouse is pressed

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out'; // Erase operation
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Update download image reference
    setCompressedUrl(canvas.toDataURL('image/png'));
  };

  // Trigger calculations when inputs change
  useEffect(() => {
    if (!imageSrc) return;
    if (mode === 'compressor') {
      runCompress();
    } else if (mode === 'converter') {
      runConverter();
    }
  }, [mode, imageSrc, quality, targetFormat]);

  const handleDownload = () => {
    const urlToDownload = compressedUrl || imageSrc;
    if (!urlToDownload) return;

    let downloadName = `downloadhub_${mode}_${Date.now()}`;
    let extension = 'jpg';
    if (mode === 'bg-remover') {
      extension = 'png';
    } else if (mode === 'converter') {
      extension = targetFormat.split('/')[1] === 'jpeg' ? 'jpg' : targetFormat.split('/')[1];
    } else {
      extension = selectedFile?.name.split('.').pop() || 'jpg';
    }

    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = `${downloadName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto" id="image-studio-tool">
      {/* Tool Navigation tabs */}
      <div className="flex border-b border-slate-100 mb-6 pb-2 overflow-x-auto gap-1">
        {(['compressor', 'converter', 'upscaler', 'bg-remover'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setMode(tab);
              setCompressedUrl('');
              setCompressedSize(0);
            }}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-xs transition border whitespace-nowrap ${
              mode === tab
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id={`img-tab-${tab}`}
          >
            {tab === 'compressor' && <Minimize className="w-3.5 h-3.5" />}
            {tab === 'converter' && <RefreshCw className="w-3.5 h-3.5" />}
            {tab === 'upscaler' && <Maximize className="w-3.5 h-3.5" />}
            {tab === 'bg-remover' && <Eraser className="w-3.5 h-3.5" />}
            {tab === 'compressor' && 'Compressor'}
            {tab === 'converter' && 'Format Converter'}
            {tab === 'upscaler' && 'Image Upscaler'}
            {tab === 'bg-remover' && 'Background Eraser'}
          </button>
        ))}
      </div>

      {!imageSrc ? (
        /* Upload Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-12 text-center transition cursor-pointer bg-slate-50/50"
          id="image-drop-zone"
          onClick={() => document.getElementById('image-file-input')?.click()}
        >
          <input
            type="file"
            id="image-file-input"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-700">Drag & drop your image here, or browse files</p>
          <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG, WebP, and SVG up to 10MB</p>
        </div>
      ) : (
        /* Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace Preview (Col-span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-center min-h-[320px] max-h-[480px] relative overflow-hidden group">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Original Workspace"
                className="max-h-[300px] object-contain hidden"
                onLoad={() => {
                  if (mode === 'compressor') runCompress();
                  else if (mode === 'converter') runConverter();
                }}
              />

              {/* Real working Canvas */}
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseDraw}
                className="max-h-[300px] max-w-full object-contain cursor-crosshair rounded shadow-lg"
                id="image-studio-canvas"
              />

              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-semibold">Processing image algorithms...</span>
                </div>
              )}

              {mode === 'bg-remover' && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-[10px] text-white px-2 py-1 rounded">
                  Drag on picture to erase background manually
                </div>
              )}
            </div>

            {/* Compare Metrics bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Original Size:</span>
                  <span className="ml-1.5 text-slate-700">{formatSize(originalSize)}</span>
                </div>
                {compressedSize > 0 && (
                  <div>
                    <span className="text-slate-400">Processed Size:</span>
                    <span className="ml-1.5 text-blue-600">{formatSize(compressedSize)}</span>
                  </div>
                )}
              </div>

              {compressedSize > 0 && originalSize > compressedSize && (
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Saved {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Config sidebar controls */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-800">Control Panel</span>
              </div>

              {/* Compressor Controls */}
              {mode === 'compressor' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Compression Quality:</span>
                      <span className="text-blue-600 font-mono">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 accent-blue-600 rounded-lg cursor-pointer"
                      id="compress-quality-slider"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Lowering quality decreases file size significantly while retaining web suitability.</p>
                </div>
              )}

              {/* Converter Controls */}
              {mode === 'converter' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Target Format</label>
                    <select
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      id="convert-format-select"
                    >
                      <option value="image/jpeg">JPEG (.jpg)</option>
                      <option value="image/png">PNG (.png)</option>
                      <option value="image/webp">WebP (.webp)</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-400">Images are safely converted entirely client-side, respecting your absolute privacy.</p>
                </div>
              )}

              {/* Upscaler Controls */}
              {mode === 'upscaler' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Upscale Factor</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[2, 4].map((factor) => (
                        <button
                          key={factor}
                          onClick={() => setUpscaleFactor(factor)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border ${
                            upscaleFactor === factor
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {factor}x Resolution
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Sharpen Filter Power:</span>
                      <span className="text-blue-600 font-mono">{sharpenLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sharpenLevel}
                      onChange={(e) => setSharpenLevel(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 accent-blue-600 rounded-lg cursor-pointer"
                      id="upscale-sharpen-slider"
                    />
                  </div>

                  <button
                    onClick={runUpscaler}
                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Execute AI Upscale
                  </button>
                </div>
              )}

              {/* Background Eraser Controls */}
              {mode === 'bg-remover' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Manual Eraser Size:</span>
                      <span className="text-blue-600 font-mono">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 accent-blue-600 rounded-lg cursor-pointer"
                      id="eraser-brush-slider"
                    />
                  </div>

                  <button
                    onClick={runBgRemover}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Auto-Chroma Subtract
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs shadow-sm"
                  id="image-studio-download-btn"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImageSrc('');
                    setCompressedUrl('');
                    setCompressedSize(0);
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold p-2 rounded-lg text-xs"
                  id="image-studio-reset-btn"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
