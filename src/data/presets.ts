import { CameraShotStyle, LightingPreset, VideoGenerationItem } from '../types';

export interface PromptTemplate {
  id: string;
  category: string;
  label: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  duration: 5 | 10;
  cameraMotion: number;
  cameraStyle: CameraShotStyle;
  lighting: LightingPreset;
  keywords: string[];
  stockTitle: string;
  videoUrl: string;
  previewUrl: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'stock-bio-waves',
    category: 'Nature & Landscapes',
    label: 'Bioluminescent Ocean Waves',
    prompt: 'Cinematic 4K stock footage of natural bioluminescent ocean waves gently rolling onto a black sand beach at twilight, balanced cyan glow with crisp water textures, no blown-out highlights, sharp focus on black sand and background cliffs, realistic fluid dynamics, smooth camera motion, professional color grading, 8k resolution, photorealistic.',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 5,
    cameraStyle: 'cinematic-aerial',
    lighting: 'moody-rim',
    keywords: ['bioluminescent waves', 'black sand beach', 'cyan glow', 'twilight ocean', 'fluid dynamics', '4k stock footage', 'commercial b-roll'],
    stockTitle: 'Bioluminescent Cyan Ocean Waves Rolling on Black Sand Beach at Twilight 4K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stock-1',
    category: 'Technology & AI',
    label: 'Quantum Supercomputer Core',
    prompt: 'Ultra-realistic cinematic macro shot of a glowing quantum computing processor with pulsating optical fiber lasers, superconducting circuits, micro-lens bokeh, 8k resolution, photorealistic motion.',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 4,
    cameraStyle: 'macro-8k',
    lighting: 'cyberpunk-neon',
    keywords: ['quantum computing', 'ai processor', 'microchip', 'optics', 'technology background', 'cybersecurity', 'deep tech', '4k stock video'],
    stockTitle: 'Glowing Quantum Computing Core with Micro Optical Data Pulses 4K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stock-2',
    category: 'Nature & Travel',
    label: 'Misty Alpine Ridge at Sunrise',
    prompt: 'Dramatic cinematic aerial drone flight soaring through sunlit fog over jagged snow-covered alpine mountain peaks, golden morning radiance breaking through clouds, 60fps slow motion.',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 6,
    cameraStyle: 'cinematic-aerial',
    lighting: 'golden-hour',
    keywords: ['alpine drone', 'mountain sunrise', 'snow peaks', 'golden hour', 'wanderlust', 'nature documentary', 'cinematic stock'],
    stockTitle: 'Dramatic Aerial Drone Flight over Misty Mountain Peaks at Sunrise',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stock-3',
    category: 'Commercial & Lifestyle',
    label: 'Artisan Espresso Extraction',
    prompt: 'High-speed 1000fps phantom camera close-up of dark rich crema espresso dripping smoothly into a crystal clear glass cup, golden crema waves, warm cafe atmosphere.',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 2,
    cameraStyle: 'slowmo-gimbal',
    lighting: 'studio-softbox',
    keywords: ['espresso extraction', 'barista craft', 'coffee crema', 'slow motion', 'gourmet cafe', 'food commercial', '4k food b-roll'],
    stockTitle: 'Slow Motion Extreme Close-up of Rich Espresso Extraction with Crema',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stock-4',
    category: 'Clean Energy & Future',
    label: 'Offshore Wind Farm at Twilight',
    prompt: 'Majestic twilight aerial tracking shot over modern ocean wind turbines spinning steadily in deep blue waters, orange reflections on gentle ocean waves, sustainable energy future.',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 5,
    cameraStyle: 'steadicam-track',
    lighting: 'moody-rim',
    keywords: ['wind turbine', 'clean energy', 'renewable power', 'offshore wind', 'sustainable future', 'esg investing', 'green tech'],
    stockTitle: 'Offshore Wind Turbine Farm Spinning Over Ocean at Sunset 4K',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'stock-5',
    category: 'Social & Vertical',
    label: 'Neon Cyberpunk Street Walk',
    prompt: 'Vertical 9:16 cinematic steadicam tracking through a rainy neon-lit Tokyo street, vibrant violet and cyan reflections on wet asphalt, steam rising from grates.',
    aspectRatio: '9:16',
    duration: 5,
    cameraMotion: 7,
    cameraStyle: 'steadicam-track',
    lighting: 'cyberpunk-neon',
    keywords: ['tokyo street', 'rain reflections', 'neon lights', 'vertical video', 'tiktok broll', 'reels stock footage', 'cyberpunk city'],
    stockTitle: 'Vertical 9:16 Rainy Cyberpunk Neon Street Atmosphere with Reflections',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  }
];

