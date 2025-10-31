export type Platform = 'YouTube' | 'TikTok' | 'Facebook' | 'Instagram' | 'Zalo' | 'Unknown';

export interface SocialPost {
  id: number;
  videoUrl: string;
  iframe: string;
  platform: Platform;
  caption: string;
  hashtag: string;
  thumbnail?: string;
  likes: number;
  isEmbeddable: boolean;
  videoId?: string; // For YouTube player API
}