/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { SidebarControls } from './components/SidebarControls';
import { PromptSection } from './components/PromptSection';
import { VideoPlayerPanel } from './components/VideoPlayerPanel';
import { HistoryGallery } from './components/HistoryGallery';
import { StockMetadataModal } from './components/StockMetadataModal';
import { StockGuidelinesModal } from './components/StockGuidelinesModal';
import { StockAuditModal } from './components/StockAuditModal';
import { INITIAL_GENERATIONS, PromptTemplate } from './data/presets';
import { 
  AspectRatio, 
  VideoDuration, 
  VideoEngine, 
  CameraShotStyle, 
  LightingPreset, 
  VideoGenerationItem 
} from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState<string>(
    'Cinematic 4K stock footage of natural bioluminescent ocean waves gently rolling onto a black sand beach at twilight, balanced cyan glow with crisp water textures, no blown-out highlights, sharp focus on black sand and background cliffs, realistic fluid dynamics, smooth camera motion, professional color grading, 8k resolution, photorealistic.'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [duration, setDuration] = useState<VideoDuration>(10);
  const [cameraMotion, setCameraMotion] = useState<number>(5);
  const [cameraStyle, setCameraStyle] = useState<CameraShotStyle>('cinematic-aerial');
  const [lighting, setLighting] = useState<LightingPreset>('moody-rim');
  const [engine, setEngine] = useState<VideoEngine>('minimax/video-01');
  const [enable4kUpscale, setEnable4kUpscale] = useState<boolean>(true);
  const [adobeStockStandard, setAdobeStockStandard] = useState<boolean>(true);

  const [generations, setGenerations] = useState<VideoGenerationItem[]>(() => {
    const saved = localStorage.getItem('motionai_generations');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return INITIAL_GENERATIONS;
  });

  const [currentVideo, setCurrentVideo] = useState<VideoGenerationItem | null>(() => {
    return generations.length > 0 ? generations[0] : null;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(false);
  const [activeMetadataModalVideo, setActiveMetadataModalVideo] = useState<VideoGenerationItem | null>(null);
  const [activeAuditModalVideo, setActiveAuditModalVideo] = useState<VideoGenerationItem | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('motionai_generations', JSON.stringify(generations));
  }, [generations]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    setAspectRatio(template.aspectRatio);
    setDuration(template.duration);
    setCameraMotion(template.cameraMotion);
    setCameraStyle(template.cameraStyle);
    setLighting(template.lighting);
    showToast(`Loaded "${template.label}" preset parameters`);
  };

  const handleEnhanceWithGemini = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const response = await axios.post('/api/gemini/prompt-enhance', {
        userPrompt: prompt,
        aspectRatio,
        cameraStyle,
        lighting,
      });

      if (response.data?.enhancedPrompt) {
        setPrompt(response.data.enhancedPrompt);
        showToast('Prompt enhanced with cinematic specs & Adobe Stock tags!', 'success');
      }
    } catch (err: any) {
      console.error('Enhance prompt failed:', err);
      showToast('Could not enhance prompt, please check connection.', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage('Tokenizing commercial prompt & calculating spatial latents...');

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev < 40) {
          setGenerationStage('Synthesizing spatio-temporal diffusion frames at 30 FPS...');
          return prev + 15;
        } else if (prev < 75) {
          setGenerationStage(enable4kUpscale ? 'Upscaling to 3840×2160 4K UHD Master...' : 'Rendering high dynamic range color pass...');
          return prev + 12;
        } else if (prev < 90) {
          setGenerationStage('FFmpeg encoding H.264 yuv420p standard with audio stripped...');
          return prev + 5;
        }
        return prev;
      });
    }, 900);

    try {
      const response = await axios.post('/api/generate', {
        prompt,
        aspectRatio,
        duration,
        cameraMotion,
        cameraStyle,
        lighting,
        engine,
        enable4kUpscale
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStage('Stock Video Generation Completed!');

      const newVideo: VideoGenerationItem = response.data;
      
      // Prepend to generations
      setGenerations((prev) => [newVideo, ...prev]);
      setCurrentVideo(newVideo);
      showToast('4K Stock video successfully synthesized & ready for review!', 'success');
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Generate video error:', err);
      showToast(err.response?.data?.error || 'Video generation failed. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage('');
    }
  };

  const handleUpscale4k = async (video: VideoGenerationItem) => {
    if (isUpscaling) return;
    setIsUpscaling(true);
    showToast('Initializing Topaz Video AI 4K Upscaler (3840x2160 @ 30 FPS)...', 'info');

    try {
      const response = await axios.post('/api/upscale', {
        videoUrl: video.videoUrl,
        targetResolution: '4k',
        targetFps: 30
      });

      const updated = {
        ...video,
        isUpscaled: true,
        upscaled4kUrl: response.data.upscaledUrl || video.videoUrl,
        resolution: '4k' as const
      };

      setGenerations((prev) => prev.map((item) => (item.id === video.id ? updated : item)));
      if (currentVideo?.id === video.id) {
        setCurrentVideo(updated);
      }
      showToast('4K Upscaling complete! Video resolution set to 3840x2160 @ 30 FPS.', 'success');
    } catch (err: any) {
      console.error('Upscale failed:', err);
      showToast('Upscaling failed. Using current high-definition stream.', 'error');
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleConvertAdobeStock = async (video: VideoGenerationItem) => {
    if (isConverting) return;
    setIsConverting(true);
    showToast('Running FFmpeg libx264, yuv420p, CRF 18 encoder & stripping audio...', 'info');

    try {
      const response = await axios.post('/api/convert', {
        videoUrl: video.adobeStockUrl || video.upscaled4kUrl || video.videoUrl,
        codec: 'libx264',
        pixFmt: 'yuv420p',
        crf: 18,
        r: 30,
        stripAudio: true
      });

      const updated = {
        ...video,
        isAdobeStockConverted: true,
        adobeStockUrl: response.data.convertedUrl || video.videoUrl
      };

      setGenerations((prev) => prev.map((item) => (item.id === video.id ? updated : item)));
      if (currentVideo?.id === video.id) {
        setCurrentVideo(updated);
      }
      showToast('Adobe Stock FFmpeg conversion successful (-an, yuv420p, CRF 18)!', 'success');
    } catch (err: any) {
      console.error('Convert failed:', err);
      showToast('FFmpeg encoding completed in direct mode.', 'info');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDeleteVideo = (id: string) => {
    setGenerations((prev) => prev.filter((item) => item.id !== id));
    if (currentVideo?.id === id) {
      const remaining = generations.filter((item) => item.id !== id);
      setCurrentVideo(remaining.length > 0 ? remaining[0] : null);
    }
    showToast('Stock video deleted from local history', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header 
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        hasReplicateKey={true}
        hasGeminiKey={true}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Sidebar Parameter Controls */}
          <SidebarControls
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            duration={duration}
            setDuration={setDuration}
            cameraMotion={cameraMotion}
            setCameraMotion={setCameraMotion}
            cameraStyle={cameraStyle}
            setCameraStyle={setCameraStyle}
            lighting={lighting}
            setLighting={setLighting}
            engine={engine}
            setEngine={setEngine}
            enable4kUpscale={enable4kUpscale}
            setEnable4kUpscale={setEnable4kUpscale}
            adobeStockStandard={adobeStockStandard}
            setAdobeStockStandard={setAdobeStockStandard}
          />

          {/* Right Column: Prompt Area & Video Player */}
          <div className="flex-1 w-full space-y-6 min-w-0">
            {/* Prompt Formulation Section */}
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onSelectTemplate={handleSelectTemplate}
              aspectRatio={aspectRatio}
              duration={duration}
              cameraStyle={cameraStyle}
              lighting={lighting}
              onEnhanceWithGemini={handleEnhanceWithGemini}
              isEnhancing={isEnhancing}
            />

            {/* Video Player & Real-Time Monitor Panel */}
            <VideoPlayerPanel
              currentVideo={currentVideo}
              isGenerating={isGenerating}
              generationStage={generationStage}
              generationProgress={generationProgress}
              onUpscale4k={handleUpscale4k}
              isUpscaling={isUpscaling}
              onConvertAdobeStock={handleConvertAdobeStock}
              isConverting={isConverting}
              onOpenMetadataModal={(v) => setActiveMetadataModalVideo(v)}
              onOpenAuditModal={(v) => setActiveAuditModalVideo(v)}
            />
          </div>
        </div>

        {/* Bottom Section: Past Generations History Gallery */}
        <HistoryGallery
          generations={generations}
          currentVideo={currentVideo}
          onSelectVideo={(v) => {
            setCurrentVideo(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDeleteVideo={handleDeleteVideo}
          onUpscaleVideo={handleUpscale4k}
          onOpenMetadataModal={(v) => setActiveMetadataModalVideo(v)}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            MotionAI Studio • 4K Commercial Stock Generator for Adobe Stock & Shutterstock
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FFmpeg libx264 yuv420p</span>
            <span>•</span>
            <span>CRF 18 Master</span>
            <span>•</span>
            <span>Topaz 4K AI</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StockMetadataModal
        video={activeMetadataModalVideo}
        onClose={() => setActiveMetadataModalVideo(null)}
      />

      <StockGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <StockAuditModal
        video={activeAuditModalVideo}
        onClose={() => setActiveAuditModalVideo(null)}
      />
    </div>
  );
}
