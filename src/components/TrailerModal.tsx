import { useEffect, useRef } from "react";

const TRAILER_VIDEO_SRC = "/Weapons _ Official Trailer.publer.com.mp4";
const TRAILER_START_TIME = 65;

interface TrailerModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function TrailerModal({ open, title, onClose }: TrailerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const video = videoRef.current;
    if (!video) return;

    const startTrailer = async () => {
      try {
        video.currentTime = TRAILER_START_TIME;
        await video.play();
      } catch {
        // Ignore autoplay/seek failures and leave controls available.
      }
    };

    if (video.readyState >= 1) {
      void startTrailer();
      return;
    }

    video.addEventListener("loadedmetadata", startTrailer, { once: true });
    return () => video.removeEventListener("loadedmetadata", startTrailer);
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="trailer-modal" role="presentation" onClick={onClose}>
      <div
        className="trailer-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} trailer`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="trailer-modal__close" onClick={onClose} aria-label="Close trailer">
          ×
        </button>
        <video
          ref={videoRef}
          className="trailer-modal__video"
          src={TRAILER_VIDEO_SRC}
          controls
          autoPlay
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}