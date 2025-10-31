import React, { useState } from 'react';
import type { SocialPost } from './types';
import VideoForm from './components/VideoForm';
import VideoFeed from './components/VideoFeed';
import { parseVideoUrl } from './services/videoService';

const App: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPost = (videoUrl: string, caption: string, hashtag: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay for a better UX
    setTimeout(() => {
        const parsedData = parseVideoUrl(videoUrl);

        if (parsedData) {
            const newPost: SocialPost = {
                id: Date.now(),
                videoUrl,
                caption,
                hashtag,
                likes: Math.floor(Math.random() * 1000), // Start with some random likes
                ...parsedData,
            };
            setPosts(prevPosts => [newPost, ...prevPosts]);
        } else {
            setError("Could not process this video URL. Please check the link and try again. Supported platforms are YouTube, TikTok, Facebook, Zalo, and Instagram.");
        }
        setIsLoading(false);
    }, 500);
  };

  const handleLikePost = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="py-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-4">
              <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                Multi-Platform Video Feed
              </h1>
              <p className="text-center text-slate-500 dark:text-slate-400 mt-1">Your entire social video world, in one place.</p>
          </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-12">
        <VideoForm onAddPost={handleAddPost} isLoading={isLoading} />
        
        {error && (
            <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        <VideoFeed posts={posts} onLikePost={handleLikePost} />
      </main>
      
      <footer className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;