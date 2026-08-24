import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getHorrorSeriesById } from "@/lib/series";
import { TrailerModal } from "@/components/TrailerModal";

export const Route = createFileRoute("/series/$seriesId")({
  loader: ({ params }) => {
    const seriesId = Number(params.seriesId);
    const series = Number.isFinite(seriesId) ? getHorrorSeriesById(seriesId) : undefined;

    if (!series) {
      throw notFound();
    }

    return { series };
  },
  component: SeriesDetailPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.series.title} | DARKFLIX` },
      {
        name: "description",
        content: `Watch ${loaderData.series.title} on DARKFLIX. View rating, genre, and save it to your list.`,
      },
    ],
  }),
});

function SeriesDetailPage() {
  const { series } = Route.useLoaderData();
  const [isInList, setIsInList] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  return (
    <main className="movie-detail-page">
      <section className="movie-detail-hero">
        <div className="movie-detail-blood-top" aria-hidden="true" />
        <img src={series.poster} alt={`${series.title} thumbnail`} className="movie-detail-backdrop" />
        <div className="movie-detail-overlay" />
        <div className="movie-detail-fog movie-detail-fog--bottom" aria-hidden="true" />
        <div className="movie-detail-fog movie-detail-fog--top-right" aria-hidden="true" />

        <div className="movie-detail-content">
          <Link to="/" className="movie-detail-back-link">
            ← Back to Home
          </Link>

          <p className="movie-detail-kicker">Featured Series</p>
          <h1 className="movie-detail-title">{series.title}</h1>

          <div className="movie-detail-meta-row">
            <span className="movie-detail-pill">{series.genre}</span>
            <span className="movie-detail-year">{series.year}</span>
            <span className="movie-detail-rating">★ {series.rating}</span>
          </div>

          <p className="movie-detail-description">
            Enter the shadows with {series.title}. A chilling series filled with dread, dark atmosphere, and
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
      <TrailerModal open={isTrailerOpen} title={series.title} onClose={() => setIsTrailerOpen(false)} />
    </main>
  );
}
