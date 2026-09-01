import React, { useState } from 'react';
import { 
  Film, 
  Download, 
  Sparkles, 
  FileText, 
  Play, 
  Search, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { VideoGenerationItem } from '../types';

interface HistoryGalleryProps {
  generations: VideoGenerationItem[];
  currentVideo: VideoGenerationItem | null;
  onSelectVideo: (video: VideoGenerationItem) => void;
  onDeleteVideo: (id: string) => void;
  onUpscaleVideo: (video: VideoGenerationItem) => void;
  onOpenMetadataModal: (video: VideoGenerationItem) => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  generations,
  currentVideo,
  onSelectVideo,
  onDeleteVideo,
  onUpscaleVideo,
  onOpenMetadataModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAspect, setFilterAspect] = useState<string>('all');
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [failedVideoIds, setFailedVideoIds] = useState<Set<string>>(new Set());

  const filtered = generations.filter((item) => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.adobeStockMetadata?.title.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesAspect = filterAspect === 'all' || item.aspectRatio === filterAspect;
    return matchesSearch && matchesAspect;
  });

  return (
    <section className="studio-panel rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header and filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-400" />
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Generated Stock Footage Library
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {generations.length} Clips
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search prompts or titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-44 sm:w-60"
            />
          </div>

          {/* Aspect Filter */}
          <select
            value={filterAspect}
            onChange={(e) => setFilterAspect(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
          >
            <option value="all">All Formats</option>
            <option value="16:9">16:9 Landscape</option>
            <option value="9:16">9:16 Vertical</option>
            <option value="1:1">1:1 Square</option>
            <option value="21:9">21:9 Ultra</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-500 space-y-2">
          <Film className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-xs">No generated stock clips found matching your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isSelected = currentVideo?.id === item.id;
            const isHovered = hoveredVideoId === item.id;

            return (
              <div
                key={item.id}
                id={`card-history-${item.id}`}
                onMouseEnter={() => setHoveredVideoId(item.id)}
                onMouseLeave={() => setHoveredVideoId(null)}
                className={`studio-card rounded-xl overflow-hidden flex flex-col justify-between group relative transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-900'
                    : ''
                }`}
              >
                {/* Media Thumbnail / Hover Video Player */}
                <div 
                  className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                  onClick={() => onSelectVideo(item)}
                >
                  {isHovered && !failedVideoIds.has(item.id) ? (
                    <video
                      src={item.adobeStockUrl || item.upscaled4kUrl || item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onError={() => {
                        setFailedVideoIds((prev) => {
                          const next = new Set(prev);
                          next.add(item.id);
                          return next;
                        });
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                      <Play className="w-8 h-8 text-indigo-400/60" />
                    </div>
                  )}

                  {/* Play overlay icon on hover */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-950">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/90 text-indigo-300 border border-slate-800 backdrop-blur-sm">
                      {item.isUpscaled ? '4K UHD' : '1080p'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-800 backdrop-blur-sm">
                      {item.aspectRatio}
                    </span>
                  </div>

                  {/* Stock Compliance indicator */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 flex items-center gap-1 backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      H.264
                    </span>
                  </div>

                  {/* Duration pill */}
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-800">
                    {item.duration}s
                  </div>
                </div>

                {/* Content Metadata */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 
                      className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors cursor-pointer"
                      onClick={() => onSelectVideo(item)}
                    >
                      {item.adobeStockMetadata?.title || item.prompt}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>

                  {/* Stock Tags preview */}
                  {item.adobeStockMetadata?.keywords && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.adobeStockMetadata.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[9px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          #{kw}
                        </span>
                      ))}
                      {item.adobeStockMetadata.keywords.length > 3 && (
                        <span className="text-[9px] font-mono text-indigo-400">
                          +{item.adobeStockMetadata.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      {/* Inspect Metadata */}
                      <button
                        type="button"
                        onClick={() => onOpenMetadataModal(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Adobe Stock Title, Tags & CSV"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {/* Upscale */}
                      {!item.isUpscaled && (
                        <button
                          type="button"
                          onClick={() => onUpscaleVideo(item)}
                          className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 transition-colors cursor-pointer"
                          title="Upscale to 4K"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Download */}
                      <a
                        href={item.adobeStockUrl || item.upscaled4kUrl || item.videoUrl}
                        download={`motionai-${item.id}.mp4`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Download Stock MP4"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteVideo(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove clip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

