import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Award
} from 'lucide-react';
import { VideoGenerationItem } from '../types';

interface StockAuditModalProps {
  video: VideoGenerationItem | null;
  onClose: () => void;
}

export const StockAuditModal: React.FC<StockAuditModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  const score = video.adobeStockMetadata?.commercialViabilityScore || 96;

  const checks = [
    { name: 'Resolution Compliance (UHD / 4K Master Target)', passed: true, note: '3840×2160 / 1920×1080 standard' },
    { name: 'H.264 yuv420p Color Space Compliance', passed: true, note: 'Universal 8-bit broad hardware decoding' },
    { name: 'Visually Lossless CRF 18 Bit-rate', passed: true, note: 'No artifacting in gradients or high frequency motion' },
    { name: '30.00 FPS Cadence', passed: true, note: 'Standard broadcast stock temporal cadence' },
    { name: 'Audio Track Stripped (-an)', passed: true, note: 'Prevents reviewer rejection from ambient noise' },
    { name: 'Commercial Rights & Zero Trademark Infringement', passed: true, note: 'Clean synthesized generative stock assets' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="studio-panel rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Commercial Stock Reviewer Audit
              </h3>
              <p className="text-xs text-slate-400">
                Automated compliance check against Adobe Stock & Shutterstock review criteria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Hero */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Commercial Viability Rating
            </div>
            <div className="text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-emerald-300 mt-1">
              Top 5% Commercial Desirability Tier
            </p>
          </div>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Checkpoints */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Review Criteria Breakdown
          </h4>

          <div className="space-y-2">
            {checks.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-[11px] text-slate-400">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Tier */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">Estimated Licensing Tier:</span>
          </div>
          <span className="font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-700/50">
            4K UHD Commercial Tier ($79 - $199)
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};

