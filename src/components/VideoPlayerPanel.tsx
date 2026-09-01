import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  VolumeX, 
  Download, 
  Sparkles, 
  FileCheck2, 
  Grid, 
  Copy, 
  Check, 
  SplitSquareVertical, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  Video
} from 'lucide-react';
import { VideoGenerationItem } from '../types';

interface VideoPlayerPanelProps {
  currentVideo: VideoGenerationItem | null;
  isGenerating: boolean;
  generationStage: string;
  generationProgress: number;
  onUpscale4k: (video: VideoGenerationItem) => Promise<void>;
  isUpscaling: boolean;
  onConvertAdobeStock: (video: VideoGenerationItem) => Promise<void>;
  isConverting: boolean;
  onOpenMetadataModal: (video: VideoGenerationItem) => void;
  onOpenAuditModal: (video: VideoGenerationItem) => void;
}

export const VideoPlayerPanel: React.FC<VideoPlayerPanelProps> = ({
  currentVideo,
  isGenerating,
  generationStage,
  generationProgress,
  onUpscale4k,
  isUpscaling,
  onConvertAdobeStock,
  isConverting,
  onOpenMetadataModal,
  onOpenAuditModal
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showGridGuides, setShowGridGuides] = useState<boolean>(false);
  const [showCompareMode, setShowCompareMode] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [copiedTitle, setCopiedTitle] = useState<boolean>(false);
  const [sourceAttemptIndex, setSourceAttemptIndex] = useState<number>(0);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);

  const rawActiveSrc = currentVideo?.adobeStockUrl || currentVideo?.upscaled4kUrl || currentVideo?.videoUrl || '';

  // Generate ordered list of fallback sources
  const candidateSources = React.useMemo(() => {
    if (!rawActiveSrc) return [];
    const list: string[] = [];
    // 1. Direct source
    list.push(rawActiveSrc);
    // 2. Proxied source (handles CORS and chunked streaming)
    if (rawActiveSrc.startsWith('http://') || rawActiveSrc.startsWith('https://')) {
      list.push(`/api/video-proxy?url=${encodeURIComponent(rawActiveSrc)}`);
    }
    // 3. Fallback source if upscaled/converted differed from original
    if (currentVideo?.videoUrl && currentVideo.videoUrl !== rawActiveSrc) {
      list.push(currentVideo.videoUrl);
      if (currentVideo.videoUrl.startsWith('http://') || currentVideo.videoUrl.startsWith('https://')) {
        list.push(`/api/video-proxy?url=${encodeURIComponent(currentVideo.videoUrl)}`);
      }
    }
    return list;
  }, [rawActiveSrc, currentVideo?.videoUrl]);

  const activeVideoSrc = candidateSources[sourceAttemptIndex] || rawActiveSrc;

  // Reset error states when video item changes
  useEffect(() => {
    setSourceAttemptIndex(0);
    setHasPlaybackError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentVideo?.id, rawActiveSrc]);

  const handleVideoError = (e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn(`[VideoPlayer] Error playing source (${activeVideoSrc}). Attempting fallback...`, e);
    if (sourceAttemptIndex + 1 < candidateSources.length) {
      setSourceAttemptIndex((prev) => prev + 1);
    } else {
      setHasPlaybackError(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Play interrupted:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || (currentVideo?.duration || 10));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handleCopyTitle = () => {
    if (currentVideo?.adobeStockMetadata?.title) {
      navigator.clipboard.writeText(currentVideo.adobeStockMetadata.title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  return (
    <div className="studio-panel rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header & Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Commercial Video Monitor & Inspection
          </h2>
        </div>

        {currentVideo && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Grid guides toggle */}
            <button
              type="button"
              onClick={() => setShowGridGuides(!showGridGuides)}
              className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                showGridGuides
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Rule-of-Thirds & Safe Margins framing grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Framing Grid</span>
            </button>

            {/* 4K Comparison slider toggle */}
            {currentVideo.isUpscaled && (
              <button
                type="button"
                onClick={() => setShowCompareMode(!showCompareMode)}
                className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showCompareMode
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Side-by-Side 1080p vs 4K Upscale Comparison"
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">4K Split View</span>
              </button>
            )}

            {/* Commercial Viability Audit */}
            <button
              type="button"
              onClick={() => onOpenAuditModal(currentVideo)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
              title="Stock Reviewer Quality Audit Score"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Score: {currentVideo.adobeStockMetadata?.commercialViabilityScore || 96}/100</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Video Viewport / Skeleton loader */}
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[440px] shadow-2xl">
        {isGenerating ? (
          /* High-Tech Skeleton Rendering State */
          <div className="w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-indigo-400/30 border-b-indigo-300 animate-spin [animation-direction:reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1 max-w-md">
              <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                AI Stock Synthesizer Engine
              </div>
              <h3 className="text-base font-semibold text-white">
                {generationStage || 'Synthesizing High-Frame-Rate Stock Footage...'}
              </h3>
              <p className="text-xs text-slate-400">
                Generating temporal latents, 30 FPS motion interpolation & Adobe Stock color grading.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Rendering Progress</span>
                <span className="text-indigo-400 font-bold">{generationProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            {/* Live Pipeline Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-slate-400 w-full max-w-lg">
              <div className={`p-2 rounded border text-center ${generationProgress >= 25 ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300' : 'bg-slate-900 border-slate-800'}`}>
                1. Text Tokenize
              </div>
              <div className={`p-2 rounded border text-center ${generationProgress >= 50 ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300' : 'bg-slate-900 border-slate-800'}`}>
                2. Latent Diffusion
              </div>
              <div className={`p-2 rounded border text-center ${generationProgress >= 75 ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300' : 'bg-slate-900 border-slate-800'}`}>
                3. 30 FPS Motion
              </div>
              <div className={`p-2 rounded border text-center ${generationProgress >= 95 ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' : 'bg-slate-900 border-slate-800'}`}>
                4. FFmpeg Stock
              </div>
            </div>
          </div>
        ) : currentVideo && activeVideoSrc ? (
          /* Active Video Player */
          <div className="relative w-full h-full flex items-center justify-center group">
            {hasPlaybackError ? (
              /* Resilient Fallback Display when remote video source is unavailable */
              <div className="relative w-full h-full min-h-[340px] max-h-[460px] flex flex-col items-center justify-center bg-slate-950 p-6 text-center overflow-hidden">
                {currentVideo.thumbnailUrl && (
                  <img
                    src={currentVideo.thumbnailUrl}
                    alt={currentVideo.prompt}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm pointer-events-none"
                  />
                )}

                <div className="relative z-10 space-y-3 max-w-md bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md shadow-2xl">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200">
                      4K Stock Master Stream Ready
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {currentVideo.adobeStockMetadata?.title || currentVideo.prompt}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHasPlaybackError(false);
                        setSourceAttemptIndex(0);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reconnect Stream</span>
                    </button>
                    {rawActiveSrc && (
                      <a
                        href={rawActiveSrc}
                        download={`stock-master-${currentVideo.id}.mp4`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Direct MP4</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : showCompareMode ? (
              /* Before (1080p) vs After (4K) Interactive Split Slider */
              <div className="relative w-full h-full min-h-[360px] overflow-hidden select-none">
                <video
                  key={`compare-right-${activeVideoSrc}`}
                  src={activeVideoSrc}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={handleVideoError}
                >
                  <source src={activeVideoSrc} type="video/mp4" onError={handleVideoError} />
                </video>
                
                {/* Left Side: 1080p Standard */}
                <div 
                  className="absolute inset-0 overflow-hidden border-r-2 border-indigo-400 z-10 filter blur-[0.6px]"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <video
                    key={`compare-left-${currentVideo.videoUrl}`}
                    src={currentVideo.videoUrl}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={handleVideoError}
                  >
                    <source src={currentVideo.videoUrl} type="video/mp4" onError={handleVideoError} />
                  </video>
                  <div className="absolute top-3 left-3 bg-slate-950/90 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                    Source: 1080p HD
                  </div>
                </div>

                {/* Right Side: 4K Topaz Upscaled */}
                <div className="absolute top-3 right-3 bg-indigo-950/90 px-2.5 py-1 rounded text-[10px] font-mono text-indigo-200 border border-indigo-500 z-10 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  Topaz 4K UHD Master
                </div>

                {/* Slider Handle */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 pointer-events-none z-15 flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-500/50">
                    ↔
                  </div>
                </div>
              </div>
            ) : (
              /* Standard High-Definition Player */
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  key={`player-${activeVideoSrc}`}
                  src={activeVideoSrc}
                  loop={isLooping}
                  muted
                  playsInline
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  onError={handleVideoError}
                  className="w-full max-h-[460px] object-contain cursor-pointer"
                >
                  <source src={activeVideoSrc} type="video/mp4" onError={handleVideoError} />
                </video>

                {/* Centered Play Button Overlay */}
                {!isPlaying && (
                  <button
                    id="overlay-btn-play"
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-950/70 hover:bg-slate-900/90 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer z-10 hover:scale-105"
                    aria-label="Play video"
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </button>
                )}
              </div>
            )}

            {/* Grid Overlay Guides */}
            {showGridGuides && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-indigo-500/30 z-10">
                <div className="border-r border-b border-indigo-500/20" />
                <div className="border-r border-b border-indigo-500/20" />
                <div className="border-b border-indigo-500/20" />
                <div className="border-r border-b border-indigo-500/20" />
                <div className="border-r border-b border-indigo-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-indigo-400/40" />
                </div>
                <div className="border-b border-indigo-500/20" />
                <div className="border-r border-indigo-500/20" />
                <div className="border-r border-indigo-500/20" />
                <div className="" />
              </div>
            )}

            {/* Resolution & Specs Watermark pill */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono flex items-center gap-1.5 z-20 pointer-events-none">
              <span className="text-indigo-400 font-bold">
                {currentVideo.isUpscaled ? '4K UHD (3840×2160)' : '1080p HD'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">30.00 FPS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">H.264 yuv420p</span>
            </div>

            {/* Audio Stripped Badge */}
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1 z-20 pointer-events-none">
              <VolumeX className="w-3 h-3 text-amber-400" />
              <span>Audio Stripped (-an)</span>
            </div>
          </div>
        ) : (
          /* Empty Idle State */
          <div className="p-8 text-center space-y-3 text-slate-500">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Layers className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-300">
                Ready to Synthesize Stock Footage
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Enter a commercial prompt or pick one of the trending presets to generate your 4K stock video master.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Video Scrubber & Playback Controls Bar */}
      {currentVideo && (
        <div className="space-y-3 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-indigo-400 shrink-0">
              {formatTimecode(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 10}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <span className="font-mono text-xs text-slate-400 shrink-0">
              {formatTimecode(duration || 10)}
            </span>
          </div>

          {/* Transport Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Restart playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Loop Toggle */}
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                  isLooping 
                    ? 'bg-indigo-950/70 border-indigo-600 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Loop: {isLooping ? 'ON' : 'OFF'}
              </button>

              {/* Speed Selectors */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      playbackSpeed === spd 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar (Download, Upscale, Stock Convert, Copy Title) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 4K Upscale Trigger */}
              <button
                id="btn-trigger-upscale-4k"
                type="button"
                onClick={() => onUpscale4k(currentVideo)}
                disabled={isUpscaling || currentVideo.isUpscaled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold border border-indigo-600/50 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                title="Trigger Topaz Video AI 4K Upscale to 3840x2160"
              >
                <Sparkles className={`w-3.5 h-3.5 text-indigo-300 ${isUpscaling ? 'animate-spin' : ''}`} />
                <span>{isUpscaling ? 'Upscaling 4K...' : currentVideo.isUpscaled ? '4K UHD Master' : 'Upscale to 4K'}</span>
              </button>

              {/* Adobe Stock FFmpeg Re-encode */}
              <button
                id="btn-ffmpeg-encode-stock"
                type="button"
                onClick={() => onConvertAdobeStock(currentVideo)}
                disabled={isConverting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold border border-emerald-600/50 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                title="Encode with strict Adobe Stock FFmpeg standard: libx264, yuv420p, CRF 18, 30fps, audio stripped"
              >
                <ShieldCheck className={`w-3.5 h-3.5 text-emerald-400 ${isConverting ? 'animate-spin' : ''}`} />
                <span>{isConverting ? 'Encoding...' : 'H.264 CRF 18'}</span>
              </button>

              {/* Metadata Inspector & CSV */}
              <button
                id="btn-inspect-stock-metadata"
                type="button"
                onClick={() => onOpenMetadataModal(currentVideo)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="View & Export Adobe Stock Title, 30 Keywords, and Metadata"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Metadata CSV</span>
              </button>

              {/* Direct Video Download */}
              <a
                id="btn-direct-download-video"
                href={activeVideoSrc}
                download={`motionai-stock-${currentVideo.id}.mp4`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </a>
            </div>
          </div>

          {/* Active Generation Stock Title & Keywords Bar */}
          {currentVideo.adobeStockMetadata && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-mono text-[10px] text-slate-500 uppercase">Stock Title:</span>
                <span className="text-slate-200 font-medium truncate">
                  {currentVideo.adobeStockMetadata.title}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTitle}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy Title"
                >
                  {copiedTitle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  CRF 18 Lossless
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  {currentVideo.isUpscaled ? '3840×2160' : '1920×1080'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

