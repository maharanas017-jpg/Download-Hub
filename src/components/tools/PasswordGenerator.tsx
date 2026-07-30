import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Copy, Check, RefreshCw, Lock } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    // Use window.crypto for secure random numbers if available
    const array = new Uint32Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length];
      }
    } else {
      // Fallback
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Evaluate password strength
  const evaluateStrength = () => {
    if (!password) return { score: 0, label: 'No Password', color: 'bg-slate-200', textColor: 'text-slate-400', icon: ShieldAlert };
    
    // Entropy calculation
    let poolSize = 0;
    if (includeUppercase) poolSize += 26;
    if (includeLowercase) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 26;

    const entropyBits = Math.round(length * Math.log2(poolSize || 2));

    if (entropyBits < 40) {
      return { score: 1, label: 'Weak (Unsafe)', color: 'bg-rose-500', textColor: 'text-rose-600', icon: ShieldAlert };
    } else if (entropyBits < 60) {
      return { score: 2, label: 'Fair (Moderate)', color: 'bg-amber-500', textColor: 'text-amber-600', icon: ShieldAlert };
    } else if (entropyBits < 80) {
      return { score: 3, label: 'Strong (Secure)', color: 'bg-emerald-500', textColor: 'text-emerald-600', icon: ShieldCheck };
    } else {
      return { score: 4, label: 'Extremely Secure', color: 'bg-blue-600', textColor: 'text-blue-600', icon: Shield };
    }
  };

  const strength = evaluateStrength();
  const StrengthIcon = strength.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-xl mx-auto" id="password-generator-tool">
      <div className="space-y-6">
        {/* Output Area */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-lg text-slate-800 break-all select-all pr-24 min-h-[64px]" id="password-output-box">
          {password || <span className="text-slate-400 italic text-sm">Select at least one option...</span>}
          
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={generatePassword}
              disabled={!password}
              className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 transition disabled:opacity-50"
              title="Regenerate Password"
              id="pw-regenerate-btn"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className="p-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white transition shadow-sm disabled:opacity-50"
              title="Copy Password"
              id="pw-copy-btn"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-100 rounded-lg">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Lock className="w-3.5 h-3.5" /> Strength:
          </span>
          <span className={`flex items-center gap-1 ${strength.textColor}`}>
            <StrengthIcon className="w-4 h-4" /> {strength.label}
          </span>
        </div>

        {/* Option Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
              <span>Password Length:</span>
              <span className="text-blue-600 font-mono font-bold">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              id="password-length-slider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                id="pw-cb-uppercase"
              />
              <span className="text-xs font-medium text-slate-700">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                id="pw-cb-lowercase"
              />
              <span className="text-xs font-medium text-slate-700">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                id="pw-cb-numbers"
              />
              <span className="text-xs font-medium text-slate-700">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                id="pw-cb-symbols"
              />
              <span className="text-xs font-medium text-slate-700">Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
