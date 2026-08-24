import { Link } from "@tanstack/react-router";
import { horrorMovies } from "@/lib/movies";

interface HorrorMoviesSectionProps {
  title?: string;
  showBackButton?: boolean;
}

export function HorrorMoviesSection({ title = "Horror Movies", showBackButton = false }: HorrorMoviesSectionProps) {
  return (
    <section className="horror-movies-section" aria-labelledby="horror-movies-title">
      <div className="horror-movies-wrap">
        {showBackButton ? (
          <Link to="/" className="module-back-link">
            ← Back to Home
          </Link>
        ) : null}

        <h2 id="horror-movies-title" className="horror-movies-title">
          {title}
        </h2>

        <div className="horror-movies-grid">
          {horrorMovies.map((movie) => (
            <Link
              key={movie.id}
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
              className="horror-movie-card-link"
            >
              <article className="horror-movie-card">
                <div className="horror-movie-poster-wrap">
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                    className="horror-movie-poster"
                  />
                  <div className="horror-movie-poster-overlay" aria-hidden="true" />
                  <span className="horror-movie-genre">{movie.genre}</span>
                  <span className="horror-movie-rating">
                    <span aria-hidden="true">★</span> {movie.rating}
                  </span>
                </div>

                <div className="horror-movie-meta">
                  <h3 className="horror-movie-name">{movie.title}</h3>
                  <p className="horror-movie-year">{movie.year}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
