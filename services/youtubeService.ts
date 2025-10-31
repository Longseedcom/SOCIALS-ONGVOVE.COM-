// A singleton promise to ensure the API is loaded only once.
let apiPromise: Promise<void> | null = null;

export const loadYouTubeAPI = (): Promise<void> => {
  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise((resolve) => {
    // If the API is already loaded, resolve immediately.
    if (window.YT && window.YT.Player) {
      return resolve();
    }

    // Create a script tag and append it to the document.
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    
    // The official YouTube API docs recommend inserting the script before the first script tag.
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if(firstScriptTag && firstScriptTag.parentNode) {
       firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    } else {
        document.head.appendChild(script);
    }
    

    // The YouTube API will call this global function when it's ready.
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };

    // Add an error handler for the script tag
    script.onerror = () => {
        console.error("Failed to load the YouTube Iframe API.");
        // We might want to reject the promise here, but for simplicity,
        // we'll just log the error. The player creation will fail later.
    };
  });

  return apiPromise;
};
