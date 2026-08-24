import { createFileRoute } from "@tanstack/react-router";
import { HorrorSeriesSection } from "@/components/HorrorSeriesSection";

export const Route = createFileRoute("/series/")({
  component: SeriesPage,
  head: () => ({
    meta: [
      { title: "All Series | DARKFLIX" },
      {
        name: "description",
        content: "Browse all horror series available on DARKFLIX.",
      },
    ],
  }),
});

function SeriesPage() {
  return <HorrorSeriesSection title="All Horror Series" showBackButton />;
}
