import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface PasscodeGateProps {
  onUnlock: () => void;
}

const REQUIRED_PASSCODE = '14418';

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input automatically on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === REQUIRED_PASSCODE) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setPasscode('');
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasscode(val);
    if (error) setError(false);

    // Auto unlock if user types the exact 5 digit passcode
    if (val === REQUIRED_PASSCODE) {
      setTimeout(() => {
        onUnlock();
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Passcode Card */}
        <div className="studio-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-800/90 bg-slate-900/95 backdrop-blur-xl">
          {/* Logo & Lock Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-950/50">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-mono font-bold tracking-wider uppercase border border-indigo-800/60 mb-1.5">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Protected Studio Access
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider font-mono">
                SARKO <span className="text-indigo-400">MOTION-GFX</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your studio access passcode to enter the workstation
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                
                <input
                  ref={inputRef}
                  id="studio-passcode-input"
                  type={showPassword ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={10}
                  value={passcode}
                  onChange={handleChange}
                  placeholder="Enter passcode..."
                  className={`w-full bg-slate-950 border text-slate-100 text-center text-lg tracking-widest font-mono rounded-xl pl-10 pr-10 py-3 focus:outline-none transition-all ${
                    error
                      ? 'border-rose-500 ring-2 ring-rose-500/20 text-rose-300'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-mono pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid passcode. Please try again.</span>
                </div>
              )}
            </div>

            <button
              id="btn-unlock-studio"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-950 transition-all cursor-pointer group"
            >
              <span>Unlock Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Info note */}
          <div className="text-[11px] text-slate-500 text-center font-mono border-t border-slate-800/70 pt-3">
            Session resets upon tab reload or refresh
          </div>
        </div>

        {/* Developed by woalid footer note under the popup */}
        <div className="text-center mt-5 flex justify-center">
          <p className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-sm sm:text-base font-mono tracking-wider text-slate-200 shadow-lg shadow-indigo-950/60 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span>
              Developed By <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Woalid</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
