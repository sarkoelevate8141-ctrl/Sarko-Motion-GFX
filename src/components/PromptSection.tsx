import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Send, 
  RefreshCw, 
  Tag, 
  Flame,
  Film,
  Check
} from 'lucide-react';
import { PROMPT_TEMPLATES, PromptTemplate } from '../data/presets';
import { AspectRatio, VideoDuration, CameraShotStyle, LightingPreset } from '../types';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSelectTemplate: (template: PromptTemplate) => void;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraStyle: CameraShotStyle;
  lighting: LightingPreset;
  onEnhanceWithGemini: () => Promise<void>;
  isEnhancing: boolean;
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  onSelectTemplate,
  aspectRatio,
  duration,
  cameraStyle,
  lighting,
  onEnhanceWithGemini,
  isEnhancing
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedPill, setCopiedPill] = useState<string | null>(null);

  const categories = ['All', 'Technology & AI', 'Nature & Travel', 'Commercial & Lifestyle', 'Clean Energy & Future', 'Social & Vertical'];

  const filteredTemplates = selectedCategory === 'All' 
    ? PROMPT_TEMPLATES 
    : PROMPT_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleCopyTag = (tag: string) => {
    setPrompt(prompt ? `${prompt}, ${tag}` : tag);
    setCopiedPill(tag);
    setTimeout(() => setCopiedPill(null), 1500);
  };

  const trendingTags = [
    '8K photorealistic', 'RED V-Raptor camera', 'Cooke Anamorphic lens', 
    'slow motion 60fps', 'volumetric fog', 'golden hour rim light',
    'shallow depth of field', 'clean commercial stock', 'yuv420p master'
  ];

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Main Textarea Container */}
      <div className="studio-panel rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Prompt Formulation Engine
            </span>
          </div>

          {/* Enhance with Gemini Button */}
          <button
            id="btn-gemini-enhance"
            type="button"
            onClick={onEnhanceWithGemini}
            disabled={isEnhancing || isGenerating || !prompt.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Optimizes lighting, camera framing, lens specs, and keywords for commercial stock acceptance using Gemini Pro"
          >
            <Wand2 className={`w-3.5 h-3.5 text-indigo-400 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Directing Scene...' : 'AI Scene Directing'}</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5">
          <textarea
            id="input-video-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your cinematic stock footage scene (e.g., Drone aerial shot of misty pine mountains at sunrise, 8K resolution, photorealistic)..."
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-y min-h-[96px] leading-relaxed"
          />
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 font-mono gap-2">
            <span>{prompt.length} characters</span>
            <span className="text-slate-500 hidden sm:inline">
              Target: 100-250 characters for peak stock licensing quality
            </span>
          </div>
        </div>

        {/* Dynamic Tag Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-slate-500" />
            Quick Modifiers:
          </span>
          {trendingTags.map((tag) => {
            const isJustAdded = copiedPill === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleCopyTag(tag)}
                className={`text-[11px] font-mono px-2 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                  isJustAdded
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {isJustAdded ? <Check className="w-3 h-3 text-emerald-400" /> : <span>+</span>}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Generate Button Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
              {aspectRatio}
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
              {duration}s
            </span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">
              30 FPS
            </span>
            <span className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              H.264 CRF 18
            </span>
          </div>

          <button
            id="btn-generate-video"
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>SYNTHESIZING VIDEO...</span>
              </>
            ) : (
              <>
                <span>GENERATE MASTER CLIP</span>
                <Send className="w-4 h-4 text-indigo-200" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Stock Prompts Showcase */}
      <div className="studio-panel rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Commercial Stock Shot Presets
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            1-Click Parameter Loading
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              id={`btn-template-${template.id}`}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className="studio-card group text-left p-2.5 rounded-xl flex items-center gap-3 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative bg-slate-950 border border-slate-800">
                <img
                  src={template.previewUrl}
                  alt={template.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono bg-slate-950/90 text-indigo-300 px-1 rounded border border-slate-800">
                  {template.duration}s
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                  {template.label}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {template.prompt}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500">
                  <span className="text-indigo-400">{template.category}</span>
                  <span>•</span>
                  <span>{template.aspectRatio}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

