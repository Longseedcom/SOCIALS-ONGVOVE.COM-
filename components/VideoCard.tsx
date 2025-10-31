import React, { useEffect, useState, useRef } from 'react';
import type { SocialPost } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, LinkIcon, ZaloIcon, PlayIcon, WarningIcon } from './icons';
import { loadYouTubeAPI } from '../services/youtubeService';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
    tiktok?: { load: () => void };
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoCardProps {
  post: SocialPost;
  onLike: (id: number) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [playYouTube, setPlayYouTube] = useState(false);
  const [youtubeError, setYoutubeError] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerId = `youtube-player-${post.id}`;

  useEffect(() => {
    // Handle non-YouTube embeds
    if (post.platform !== 'YouTube' && post.isEmbeddable) {
      if (post.platform === 'Instagram' && window.instgrm) {
        window.instgrm.Embeds.process();
      }
      if (post.platform === 'TikTok' && window.tiktok) {
        setTimeout(() => window.tiktok?.load(), 100);
      }
    }

    // Handle YouTube Player API logic
    if (post.platform === 'YouTube' && playYouTube && post.videoId && !youtubeError) {
      const createPlayer = () => {
        if (playerRef.current) {
           playerRef.current.destroy();
        }
        playerRef.current = new window.YT.Player(playerContainerId, {
          height: '100%',
          width: '100%',
          videoId: post.videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 1,
            rel: 0, // Do not show related videos from other channels
            modestbranding: 1, // Reduce YouTube logo
            origin: window.location.origin,
          },
          events: {
            'onError': (event: any) => {
              console.error('YouTube Player Error:', event.data, 'for video ID:', post.videoId);
              setYoutubeError(true);
            },
          },
        });
      };
      
      loadYouTubeAPI().then(createPlayer);
    }
    
    // Cleanup YouTube player on component unmount
    return () => {
        if (playerRef.current) {
            playerRef.current.destroy();
        }
    }

  }, [post.id, post.platform, playYouTube, post.videoId, playerContainerId, youtubeError]);

  const handleLike = () => {
    onLike(post.id);
    setIsLiked(!isLiked);
  };

  const handlePlayClick = () => {
    setYoutubeError(false); // Reset error before attempting to play
    setPlayYouTube(true);
  };
  
  const handleShare = () => {
    if(navigator.share) {
      navigator.share({
        title: post.caption || 'Check out this video!',
        url: post.videoUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(post.videoUrl);
      alert('Link copied to clipboard!');
    }
  };

  const platformColors: Record<string, string> = {
    YouTube: 'border-red-500',
    TikTok: 'border-black',
    Facebook: 'border-blue-600',
    Instagram: 'border-pink-500',
    Zalo: 'border-blue-500',
  };

  const renderVideoContent = () => {
    if (!post.isEmbeddable) {
        return (
            <div className="relative aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-center p-4">
                <ZaloIcon className="w-16 h-16 mb-4" />
                <p className="text-white font-semibold mb-4">Zalo videos can't be played here.</p>
                <a 
                    href={post.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Watch on Zalo
                </a>
            </div>
        );
    }

    if (post.platform === 'YouTube' && post.thumbnail) {
      if (youtubeError) {
        return (
            <div className="relative aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-center p-4">
                <WarningIcon className="w-12 h-12 text-yellow-400 mb-3" />
                <p className="text-white font-semibold mb-2">Playback Error</p>
                <p className="text-slate-300 text-sm mb-4">The owner has disabled playback on other websites.</p>
                <a 
                    href={post.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Watch on YouTube
                </a>
            </div>
        );
      }
      
      if (!playYouTube) {
        return (
          <div
            className="relative aspect-video w-full bg-black cursor-pointer group"
            onClick={handlePlayClick}
          >
            <img
              src={post.thumbnail}
              alt={post.caption || 'Video thumbnail'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-50">
              <PlayIcon className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>
        );
      }
      // This div is where the YouTube Player API will inject the iframe
      return (
        <div className="aspect-video w-full bg-black">
          <div id={playerContainerId} className="w-full h-full"></div>
        </div>
      );
    }
    
    // Fallback for other embeddable platforms
    return (
       <div className="aspect-video w-full bg-black">
        <div 
            className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_blockquote]:h-full [&_blockquote]:w-full"
            dangerouslySetInnerHTML={{ __html: post.iframe }} 
        />
       </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1.5 border-b-4 ${platformColors[post.platform] || 'border-slate-300'}`}>
      {renderVideoContent()}
      <div className="p-4">
        {post.caption && <p className="font-semibold text-slate-800 dark:text-white truncate">{post.caption}</p>}
        {post.hashtag && <p className="text-sm text-sky-500 dark:text-sky-400 truncate">{post.hashtag}</p>}
      </div>
      <div className="px-4 pb-4 flex items-center justify-between text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className="flex items-center space-x-1.5 group">
            <HeartIcon className={`w-6 h-6 group-hover:text-red-500 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="font-medium text-sm group-hover:text-slate-800 dark:group-hover:text-white">{post.likes}</span>
          </button>
          <button className="flex items-center space-x-1.5 group">
            <CommentIcon className="w-6 h-6 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
          </button>
          <button onClick={handleShare} className="flex items-center space-x-1.5 group">
            <ShareIcon className="w-6 h-6 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
          </button>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(post.videoUrl); alert('Link copied!'); }} className="group">
          <LinkIcon className="w-6 h-6 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;