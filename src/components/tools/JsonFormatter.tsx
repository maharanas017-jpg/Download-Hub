import React, { useState } from 'react';
import { Code, Check, Copy, RefreshCw, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [jsonText, setJsonText] = useState('{"name":"DownloadHub AI","capabilities":["image_compression","qr_generation","ai_palette"],"launched":2026,"active":true}');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setSuccessMsg('JSON parsed and formatted successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed));
      setSuccessMsg('JSON successfully minified!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
    }
  };

  const handleCopy = async () => {
    if (!jsonText) return;
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIRepair = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!jsonText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/json-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonText }),
      });

      if (!response.ok) {
        throw new Error('AI Repair service failed');
      }

      const data = await response.json();
      if (data.repairedText) {
        setJsonText(data.repairedText);
        setSuccessMsg('AI successfully analyzed and repaired your JSON syntax!');
      } else {
        setErrorMsg('AI could not verify or repair this corrupted text block.');
      }
    } catch (err: any) {
      setErrorMsg('Error requesting AI Repair: ' + (err.message || 'Server offline'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-4xl mx-auto" id="json-formatter-tool">
      <div className="space-y-4">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFormat}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition"
              id="json-beautify-btn"
            >
              Format JSON
            </button>
            <button
              type="button"
              onClick={handleMinify}
              className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded transition"
              id="json-minify-btn"
            >
              Minify
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAIRepair}
              disabled={loading}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs rounded shadow transition disabled:opacity-50"
              id="json-ai-repair-btn"
              title="Fix missing brackets, commas or quotes using Gemini AI"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              AI Auto-Repair
            </button>
            
            <button
              type="button"
              onClick={handleCopy}
              className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded flex items-center gap-1 transition"
              id="json-copy-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="relative">
          <textarea
            className="w-full min-h-[300px] bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste your raw, messy, or broken JSON here...'
            id="json-textarea-field"
          />
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs" id="json-error-alert">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">JSON Syntax Error Found</p>
              <p className="font-mono text-[11px] opacity-90">{errorMsg}</p>
              <p className="opacity-80">Tip: Click the <strong>AI Auto-Repair</strong> button above to automatically diagnose and correct the error!</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs" id="json-success-alert">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
