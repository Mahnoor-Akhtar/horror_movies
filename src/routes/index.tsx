import { createFileRoute } from "@tanstack/react-router";
import { ScrollVideo } from "@/components/ScrollVideo";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DARKFLIX | Horror Movies" },
      {
        name: "description",
        content: "Explore DARKFLIX with cinematic horror visuals and featured movies.",
      },
    ],
  }),
});

function Index() {
  return <ScrollVideo src="/video.mp4" scrollPerLoop={2400} />;
}
