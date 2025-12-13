import { useEffect, useRef, useState } from "react";
import "./video.css";

const videos = ["/media/lms1.mp4", "/media/lms2.mp4", "/media/lms3.mp4","/media/lms4.mp4"];
function Video() {
  const [activeIndex, setActiveIndex] = useState(0);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    if (!video1Ref.current || !video2Ref.current) return;

    video1Ref.current.src = videos[0];
    video1Ref.current.style.opacity = 1;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * videos.length);

      const v1 = video1Ref.current;
      const v2 = video2Ref.current;

      if (v1.style.opacity == "1") {
        v2.src = videos[randomIndex];
        v2.style.opacity = 1;
        v1.style.opacity = 0;
      } else {
        v1.src = videos[randomIndex];
        v1.style.opacity = 1;
        v2.style.opacity = 0;
      }
      setActiveIndex(randomIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [videos]);

  return (
    <div className="video-container">
      <video
        ref={video1Ref}
        autoPlay
        loop
        muted
        playsInline
        className="bgVideo"
      />
      <video
        ref={video2Ref}
        autoPlay
        loop
        muted
        playsInline
        className="bgVideo"
      />
    </div>
  );
}

export default Video;