export const INITIAL_GENERATIONS: VideoGenerationItem[] = [
  {
    id: 'gen-init-1',
    prompt: 'Cinematic 4K stock footage of natural bioluminescent ocean waves gently rolling onto a black sand beach at twilight, balanced cyan glow with crisp water textures, no blown-out highlights, sharp focus on black sand and background cliffs, realistic fluid dynamics, smooth camera motion, professional color grading, 8k resolution, photorealistic.',
    enhancedPrompt: 'Commercial stock footage: Epic cinematic aerial shot of glowing cyan bioluminescent ocean waves rolling onto a volcanic black sand beach at twilight. Balanced ambient luminescence, crisp foam textures without blown highlights, razor-sharp focus on volcanic sand and distant cliffs, fluid motion, 4K UHD ProRes/H.264 master.',
    aspectRatio: '16:9',
    duration: 10,
    cameraMotion: 5,
    cameraStyle: 'cinematic-aerial',
    lighting: 'moody-rim',
    resolution: '4k',
    fps: 30,
    engine: 'minimax/video-01',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    upscaled4kUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isUpscaled: true,
    isAdobeStockConverted: true,
    adobeStockUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    adobeStockMetadata: {
      title: 'Bioluminescent Cyan Ocean Waves Rolling on Black Sand Beach at Twilight 4K',
      category: 'Travel & Nature',
      keywords: ['bioluminescence', 'ocean waves', 'black sand', 'twilight', 'cyan glow', 'coastal', 'night ocean', 'fluid dynamics', 'stock footage', 'nature documentary', '4k uhd', 'b-roll', 'travel commercial'],
      commercialViabilityScore: 98,
      codec: 'libx264 (H.264)',
      pixelFormat: 'yuv420p',
      crf: 18,
      frameRate: 30,
      hasAudio: false,
      complianceNotes: [
        'Compliant with Adobe Stock 4K UHD Standard',
        'Audio track stripped for stock video submission',
        'Balanced luminescence without highlight clipping',
        'yuv420p 8-bit broad hardware decoder compatible',
        'CRF 18 visually lossless compression applied'
      ]
    },
    status: 'completed',
    progress: 100,
    createdAt: Date.now() - 3600000 * 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gen-init-2',
    prompt: 'Macro extreme close-up of robotic neural network chip with pulsing optical lasers and gold traces.',
    enhancedPrompt: 'Macro cinema shot: 8K extreme detail of quantum microchip motherboard, pulsing blue and amber laser circuits, shallow depth of field, high-tech silicon wafer architecture.',
    aspectRatio: '16:9',
    duration: 5,
    cameraMotion: 3,
    cameraStyle: 'macro-8k',
    lighting: 'cyberpunk-neon',
    resolution: '1080p',
    fps: 30,
    engine: 'bytedance/wan-2.1-t2v-1.3b',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isUpscaled: false,
    isAdobeStockConverted: true,
    adobeStockUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    adobeStockMetadata: {
      title: 'Macro Close-Up of Futuristic Neural Microchip with Optical Light Traces',
      category: 'Technology & AI',
      keywords: ['microchip', 'ai hardware', 'semiconductor', 'quantum computing', 'cyberpunk', 'technology broll', 'macro stock footage', 'circuits'],
      commercialViabilityScore: 92,
      codec: 'libx264 (H.264)',
      pixelFormat: 'yuv420p',
      crf: 18,
      frameRate: 30,
      hasAudio: false,
      complianceNotes: [
        'Adobe Stock 1080p HD compliant',
        'High contrast electronic micro traces verified',
        'Zero camera jitter / smooth rack focus'
      ]
    },
    status: 'completed',
    progress: 100,
    createdAt: Date.now() - 3600000 * 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
];

export const ADOBE_STOCK_CATEGORIES = [
  'Technology & AI',
  'Nature & Landscapes',
  'Business & Corporate',
  'Lifestyle & People',
  'Science & Medicine',
  'Travel & Destinations',
  'Food & Beverages',
  'Architecture & Real Estate',
  'Abstract & 3D Backgrounds',
  'Sustainability & Clean Energy'
];
