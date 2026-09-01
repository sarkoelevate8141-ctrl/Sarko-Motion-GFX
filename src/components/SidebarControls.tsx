import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Square, 
  Maximize2,
  Camera, 
  Sun, 
  Cpu, 
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';
import { AspectRatio, VideoDuration, VideoEngine, CameraShotStyle, LightingPreset } from '../types';

interface SidebarControlsProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  duration: VideoDuration;
  setDuration: (val: VideoDuration) => void;
  cameraMotion: number;
  setCameraMotion: (val: number) => void;
  cameraStyle: CameraShotStyle;
  setCameraStyle: (val: CameraShotStyle) => void;
  lighting: LightingPreset;
  setLighting: (val: LightingPreset) => void;
  engine: VideoEngine;
  setEngine: (val: VideoEngine) => void;
  enable4kUpscale: boolean;
  setEnable4kUpscale: (val: boolean) => void;
  adobeStockStandard: boolean;
  setAdobeStockStandard: (val: boolean) => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  aspectRatio,
  setAspectRatio,
  duration,
  setDuration,
  cameraMotion,
  setCameraMotion,
  cameraStyle,
  setCameraStyle,
  lighting,
  setLighting,
  engine,
  setEngine,
  enable4kUpscale,
  setEnable4kUpscale,
  adobeStockStandard,
  setAdobeStockStandard,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  const getMotionDescription = (val: number) => {
    if (val <= 3) return 'Subtle Micro Drift — Nature & Ambient B-Roll';
    if (val <= 6) return 'Smooth Cinematic Glide — High Stock Licensing Rate';
    if (val <= 8) return 'Dynamic Tracking Pan — Vehicle & Action Motion';
    return 'High-Velocity FPV Rush — Extreme Dynamic Flight';
  };

  const aspectOptions: { id: AspectRatio; label: string; icon: React.ReactNode; sub: string }[] = [
    { 
      id: '16:9', 
      label: '16:9', 
      icon: <Monitor className="w-3.5 h-3.5" />, 
      sub: 'Landscape 4K' 
    },
    { 
      id: '9:16', 
      label: '9:16', 
      icon: <Smartphone className="w-3.5 h-3.5" />, 
      sub: 'Vertical Story' 
    },
    { 
      id: '1:1', 
      label: '1:1', 
      icon: <Square className="w-3.5 h-3.5" />, 
      sub: 'Square 1:1' 
    },
    { 
      id: '21:9', 
      label: '21:9', 
      icon: <Maximize2 className="w-3.5 h-3.5" />, 
      sub: 'Cinema Scope' 
    },
  ];

  const cameraStyles: { id: CameraShotStyle; label: string; desc: string }[] = [
    { id: 'cinematic-aerial', label: 'Cinematic Aerial Drone', desc: 'Smooth sweeping high-altitude flight' },
    { id: 'drone-fpv', label: 'FPV Low-Altitude Cruise', desc: 'Fast dynamic proximity flight' },
    { id: 'macro-8k', label: '8K Macro Extreme Close-Up', desc: 'Shallow depth of field micro details' },
    { id: 'slowmo-gimbal', label: '1000fps Slow-Mo Gimbal', desc: 'High-speed fluid fluid physics' },
    { id: 'steadicam-track', label: 'Steadicam Orbit Tracking', desc: '360° fluid subject framing' },
    { id: 'static-tripod', label: 'Static Locked Cinema Tripod', desc: 'Ultra-stable clean time-lapse/b-roll' },
  ];

  const lightingPresets: { id: LightingPreset; label: string }[] = [
    { id: 'golden-hour', label: 'Golden Hour' },
    { id: 'moody-rim', label: 'Moody Rim' },
    { id: 'studio-softbox', label: 'Studio Softbox' },
    { id: 'crisp-daylight', label: 'Crisp Daylight' },
    { id: 'cyberpunk-neon', label: 'Cyberpunk Neon' },
    { id: 'cinematic-film', label: '35mm Film Noir' },
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 studio-panel rounded-2xl p-4 sm:p-5 flex flex-col gap-5">
      {/* Mobile Drawer Accordion Header */}
      <div className="flex lg:hidden items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Format & Cinematography
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
            {aspectRatio} • {duration}s • {enable4kUpscale ? '4K' : '1080p'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
        >
          {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Control Body (Always visible on desktop, toggleable on mobile) */}
      <div className={`${isMobileExpanded ? 'block' : 'hidden'} lg:block space-y-6`}>
        
        {/* Section 1: Output Format & Duration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              1. Format & Cadence
            </span>
            <span className="text-[10px] font-mono text-slate-500">30.00 FPS Standard</span>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {aspectOptions.map((opt) => {
                const isSelected = aspectRatio === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`btn-aspect-${opt.id.replace(':', '-')}`}
                    type="button"
                    onClick={() => setAspectRatio(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono">{opt.label}</span>
                      <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                        {opt.icon}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate">{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Shot Duration</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 5, label: '5 Seconds', sub: 'Quick B-Roll' },
                { val: 10, label: '10 Seconds', sub: 'Commercial Master' },
              ].map((d) => {
                const isSelected = duration === d.val;
                return (
                  <button
                    key={d.val}
                    id={`btn-duration-${d.val}s`}
                    type="button"
                    onClick={() => setDuration(d.val as VideoDuration)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{d.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{d.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Cinematography & Camera Parameters */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              2. Cinematography
            </span>
          </div>

          {/* Camera Motion Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-medium text-slate-300">Camera Velocity</span>
              <span className="text-indigo-400 font-bold font-mono text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {cameraMotion}.0x
              </span>
            </div>

            <div className="pt-1 pb-1">
              <input
                id="slider-camera-motion"
                type="range"
                min="1"
                max="10"
                step="1"
                value={cameraMotion}
                onChange={(e) => setCameraMotion(parseInt(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
              <span>Static / Locked</span>
              <span>Smooth Pan</span>
              <span>High Action</span>
            </div>

            <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-snug">
              {getMotionDescription(cameraMotion)}
            </div>
          </div>

          {/* Camera Shot Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Camera Framing & Rig</label>
            <select
              id="select-camera-style"
              value={cameraStyle}
              onChange={(e) => setCameraStyle(e.target.value as CameraShotStyle)}
              className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {cameraStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lighting & Atmosphere Preset */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Lighting Environment</label>
            <div className="grid grid-cols-2 gap-1.5">
              {lightingPresets.map((preset) => {
                const isSelected = lighting === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`btn-light-${preset.id}`}
                    type="button"
                    onClick={() => setLighting(preset.id)}
                    className={`px-2.5 py-2 rounded-lg text-left text-xs border transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: AI Engine & Mastering Profile */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              3. Model & Encoding
            </span>
          </div>

          {/* AI Engine Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Generative Model Engine</label>
            <select
              id="select-ai-engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value as VideoEngine)}
              className="w-full bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            >
              <option value="minimax/video-01">Minimax Video-01 (High Coherence)</option>
              <option value="bytedance/wan-2.1-t2v-1.3b">Wan 2.1 T2V (Fluid Physics)</option>
              <option value="veo-3.1-generate-preview">Google Veo 3.1 (Cinematic Lighting)</option>
              <option value="cinematic-sora">Sora Studio AI (Stock Benchmark)</option>
            </select>
          </div>

          {/* 4K Topaz-Grade AI Upscaler Toggle */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">4K UHD Upscaling</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-4k-upscale"
                  type="checkbox"
                  checked={enable4kUpscale}
                  onChange={(e) => setEnable4kUpscale(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 cursor-pointer"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Upscales raster latents to 3840×2160 resolution with high-frequency edge restoration.
            </p>
          </div>

          {/* Adobe Stock CRF 18 Compliance Switch */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Adobe Stock H.264</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-adobe-stock-standard"
                  type="checkbox"
                  checked={adobeStockStandard}
                  onChange={(e) => setAdobeStockStandard(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 cursor-pointer"></div>
              </label>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Applies FFmpeg <code className="text-emerald-300 font-mono text-[10px]">-c:v libx264 -pix_fmt yuv420p -crf 18 -an</code>.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

