import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { horrorMovies } from "@/lib/movies";

type ViewMode = "Grid" | "List";
type SortMode = "Recently Added" | "Title A-Z" | "Rating High-Low" | "Year Newest";

interface WatchItem {
  id: number;
  title: string;
  year: number;
  rating: string;
  genre: string;
  poster: string;
  duration: string;
  addedAt: number;
  addedLabel: string;
}

const FILTERS = ["All", "Supernatural", "Psychological", "Slasher", "Folk Horror", "Sci-Fi Horror"];
const SORT_OPTIONS: SortMode[] = ["Recently Added", "Title A-Z", "Rating High-Low", "Year Newest"];
const DURATIONS = ["2h 04m", "1h 49m", "2h 11m", "2h 26m", "2h 19m", "1h 44m", "1h 30m", "1h 56m"];

const INITIAL_ITEMS: WatchItem[] = horrorMovies.slice(0, 12).map((movie, index) => ({
  ...movie,
  duration: DURATIONS[index % DURATIONS.length],
  addedAt: Date.now() - index * 86_400_000,
  addedLabel: `Added ${index + 1}d ago`,
}));

export function HorrorMyListSection() {
  const [items, setItems] = useState<WatchItem[]>(INITIAL_ITEMS);
  const [view, setView] = useState<ViewMode>("Grid");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortMode>("Recently Added");
  const [sortOpen, setSortOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  const visibleItems = useMemo(() => {
    const filtered = filter === "All" ? items : items.filter((item) => item.genre === filter);

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "Recently Added") return b.addedAt - a.addedAt;
      if (sortBy === "Title A-Z") return a.title.localeCompare(b.title);
      if (sortBy === "Rating High-Low") return Number(b.rating) - Number(a.rating);
      return b.year - a.year;
    });

    return sorted;
  }, [items, filter, sortBy]);

  const removeItem = (id: number) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;

    setRemovingId(id);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
      setRemovingId(null);
      setToast(`${item.title} removed from My List`);
      window.setTimeout(() => setToast(""), 2000);
    }, 200);
  };

  return (
    <section className="my-list-section" aria-labelledby="my-list-title">
      <div className="my-list-wrap">
        <Link to="/" className="module-back-link module-back-link--my-list">
          ← Back to Home
        </Link>

        <div className="my-list-blood-line" aria-hidden="true" />

        <header className="my-list-header">
          <div>
            <p className="my-list-eyebrow">Your Collection</p>
            <h1 id="my-list-title" className="my-list-title">
              My List
            </h1>
          </div>
          <span className="my-list-count">{visibleItems.length} titles</span>
        </header>

        <div className="my-list-controls">
          <div className="my-list-view-toggle" role="tablist" aria-label="View mode">
            {(["Grid", "List"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={view === mode}
                className={`my-list-toggle-btn ${view === mode ? "is-active" : ""}`}
                onClick={() => setView(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="my-list-filter-row">
            {FILTERS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`my-list-chip ${filter === chip ? "is-active" : ""}`}
                onClick={() => setFilter(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="my-list-sort-wrap" ref={sortRef}>
            <span className="my-list-sort-label">Sort</span>
            <button
              type="button"
              className={`my-list-sort my-list-sort-trigger ${sortOpen ? "is-open" : ""}`}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((v) => !v)}
            >
              <span>{sortBy}</span>
              <span className="my-list-sort-chevron" aria-hidden="true">
                ▾
              </span>
            </button>

            {sortOpen ? (
              <div className="my-list-sort-menu" role="listbox" aria-label="Sort options">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={sortBy === option}
                    className={`my-list-sort-option ${sortBy === option ? "is-selected" : ""}`}
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {visibleItems.length === 0 ? (
          <div className="my-list-empty">
            <div className="my-list-empty-icon" aria-hidden="true">
              ☠
            </div>
            <h2 className="my-list-empty-title">Your List is Empty</h2>
            <p className="my-list-empty-subtitle">Add horror movies to your collection</p>
            <Link to="/movies" className="my-list-empty-cta">
              Browse Horror Movies
            </Link>
          </div>
        ) : view === "Grid" ? (
          <div className="my-list-grid">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className={`my-list-card ${removingId === item.id ? "is-removing" : ""}`}
              >
                <button
                  type="button"
                  className="my-list-remove-btn"
                  aria-label={`Remove ${item.title} from list`}
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>

                <div className="my-list-poster-wrap">
                  <img src={item.poster} alt={`${item.title} poster`} className="my-list-poster" loading="lazy" />
                  <div className="my-list-poster-overlay" aria-hidden="true" />
                  <span className="my-list-rating-badge">★ {item.rating}</span>
                </div>

                <div className="my-list-card-meta">
                  <p className="my-list-added">{item.addedLabel}</p>
                  <h3 className="my-list-card-title">{item.title}</h3>
                  <p className="my-list-card-submeta">
                    {item.year} · {item.duration}
                  </p>
                  <span className="my-list-genre-pill">{item.genre}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="my-list-rows">
            {visibleItems.map((item, index) => (
              <article key={item.id} className={`my-list-row ${removingId === item.id ? "is-removing" : ""}`}>
                <div className="my-list-row-index">{String(index + 1).padStart(2, "0")}</div>
                <img src={item.poster} alt={`${item.title} thumbnail`} className="my-list-row-thumb" loading="lazy" />

                <div className="my-list-row-main">
                  <h3 className="my-list-row-title">{item.title}</h3>
                  <p className="my-list-row-meta">
                    {item.year} · {item.duration}
                  </p>
                  <span className="my-list-genre-pill">{item.genre}</span>
                </div>

                <div className="my-list-row-rating">★ {item.rating}</div>
                <button type="button" className="my-list-row-play" aria-label={`Play ${item.title}`}>
                  ▶
                </button>
                <button
                  type="button"
                  className="my-list-row-remove"
                  aria-label={`Remove ${item.title} from list`}
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {toast ? <div className="my-list-toast">{toast}</div> : null}
    </section>
  );
}
