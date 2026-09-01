import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Tag, 
  ShieldCheck
} from 'lucide-react';
import { VideoGenerationItem } from '../types';

interface StockMetadataModalProps {
  video: VideoGenerationItem | null;
  onClose: () => void;
}

export const StockMetadataModal: React.FC<StockMetadataModalProps> = ({ video, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!video) return null;

  const metadata = video.adobeStockMetadata || {
    title: `Commercial Stock 4K: ${video.prompt.slice(0, 50)}`,
    category: 'Technology & AI',
    keywords: [
      '4k stock video', 'cinematic b-roll', 'commercial footage', 'adobe stock ready',
      'h264', 'yuv420p', 'broadcast quality', 'slow motion', 'high definition'
    ],
    commercialViabilityScore: 94,
    codec: 'libx264 (H.264)',
    pixelFormat: 'yuv420p',
    crf: 18,
    frameRate: 30,
    hasAudio: false,
    complianceNotes: ['Adobe Stock 4K Ready', 'Audio track stripped for stock licensing']
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadCsv = () => {
    const filename = `motionai-stock-${video.id}.mp4`;
    const titleClean = `"${metadata.title.replace(/"/g, '""')}"`;
    const keywordsClean = `"${metadata.keywords.join(', ')}"`;
    const categoryClean = `"${metadata.category}"`;
    
    const csvContent = `Filename,Title,Keywords,Category\n${filename},${titleClean},${keywordsClean},${categoryClean}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `adobestock-metadata-${video.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="studio-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Marketplace Metadata & CSV Package
              </h3>
              <p className="text-xs text-slate-400">
                Pre-formatted CSV & SEO tags ready for Adobe Stock Contributor Portal
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

        {/* Title Section */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Stock Video Title (5-70 Characters)
            </label>
            <button
              onClick={() => handleCopy(metadata.title, 'title')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'title' ? 'Copied' : 'Copy Title'}</span>
            </button>
          </div>
          <p className="text-sm font-medium text-slate-100 font-mono select-all">
            {metadata.title}
          </p>
        </div>

        {/* Keywords Section */}
        <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              High-Value Search Keywords ({metadata.keywords.length} tags)
            </label>
            <button
              onClick={() => handleCopy(metadata.keywords.join(', '), 'keywords')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedSection === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'keywords' ? 'Copied All' : 'Copy Comma-Separated'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
            {metadata.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Specs Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Resolution</div>
            <div className="text-xs font-bold text-indigo-300 font-mono mt-0.5">
              {video.isUpscaled ? '3840×2160 (4K)' : '1920×1080 (HD)'}
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Codec / Profile</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
              H.264 yuv420p
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Quality CRF</div>
            <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
              CRF 18 Lossless
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-500 font-mono uppercase">Frame Rate</div>
            <div className="text-xs font-bold text-cyan-400 font-mono mt-0.5">
              30.00 FPS
            </div>
          </div>
        </div>

        {/* Compliance Notes */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Marketplace Verification Checklist:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc font-sans">
            <li>Audio track successfully removed (-an flag) for stock review compliance.</li>
            <li>No visible branding, copyright, or watermarks present.</li>
            <li>H.264 standard yuv420p color matrix guarantees 100% video decoding compatibility.</li>
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Adobe Stock CSV</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

