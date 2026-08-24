import { createFileRoute } from "@tanstack/react-router";
import { HorrorMyListSection } from "@/components/HorrorMyListSection";

export const Route = createFileRoute("/my-list")({
  component: MyListPage,
  head: () => ({
    meta: [
      { title: "My List | DARKFLIX" },
      {
        name: "description",
        content: "Manage your saved horror movies and series in your DARKFLIX collection.",
      },
    ],
  }),
});

function MyListPage() {
  return <HorrorMyListSection />;
}
