export type AspectRatio = '16:9' | '9:16' | '1:1' | '21:9';
export type VideoDuration = 5 | 10;
export type VideoResolution = '1080p' | '4k' | '8k';

export type VideoEngine = 
  | 'minimax/video-01' 
  | 'bytedance/wan-2.1-t2v-1.3b' 
  | 'veo-3.1-generate-preview' 
  | 'cinematic-sora';

export type CameraShotStyle = 
  | 'cinematic-aerial' 
  | 'drone-fpv' 
  | 'macro-8k' 
  | 'slowmo-gimbal' 
  | 'orbiting-pan' 
  | 'steadicam-track' 
  | 'static-tripod';

export type LightingPreset = 
  | 'golden-hour' 
  | 'cyberpunk-neon' 
  | 'studio-softbox' 
  | 'moody-rim' 
  | 'crisp-daylight' 
  | 'cinematic-film';

export interface AdobeStockMetadata {
  title: string;
  category: string;
  keywords: string[];
  commercialViabilityScore: number; // 1-100
  codec: string;
  pixelFormat: string;
  crf: number;
  frameRate: number;
  hasAudio: boolean;
  complianceNotes: string[];
}

export interface VideoGenerationItem {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraMotion: number; // 1 to 10
  cameraStyle: CameraShotStyle;
  lighting: LightingPreset;
  resolution: VideoResolution;
  fps: number;
  engine: VideoEngine;
  videoUrl: string;
  upscaled4kUrl?: string;
  isUpscaled: boolean;
  isAdobeStockConverted: boolean;
  adobeStockUrl?: string;
  adobeStockMetadata?: AdobeStockMetadata;
  status: 'idle' | 'generating' | 'upscaling' | 'converting' | 'completed' | 'failed';
  progress: number;
  stageDescription?: string;
  createdAt: number;
  thumbnailUrl?: string;
  error?: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  aspectRatio: AspectRatio;
  duration: VideoDuration;
  cameraMotion?: number;
  cameraStyle?: CameraShotStyle;
  lighting?: LightingPreset;
  enable4kUpscale?: boolean;
  engine?: VideoEngine;
}

export interface UpscaleVideoRequest {
  videoUrl: string;
  targetResolution?: '4k' | '8k';
  targetFps?: number;
}

export interface ConvertVideoRequest {
  videoUrl: string;
  codec?: string;
  pixFmt?: string;
  crf?: number;
  preset?: string;
  r?: number;
  stripAudio?: boolean;
}

export interface PromptEnhanceResponse {
  enhancedPrompt: string;
  suggestedTitle: string;
  suggestedKeywords: string[];
  stockCategory: string;
  cameraTips: string;
  lightingTips: string;
}
