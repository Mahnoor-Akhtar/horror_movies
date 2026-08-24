import { horrorSeries } from "@/lib/series";
import { Link } from "@tanstack/react-router";

interface HorrorSeriesSectionProps {
  title?: string;
  showBackButton?: boolean;
}

export function HorrorSeriesSection({ title = "Horror Series", showBackButton = false }: HorrorSeriesSectionProps) {
  return (
    <section className="horror-movies-section" aria-labelledby="horror-series-title">
      <div className="horror-movies-wrap">
        {showBackButton ? (
          <Link to="/" className="module-back-link">
            ← Back to Home
          </Link>
        ) : null}

        <h2 id="horror-series-title" className="horror-movies-title">
          {title}
        </h2>

        <div className="horror-movies-grid">
          {horrorSeries.map((series) => (
            <Link
              key={series.id}
              to="/series/$seriesId"
              params={{ seriesId: String(series.id) }}
              className="horror-movie-card-link"
            >
              <article className="horror-movie-card">
                <div className="horror-movie-poster-wrap">
                  <img
                    src={series.poster}
                    alt={`${series.title} poster`}
                    loading="lazy"
                    className="horror-movie-poster"
                  />
                  <div className="horror-movie-poster-overlay" aria-hidden="true" />
                  <span className="horror-movie-genre">{series.genre}</span>
                  <span className="horror-movie-rating">
                    <span aria-hidden="true">★</span> {series.rating}
                  </span>
                </div>

                <div className="horror-movie-meta">
                  <h3 className="horror-movie-name">{series.title}</h3>
                  <p className="horror-movie-year">{series.year}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
