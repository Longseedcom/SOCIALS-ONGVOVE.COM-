
import React from 'react';
import type { SocialPost } from '../types';
import VideoCard from './VideoCard';

interface VideoFeedProps {
  posts: SocialPost[];
  onLikePost: (id: number) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ posts, onLikePost }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">📱 Your Feed is Empty</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Post a video link above to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">📱 Video Feed</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <VideoCard key={post.id} post={post} onLike={onLikePost} />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
