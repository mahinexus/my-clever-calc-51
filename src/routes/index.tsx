import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calculator" },
      { name: "description", content: "A simple, keyboard-friendly calculator with history." },
      { property: "og:title", content: "Calculator" },
      { property: "og:description", content: "A simple, keyboard-friendly calculator with history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Calculator />;
}
