import React, { useState } from 'react';

interface VideoFormProps {
  onAddPost: (videoUrl: string, caption: string, hashtag: string) => void;
  isLoading: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ onAddPost, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
        setError('Video URL is required.');
        return;
    }
    setError('');
    onAddPost(videoUrl, caption, hashtag);
    setVideoUrl('');
    setCaption('');
    setHashtag('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6">🎬 Post a New Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Video URL</label>
          <input
            id="video_url"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Paste a YouTube, TikTok, Facebook, Zalo, or Instagram link"
            required
          />
        </div>
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Caption</label>
          <input
            id="caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Add a cool caption"
          />
        </div>
        <div>
          <label htmlFor="hashtag" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Hashtags</label>
          <input
            id="hashtag"
            type="text"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="#viral #video #feed"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Post Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoForm;