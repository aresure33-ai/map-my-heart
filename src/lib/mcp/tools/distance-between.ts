import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default defineTool({
  name: "distance_between",
  title: "Distance between two locations",
  description:
    "Return the great-circle distance in kilometers and miles between two lat/lng points.",
  inputSchema: {
    location1: z.object({ lat: z.number(), lng: z.number() }),
    location2: z.object({ lat: z.number(), lng: z.number() }),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ location1, location2 }) => {
    const km = haversineKm(location1, location2);
    const miles = km * 0.621371;
    return {
      content: [
        {
          type: "text",
          text: `${km.toFixed(1)} km (${miles.toFixed(1)} mi)`,
        },
      ],
      structuredContent: { kilometers: +km.toFixed(2), miles: +miles.toFixed(2) },
    };
  },
});
