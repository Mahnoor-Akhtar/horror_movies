import { createFileRoute } from "@tanstack/react-router";
import { HorrorMoviesSection } from "@/components/HorrorMoviesSection";

export const Route = createFileRoute("/movies/")({
  component: MoviesPage,
  head: () => ({
    meta: [
      { title: "All Movies | DARKFLIX" },
      {
        name: "description",
        content: "Browse all horror movies available on DARKFLIX.",
      },
    ],
  }),
});

function MoviesPage() {
  return <HorrorMoviesSection title="All Horror Movies" showBackButton />;
}
