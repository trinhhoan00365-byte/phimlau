const videos = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  title: `Video ${i + 1}`,
  thumb: `https://picsum.photos/400/225?random=${i + 1}`,
  embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
}));
