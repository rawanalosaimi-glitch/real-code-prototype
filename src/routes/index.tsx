import { createFileRoute } from "@tanstack/react-router";
import AlaradApp from "@/components/AlaradApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALARAD — Radiation Safety Command Center" },
      {
        name: "description",
        content:
          "Monitor staff radiation dose, alerts, anomalies, emergency GPS response and policy compliance in one command center.",
      },
      { property: "og:title", content: "ALARAD — Radiation Safety Command Center" },
      {
        property: "og:description",
        content:
          "Real-time dose monitoring, AI recommendations, anomaly detection and emergency response for radiation safety teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AlaradApp,
});
