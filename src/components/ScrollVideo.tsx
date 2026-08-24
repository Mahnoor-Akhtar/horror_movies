import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { HorrorMoviesSection } from "@/components/HorrorMoviesSection";
import { HorrorNewReleasesSection } from "@/components/HorrorNewReleasesSection";
import { HorrorSeriesSection } from "@/components/HorrorSeriesSection";
import { horrorMovies } from "@/lib/movies";
import { horrorSeries } from "@/lib/series";

interface ScrollVideoProps {
  src: string;
  /** Initial pixels of scroll required to traverse the entire video once. */
  scrollPerLoop?: number;
}

interface HorrorCue {
  id: string;
  text: string;
  start: number;
  end: number;
  positionClass: string;
}

const HORROR_CUES: HorrorCue[] = [
  {
    id: "silence",
    text: "DO NOT LOOK BEHIND YOU",
    start: 0.08,
    end: 0.26,
    positionClass: "horror-cue--top-left",
  },
  {
    id: "watching",
    text: "SHE IS WATCHING",
    start: 0.3,
    end: 0.48,
    positionClass: "horror-cue--top-right",
  },
  {
    id: "whisper",
    text: "CAN YOU HEAR THE WHISPER?",
    start: 0.52,
    end: 0.7,
    positionClass: "horror-cue--mid-left",
  },
  {
    id: "door",
    text: "THE DOOR IS OPEN",
    start: 0.74,
    end: 0.96,
    positionClass: "horror-cue--bottom-right",
  },
];

const END_HERO_START = 0.94;
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Series", to: "/series" },
  { label: "New Releases", to: "/new-releases" },
  { label: "My List", to: "/my-list" },
];

const NOTIFICATIONS = [
  {
    title: "New release drop",
    message: "Nope and Barbarian were just added to New Releases.",
    to: "/new-releases",
  },
  {
    title: "Trending series",
    message: "Stranger Things and From are ready in the Series section.",
    to: "/series",
  },
  {
    title: "Continue the scare",
    message: "Check your My List for saved titles and unfinished horror nights.",
    to: "/my-list",
  },
];

/**
 * Scroll-scrubbed video player.
 * - Scroll down → scrubs forward
 * - Scroll up → scrubs backward
 * - Stops at the end (no looping)
 * - `scrollPerLoop` controls scroll distance for full video duration
 */
