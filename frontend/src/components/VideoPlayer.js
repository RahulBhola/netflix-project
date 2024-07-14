import React, { useState, useRef } from 'react';

const VideoPlayer = ({ videoUrl, onClose }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) {
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    const handleEnded = () => {
        // Optionally handle when the video ends
    };

    return (
        <div className="video-player">
            <video
                ref={videoRef}
                src={videoUrl}
                controls
                onEnded={handleEnded}
                className={isFullScreen ? 'fullscreen-video' : ''}
            />
            <button onClick={toggleFullScreen}>
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default VideoPlayer;
