import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";

import { FadeLoader } from "react-spinners";

import "./watchCourses.css";

import axios from "axios";

function extractVideoId(url) {
  const regex =
    /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
}

function WatchCourses() {
  const navigate = useNavigate();
  // const [loading, setIsLoading] = useState(true);

  const { courseId } = useParams();
  const { state } = useLocation();

  const videoUrl = state?.videoUrl;

  const videoId = extractVideoId(videoUrl);

  const [player, setPlayer] = useState(null);
  const [duration, setDuration] = useState(0);
  const [timeWatched, setTimeWatched] = useState(0);

  const goToDashboard = () => {
    navigate("/progress", {
      state: {
        timeWatched,
        duration,
        progress: (timeWatched / duration) * 100,
      },
    });
  };

  const onPlayerReady = (event) => {
    const youtubePlayer = event.target;
    setPlayer(youtubePlayer);

    setTimeout(() => {
      const total = youtubePlayer.getDuration();
      setDuration(total);

      if (total > 0) setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();

      if (duration === 0 || currentTime === 0) return;

      setTimeWatched(currentTime);

      //   const progress = (currentTime / duration) * 100;

      axios.post("http://localhost:4000/course/updateProgress", {
        userId: localStorage.getItem("userId"),
        courseId,
        timeWatched: currentTime,
        totalDuration: duration,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [player, duration]);

  return (
    <div style={{ padding: "20px" }} className="youtube">
      <h2>Start Learning</h2>
{/* 
      {loading ? ( */}
        {/* <div className="loader-wrapper">
          <FadeLoader />
        </div> */}
      {/* ) : ( */}
        <>
          <YouTube
            videoId={videoId}
            opts={{
              width: "800",
              height: "450",
              playerVars: { autoplay: 1 },
            }}
            onReady={onPlayerReady}
          />

          <button onClick={goToDashboard} className="Ybutton">
            See your Progress
          </button>
        </>
       {/* )}  */}
    </div>
  );
}

export default WatchCourses;