export function ScrollVideo({ src, scrollPerLoop = 2400 }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const bellPanelRef = useRef<HTMLDivElement>(null);
  const avatarPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const searchResults = [
    ...horrorMovies.map((movie) => ({
      kind: "Movie" as const,
      title: movie.title,
      subtitle: `${movie.year} • ${movie.genre}`,
      to: `/movies/${movie.id}`,
    })),
    ...horrorSeries.map((series) => ({
      kind: "Series" as const,
      title: series.title,
      subtitle: `${series.year} • ${series.genre}`,
      to: `/series/${series.id}`,
    })),
  ].filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return `${item.title} ${item.subtitle} ${item.kind}`.toLowerCase().includes(query);
  });

  const pxPerLoopRef = useRef(scrollPerLoop);
  useEffect(() => {
    pxPerLoopRef.current = scrollPerLoop;
  }, [scrollPerLoop]);

  // Keep a spacer matching scroll distance needed for full video.
  useEffect(() => {
    if (!spacerRef.current) return;
    if (isMobile) {
      spacerRef.current.style.height = "0px";
      spacerRef.current.style.display = "none";
    } else {
      spacerRef.current.style.height = `calc(${scrollPerLoop}px + 100vh)`;
      spacerRef.current.style.display = "block";
    }
  }, [scrollPerLoop, isMobile]);

  // Wire up video metadata. Wait for canplay so seeks actually take effect.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const markReady = () => {
      if (v.duration && Number.isFinite(v.duration)) {
        setDuration(v.duration);
        setReady(true);
      }
    };
    v.addEventListener("loadedmetadata", markReady);
    v.addEventListener("durationchange", markReady);
    v.addEventListener("canplay", markReady);
    if (v.readyState >= 1) markReady();
    return () => {
      v.removeEventListener("loadedmetadata", markReady);
      v.removeEventListener("durationchange", markReady);
      v.removeEventListener("canplay", markReady);
    };
  }, [src]);

  // Navbar scroll state only. Keeps existing video-scroll logic unchanged.
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen && !bellOpen && !avatarOpen && !menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setBellOpen(false);
        setAvatarOpen(false);
        setMenuOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchOpen && searchPanelRef.current && !searchPanelRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (bellOpen && bellPanelRef.current && !bellPanelRef.current.contains(target)) {
        setBellOpen(false);
      }
      if (avatarOpen && avatarPanelRef.current && !avatarPanelRef.current.contains(target)) {
        setAvatarOpen(false);
      }
      if (menuOpen && mobileMenuPanelRef.current && !mobileMenuPanelRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [avatarOpen, bellOpen, searchOpen, menuOpen]);

  // Main scroll progress listener (runs on both mobile and desktop)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const loop = pxPerLoopRef.current;
      const nextProgress = Math.min(1, Math.max(0, y / loop));
      setProgress(nextProgress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Main scrub loop. Runs only when video is active.
  useEffect(() => {
    if (isMobile || !ready || !duration) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();

    let seeking = false;

    const onSeeking = () => {
      seeking = true;
    };
    const onSeeked = () => {
      seeking = false;
    };
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("seeked", onSeeked);

    let lastTick = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTick) / 1000);
      lastTick = now;

      // No auto-play - just follow scroll position
      if (!seeking) {
        const current = v.currentTime;
        const target = progressRef.current * duration;
        const diff = target - current;

        const next = current + diff * Math.min(1, dt * 8);
        const normalized = Math.min(duration, Math.max(0, next));

        if (Math.abs(normalized - current) > 0.01) {
          try {
            v.currentTime = normalized;
          } catch {
            // ignore
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Seed time so first frame renders immediately.
    try {
      v.currentTime = 0.001;
    } catch {
      // ignore
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("seeked", onSeeked);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, ready, duration]);

  return (
    <>
      <div ref={spacerRef} aria-hidden="true" />
      <div className={`${isMobile ? "relative h-screen" : "fixed inset-0"} z-0 bg-background`}>
        <header className={`horror-navbar ${isScrolled ? "scrolled" : ""}`}>
          <div className="horror-navbar__inner">
            <a href="#" className="horror-navbar__logo">
              DARKFLIX
            </a>

            <nav className="horror-navbar__links" aria-label="Primary">
              {NAV_LINKS.map((item, index) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`horror-navbar__link ${index === 0 ? "is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href="#"
                    className={`horror-navbar__link ${index === 0 ? "is-active" : ""}`}
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>

            <div className="horror-navbar__actions" aria-label="Actions">
              <button
                type="button"
                className="horror-icon-btn"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen((value) => !value);
                  setBellOpen(false);
                }}
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                className="horror-icon-btn horror-icon-btn--notify"
                aria-label="Notifications"
                aria-expanded={bellOpen}
                onClick={() => {
                  setBellOpen((value) => !value);
                  setSearchOpen(false);
                }}
              >
                <Bell size={18} />
                <span className="horror-notify-dot" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="horror-avatar-btn"
                aria-label="User profile"
                aria-expanded={avatarOpen}
                onClick={() => {
                  setAvatarOpen((value) => !value);
                  setSearchOpen(false);
                  setBellOpen(false);
                  setMenuOpen(false);
                }}
              >
                <User size={18} />
              </button>
              <button
                type="button"
                className="horror-icon-btn horror-hamburger-btn"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => {
                  setMenuOpen((value) => !value);
                  setSearchOpen(false);
                  setBellOpen(false);
                  setAvatarOpen(false);
                }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </header>

        {searchOpen ? (
          <div className="horror-panel-backdrop" role="presentation" onClick={() => setSearchOpen(false)}>
            <div
              ref={searchPanelRef}
              className="horror-search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search catalog"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="horror-search-panel__header">
                <div>
                  <p className="horror-panel-kicker">Search</p>
                  <h2 className="horror-panel-title">Find a movie or series</h2>
                </div>
                <button type="button" className="horror-panel-close" onClick={() => setSearchOpen(false)}>
                  ×
                </button>
              </div>

              <label className="horror-search-field">
                <span className="sr-only">Search titles</span>
                <Search size={16} aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="text"
                  placeholder="Search titles, genres, or years"
                  autoFocus
                />
              </label>

              <div className="horror-search-results">
                {searchResults.length ? (
                  searchResults.map((item) => (
                    <Link
                      key={`${item.kind}-${item.title}`}
                      to={item.to}
                      className="horror-search-result"
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className="horror-search-result__kind">{item.kind}</span>
                      <span className="horror-search-result__title">{item.title}</span>
                      <span className="horror-search-result__subtitle">{item.subtitle}</span>
                    </Link>
                  ))
                ) : (
                  <p className="horror-search-empty">No matches found.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {bellOpen ? (
          <div className="horror-notification-panel" ref={bellPanelRef} role="dialog" aria-label="Notifications">
            <div className="horror-notification-panel__header">
              <div>
                <p className="horror-panel-kicker">Alerts</p>
                <h2 className="horror-panel-title">Recent notifications</h2>
              </div>
              <button type="button" className="horror-panel-close" onClick={() => setBellOpen(false)}>
                ×
              </button>
            </div>

            <div className="horror-notification-list">
              {NOTIFICATIONS.map((notification) => (
                <Link
                  key={notification.title}
                  to={notification.to}
                  className="horror-notification-item"
                  onClick={() => setBellOpen(false)}
                >
                  <strong>{notification.title}</strong>
                  <span>{notification.message}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {avatarOpen ? (
          <div className="horror-avatar-panel" ref={avatarPanelRef} role="dialog" aria-label="Profile menu">
            <div className="horror-notification-panel__header">
              <div>
                <p className="horror-panel-kicker">Profile</p>
                <h2 className="horror-panel-title">Darkflix account</h2>
              </div>
              <button type="button" className="horror-panel-close" onClick={() => setAvatarOpen(false)}>
                ×
              </button>
            </div>

            <div className="horror-notification-list">
              <Link to="/my-list" className="horror-notification-item" onClick={() => setAvatarOpen(false)}>
                <strong>My List</strong>
                <span>Open your saved movies and series.</span>
              </Link>
              <Link to="/movies" className="horror-notification-item" onClick={() => setAvatarOpen(false)}>
                <strong>Movies</strong>
                <span>Browse the full horror movie catalog.</span>
              </Link>
              <Link to="/series" className="horror-notification-item" onClick={() => setAvatarOpen(false)}>
                <strong>Series</strong>
                <span>Jump into the horror series collection.</span>
              </Link>
              <Link to="/new-releases" className="horror-notification-item" onClick={() => setAvatarOpen(false)}>
                <strong>New Releases</strong>
                <span>See the newest titles added to DARKFLIX.</span>
              </Link>
            </div>
          </div>
        ) : null}

        {menuOpen ? (
          <div className="horror-panel-backdrop" role="presentation" onClick={() => setMenuOpen(false)}>
            <div
              ref={mobileMenuPanelRef}
              className="horror-mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="horror-mobile-menu-panel__header">
                <div>
                  <p className="horror-panel-kicker">Navigation</p>
                  <h2 className="horror-panel-title">Darkflix menu</h2>
                </div>
                <button type="button" className="horror-panel-close" onClick={() => setMenuOpen(false)}>
                  ×
                </button>
              </div>

              <div className="horror-mobile-menu-list">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="horror-mobile-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {isMobile ? (
          <img
            src="/images/hero-mobile.jpg"
            alt="Darkflix Hero Background"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
        )}
        <div className="horror-overlay" aria-hidden={isMobile ? "false" : "true"}>
          {isMobile ? (
            <div className="horror-mobile-cues">
              <p className="horror-cue horror-cue--mobile horror-cue--visible" data-text="DO NOT LOOK BEHIND YOU">
                DO NOT LOOK BEHIND YOU
              </p>
              <p className="horror-cue horror-cue--mobile horror-cue--visible" data-text="SHE IS WATCHING">
                SHE IS WATCHING
              </p>
              <div className="horror-mobile-hero-buttons">
                <Link to="/movies" className="horror-mobile-hero-btn">
                  Movies
                </Link>
                <Link to="/series" className="horror-mobile-hero-btn">
                  Series
                </Link>
              </div>
            </div>
          ) : (
            HORROR_CUES.map((cue) => {
              const isVisible = progress >= cue.start && progress <= cue.end;
              return (
                <p
                  key={cue.id}
                  data-text={cue.text}
                  className={`horror-cue ${cue.positionClass} ${isVisible ? "horror-cue--visible" : ""}`}
                >
                  {cue.text}
                </p>
              );
            })
          )}
          {!isMobile && (
            <h1 className={`horror-end-hero ${progress >= END_HERO_START ? "horror-end-hero--visible" : ""}`}>
              Horror Movies
            </h1>
          )}
        </div>
      </div>

      <HorrorMoviesSection title="Horror Movies" />
      <HorrorSeriesSection title="Horror Series" />
      <HorrorNewReleasesSection title="New Releases" />
    </>
  );
}
