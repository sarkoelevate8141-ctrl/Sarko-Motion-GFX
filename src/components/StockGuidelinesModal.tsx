import React from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Video, 
  Sparkles
} from 'lucide-react';

interface StockGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StockGuidelinesModal: React.FC<StockGuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="studio-panel rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Marketplace Video Standards & Guidelines
              </h3>
              <p className="text-xs text-slate-400">
                Technical standards, codec parameters, and submission rules for 99%+ approval rates
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

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resolution & FPS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
              <Video className="w-4 h-4 text-indigo-400" />
              <h4>Resolution & Framing</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong className="text-white">Minimum:</strong> 1920×1080 (Full HD)</li>
              <li><strong className="text-indigo-300">Preferred:</strong> 3840×2160 (4K UHD) yields 2-3x higher marketplace pricing.</li>
              <li><strong className="text-white">Cadence:</strong> 29.97 fps or 30.00 fps broadcast standard.</li>
              <li><strong className="text-white">Duration:</strong> 5 to 60 seconds (commercial optimal is 5-15s).</li>
            </ul>
          </div>

          {/* Codec Specifications */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4>Codec & Master Standards</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong className="text-white">Standard:</strong> H.264 / MPEG-4 AVC (.mp4)</li>
              <li><strong className="text-white">Pixel Matrix:</strong> <code className="text-indigo-300 font-mono">yuv420p</code> (universal decoder playback)</li>
              <li><strong className="text-white">Quality:</strong> CRF 18 visually lossless delivery</li>
              <li><strong className="text-white">Scan Mode:</strong> Progressive (no interlacing)</li>
            </ul>
          </div>
        </div>

        {/* Audio Rules */}
        <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4>Audio Rejection Shield (-an Flag)</h4>
          </div>
          <p className="text-xs text-slate-300">
            Stock reviewers routinely reject stock b-roll containing background hiss or uneven ambient audio.
            MotionAI automatically strips audio using the <code className="text-amber-200 font-mono">-an</code> parameter to safeguard approval ratings.
          </p>
        </div>

        {/* Keywording Strategy */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h4>SEO & Keywording Best Practices</h4>
          </div>
          <p className="text-xs text-slate-300">
            Adobe Stock and Shutterstock engines rank footage primarily by the <strong>first 10 keywords</strong>. Always place subject, environment, lighting, and camera motion first.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-colors cursor-pointer"
          >
            Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};

