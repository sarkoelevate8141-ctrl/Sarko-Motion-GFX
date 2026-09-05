import { AiProviderId } from '../types';

export interface ModelProviderInfo {
  providerId: AiProviderId;
  providerName: string;
  providerShortName: string;
  keyUrl: string;
  keyHint: string;
  modelLabel: string;
}

export const MODEL_PROVIDER_MAP: Record<string, ModelProviderInfo> = {
  'minimax/video-01': {
    providerId: 'replicate',
    providerName: 'Replicate (MiniMax Video-01)',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: 'MiniMax Hailuo Video-01'
  },
  'bytedance/wan-2.1-t2v-1.3b': {
    providerId: 'replicate',
    providerName: 'Replicate (Wan 2.1 Fast)',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: 'ByteDance Wan 2.1 Fast'
  },
  'wavespeedai/wan-2.1-t2v-720p': {
    providerId: 'replicate',
    providerName: 'Replicate (Wan 2.1 14B High-Res)',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: 'Wan 2.1 14B High-Res'
  },
  'kwaivgi/kling-v1.5': {
    providerId: 'replicate',
    providerName: 'Replicate / Kling (Kling v1.5 Pro)',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: 'Kling v1.5 Pro'
  },
  'luma/ray-2': {
    providerId: 'replicate',
    providerName: 'Replicate / Luma (Ray 2 Master)',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: 'Luma Ray 2 Master'
  },
  'fal-ai/wan-t2v': {
    providerId: 'fal',
    providerName: 'Fal.ai (Wan 2.1 14B Ultra)',
    providerShortName: 'Fal.ai',
    keyUrl: 'https://fal.ai/dashboard/keys',
    keyHint: 'fal_...',
    modelLabel: 'Fal.ai Wan 2.1 14B Ultra'
  },
  'fal-ai/wan-2.1-t2v': {
    providerId: 'fal',
    providerName: 'Fal.ai (Wan 2.1 14B Ultra)',
    providerShortName: 'Fal.ai',
    keyUrl: 'https://fal.ai/dashboard/keys',
    keyHint: 'fal_...',
    modelLabel: 'Fal.ai Wan 2.1 14B Ultra'
  },
  'fal-ai/hunyuan-video': {
    providerId: 'fal',
    providerName: 'Fal.ai (Tencent Hunyuan Video 4K)',
    providerShortName: 'Fal.ai',
    keyUrl: 'https://fal.ai/dashboard/keys',
    keyHint: 'fal_...',
    modelLabel: 'Fal.ai Hunyuan Video 4K'
  },
  'runway/gen-3-alpha': {
    providerId: 'runway',
    providerName: 'RunwayML (Gen-3 Alpha Turbo)',
    providerShortName: 'Runway',
    keyUrl: 'https://runwayml.com/api',
    keyHint: 'key_...',
    modelLabel: 'Runway Gen-3 Alpha'
  },
  'pika/pika-2.0': {
    providerId: 'pika',
    providerName: 'Pika Labs (Pika 2.0 Cinematic)',
    providerShortName: 'Pika',
    keyUrl: 'https://pika.art',
    keyHint: 'pika-...',
    modelLabel: 'Pika 2.0 Cinematic'
  },
  'google/veo-2': {
    providerId: 'veo',
    providerName: 'Google DeepMind (Veo 2 Master)',
    providerShortName: 'Google Veo',
    keyUrl: 'https://aistudio.google.com',
    keyHint: 'AIzaSy...',
    modelLabel: 'Google DeepMind Veo 2'
  }
};

export function getProviderInfoForModel(engine: string): ModelProviderInfo {
  if (MODEL_PROVIDER_MAP[engine]) {
    return MODEL_PROVIDER_MAP[engine];
  }
  if (engine.startsWith('fal-ai/') || engine.includes('fal')) {
    return {
      providerId: 'fal',
      providerName: 'Fal.ai Video Cloud',
      providerShortName: 'Fal.ai',
      keyUrl: 'https://fal.ai/dashboard/keys',
      keyHint: 'fal_...',
      modelLabel: engine
    };
  }
  if (engine.startsWith('runway/')) {
    return {
      providerId: 'runway',
      providerName: 'RunwayML',
      providerShortName: 'Runway',
      keyUrl: 'https://runwayml.com/api',
      keyHint: 'key_...',
      modelLabel: engine
    };
  }
  if (engine.startsWith('pika/')) {
    return {
      providerId: 'pika',
      providerName: 'Pika Labs',
      providerShortName: 'Pika',
      keyUrl: 'https://pika.art',
      keyHint: 'pika-...',
      modelLabel: engine
    };
  }
  if (engine.startsWith('google/') || engine.includes('veo')) {
    return {
      providerId: 'veo',
      providerName: 'Google Veo',
      providerShortName: 'Google Veo',
      keyUrl: 'https://aistudio.google.com',
      keyHint: 'AIzaSy...',
      modelLabel: engine
    };
  }
  return {
    providerId: 'replicate',
    providerName: 'Replicate AI Video',
    providerShortName: 'Replicate',
    keyUrl: 'https://replicate.com/account/api-tokens',
    keyHint: 'r8_...',
    modelLabel: engine
  };
}
