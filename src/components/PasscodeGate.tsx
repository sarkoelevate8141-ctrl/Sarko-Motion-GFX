import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface PasscodeGateProps {
  onUnlock: () => void;
}

const REQUIRED_PASSCODE = '14418';
const CODE_LENGTH = 5;

export const PasscodeGate: React.FC<PasscodeGateProps> = ({ onUnlock }) => {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input box on load
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Take only the last entered char if multiple, or empty if cleared
    const char = value.slice(-1);
    
    // Only accept numeric digits
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (error) setError(false);

    // Auto advance to next box
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if full passcode entered
    const completeCode = newDigits.join('');
    if (completeCode.length === CODE_LENGTH) {
      if (completeCode === REQUIRED_PASSCODE) {
        setIsSuccess(true);
        setError(false);
        setTimeout(() => {
          onUnlock();
        }, 300);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(Array(CODE_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous input and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
      if (error) setError(false);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!pastedData) return;

    // Filter only digits
    const cleanedDigits = pastedData.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
    if (cleanedDigits.length === 0) return;

    const newDigits = Array(CODE_LENGTH).fill('');
    cleanedDigits.forEach((d, i) => {
      newDigits[i] = d;
    });
    setDigits(newDigits);

    const completeCode = newDigits.join('');
    if (completeCode.length === CODE_LENGTH) {
      if (completeCode === REQUIRED_PASSCODE) {
        setIsSuccess(true);
        setError(false);
        setTimeout(() => {
          onUnlock();
        }, 300);
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(Array(CODE_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
        }, 600);
      }
    } else {
      // Focus on the first unfilled input
      const nextEmptyIndex = newDigits.findIndex((d) => !d);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[CODE_LENGTH - 1]?.focus();
      }
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
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border shadow-lg transition-all duration-300 ${
              isSuccess 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-emerald-950/60 scale-105' 
                : error
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-400 shadow-rose-950/60'
                : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-400 shadow-indigo-950/50'
            }`}>
              {isSuccess ? <Sparkles className="w-7 h-7 animate-pulse" /> : <Lock className="w-7 h-7" />}
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
                Please enter the 5-digit passcode to access the workstation
              </p>
            </div>
          </div>

          {/* 5-Digit Boxes Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-2">
              {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                const isFilled = Boolean(digits[index]);
                return (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      id={`passcode-box-${index}`}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digits[index]}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      autoComplete="off"
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-slate-950/90 border transition-all duration-200 outline-none select-none cursor-pointer ${
                        error
                          ? 'border-rose-500/80 text-rose-300 shadow-lg shadow-rose-950/50 animate-shake'
                          : isSuccess
                          ? 'border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/60 bg-emerald-950/20'
                          : isFilled
                          ? 'border-indigo-500/80 text-white bg-indigo-950/30 ring-2 ring-indigo-500/20'
                          : 'border-slate-800 text-slate-300 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Error / Success Status indicator */}
            <div className="h-6 flex items-center justify-center text-center">
              {error ? (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid passcode. Please try again.</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono animate-fadeIn">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Passcode verified! Unlocking studio...</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono">
                  Auto-verifies upon entering all 5 digits
                </div>
              )}
            </div>
          </div>

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
