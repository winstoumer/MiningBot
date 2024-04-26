import React, { useRef } from 'react';

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Воспроизведение видео при монтировании компонента
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <video ref={videoRef} autoPlay loop muted>
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;
