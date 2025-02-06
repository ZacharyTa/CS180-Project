"use client";

import { useState, useCallback } from "react";
import RecipeCarousel from "@/components/recipe-carousel";
import RecipeComponent from "@/components/recipe";

// Function to generate a new video object
const generateVideo = (id: number) => ({
  id,
  src: `/video${(id % 3) + 1}.mp4`, // Cycle through video1.mp4, video2.mp4, video3.mp4
});

// Initial videos
const initialVideos = Array.from({ length: 5 }, (_, i) => generateVideo(i + 1));

export default function Home() {
  const [videos, setVideos] = useState(initialVideos);

  const loadMoreVideos = useCallback(() => {
    console.log("Loading more videos");
    const newVideos = Array.from({ length: 5 }, (_, i) =>
      generateVideo(videos.length + i + 1)
    );
    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos, ...newVideos];
      console.log("Updated videos length:", updatedVideos.length);
      // Keep only the last 20 videos
      //return updatedVideos.slice(-20)
      return updatedVideos;
    });
  }, [videos.length]);

  return (
    <main className="h-screen w-full bg-black">
      <RecipeCarousel onLastSlide={loadMoreVideos}>
        {videos.map((video) => (
          <RecipeComponent key={video.id} src={video.src} />
        ))}
      </RecipeCarousel>
    </main>
  );
}
