import type { Platform } from '../types';

interface ParsedVideoInfo {
  platform: Platform;
  iframe: string;
  thumbnail: string | undefined;
  isEmbeddable: boolean;
  videoId?: string;
}

export const parseVideoUrl = (url: string): ParsedVideoInfo | null => {
    let platform: Platform = 'Unknown';
    let iframe = '';
    let thumbnail: string | undefined = undefined;
    let videoId: string | undefined = undefined;

    // YouTube
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        videoId = youtubeMatch[1];
        platform = 'YouTube';
        iframe = ''; // Will be handled by the Player API
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        return { platform, iframe, thumbnail, isEmbeddable: true, videoId };
    }

    // TikTok
    if (url.includes('tiktok.com')) {
        const videoIdMatch = url.match(/video\/(\d+)/);
        const tiktokVideoId = videoIdMatch ? videoIdMatch[1] : '';

        platform = 'TikTok';
        iframe = `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${tiktokVideoId}" style="max-width: 605px; min-width: 325px; margin: 0 auto;"><section></section></blockquote>`;
        return { platform, iframe, thumbnail, isEmbeddable: true };
    }

    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
        platform = 'Facebook';
        const encodedUrl = encodeURIComponent(url);
        // Enable muted autoplay for Facebook videos.
        iframe = `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&autoplay=true&mute=1" style="border:none;overflow:hidden; width:100%; height:100%;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
        return { platform, iframe, thumbnail, isEmbeddable: true };
    }

    // Instagram
    if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
        platform = 'Instagram';
        iframe = `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="width:100%; max-width: 540px;"></blockquote>`;
        return { platform, iframe, thumbnail, isEmbeddable: true };
    }

    // Zalo
    const zaloRegex = /https?:\/\/zalo\.me\/v\/([a-zA-Z0-9]+)/;
    const zaloMatch = url.match(zaloRegex);
    if (zaloMatch) {
        platform = 'Zalo';
        // Zalo videos are not embeddable, so we'll handle this in the UI.
        iframe = '';
        thumbnail = undefined;
        return { platform, iframe, thumbnail, isEmbeddable: false };
    }


    return null;
};