self.addEventListener('activate', event => {
  event.waitUntil(caches.delete('story-narration-v1'));
});
