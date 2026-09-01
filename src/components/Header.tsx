import React from 'react';
import { 
  Sliders, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  Video,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  onOpenGuidelines: () => void;
  onOpenBatchExport?: () => void;
  hasReplicateKey: boolean;
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenGuidelines, 
  hasReplicateKey, 
  hasGeminiKey 
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Platform Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-inner border border-indigo-400/30">
            <Video className="w-4 h-4 text-white" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              MOTION<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 hidden sm:inline-block">
              Commercial Studio
            </span>
          </div>
        </div>

        {/* Live Engine Status & Review Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Marketplace Target Indicator */}
          <div 
            id="badge-adobe-stock-ready"
            className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md"
            title="Encodes strict H.264 yuv420p CRF 18 @ 30 FPS with audio stripped for commercial stock submission"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono text-slate-300">
              Adobe Stock <span className="text-emerald-400 font-semibold">CRF 18</span>
            </span>
          </div>

          {/* Stock Guidelines Action */}
          <button
            id="btn-guidelines"
            type="button"
            onClick={onOpenGuidelines}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Stock Guidelines</span>
            <span className="sm:hidden text-xs">Specs</span>
          </button>

          {/* Contributor Mode Button */}
          <button
            id="btn-pro-export"
            type="button"
            onClick={onOpenGuidelines}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
            <span>Contributor Hub</span>
          </button>
        </div>
      </div>
    </header>
  );
};

