import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getHorrorMovieById } from "@/lib/movies";
import { TrailerModal } from "@/components/TrailerModal";

export const Route = createFileRoute("/movies/$movieId")({
  loader: ({ params }) => {
    const movieId = Number(params.movieId);
    const movie = Number.isFinite(movieId) ? getHorrorMovieById(movieId) : undefined;

    if (!movie) {
      throw notFound();
    }

    return { movie };
  },
  component: MovieDetailPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.movie.title} | DARKFLIX` },
      {
        name: "description",
        content: `Watch ${loaderData.movie.title} on DARKFLIX. View rating, genre, and add it to your list.`,
      },
    ],
  }),
});

function MovieDetailPage() {
  const { movie } = Route.useLoaderData();
  const [isInList, setIsInList] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  return (
    <main className="movie-detail-page">
      <section className="movie-detail-hero">
        <div className="movie-detail-blood-top" aria-hidden="true" />
        <img src={movie.poster} alt={`${movie.title} thumbnail`} className="movie-detail-backdrop" />
        <div className="movie-detail-overlay" />
        <div className="movie-detail-fog movie-detail-fog--bottom" aria-hidden="true" />
        <div className="movie-detail-fog movie-detail-fog--top-right" aria-hidden="true" />

        <div className="movie-detail-content">
          <Link to="/" className="movie-detail-back-link">
            ← Back to Home
          </Link>

          <p className="movie-detail-kicker">Featured Horror</p>
          <h1 className="movie-detail-title">{movie.title}</h1>

          <div className="movie-detail-meta-row">
            <span className="movie-detail-pill">{movie.genre}</span>
            <span className="movie-detail-year">{movie.year}</span>
            <span className="movie-detail-rating">★ {movie.rating}</span>
          </div>

          <p className="movie-detail-description">
            Enter the shadows with {movie.title}. A chilling story filled with dread, dark atmosphere, and
            unforgettable moments. Watch now, or save it to your list for a late-night scare.
          </p>

          <div className="movie-detail-actions">
            <button type="button" className="movie-action-btn movie-action-btn--play">
              ▶ Play
            </button>
            <button
              type="button"
              className={`movie-action-btn movie-action-btn--list ${isInList ? "is-added" : ""}`}
              onClick={() => setIsInList((v) => !v)}
            >
              {isInList ? "✓ Added" : "+ Add to List"}
            </button>
            <button
              type="button"
              className="movie-action-btn movie-action-btn--ghost"
              onClick={() => setIsTrailerOpen(true)}
            >
              Trailer
            </button>
          </div>
        </div>
      </section>
      <TrailerModal open={isTrailerOpen} title={movie.title} onClose={() => setIsTrailerOpen(false)} />
    </main>
  );
}
