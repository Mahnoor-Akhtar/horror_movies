import { createFileRoute } from "@tanstack/react-router";
import { HorrorNewReleasesSection } from "@/components/HorrorNewReleasesSection";

export const Route = createFileRoute("/new-releases")({
  component: NewReleasesPage,
  head: () => ({
    meta: [
      { title: "New Releases | DARKFLIX" },
      {
        name: "description",
        content: "Explore the newest horror releases on DARKFLIX.",
      },
    ],
  }),
});

function NewReleasesPage() {
  return <HorrorNewReleasesSection title="New Releases" showBackButton />;
}
