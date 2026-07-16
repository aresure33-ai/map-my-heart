import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function calculateLoveScore(
  name1: string,
  name2: string,
  loc1?: { lat: number; lng: number },
  loc2?: { lat: number; lng: number },
): number {
  const combined = (name1.toLowerCase() + name2.toLowerCase()).replace(/\s/g, "");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash = hash & hash;
  }
  let locationBonus = 0;
  if (loc1 && loc2) {
    const distance = Math.sqrt(
      Math.pow(loc2.lat - loc1.lat, 2) + Math.pow(loc2.lng - loc1.lng, 2),
    );
    locationBonus = Math.max(0, 15 - distance * 0.5);
  }
  const baseScore = 35 + Math.abs(hash % 50);
  return Math.min(99, Math.round(baseScore + locationBonus));
}

export default defineTool({
  name: "calculate_love_score",
  title: "Calculate love score",
  description:
    "Compute a deterministic love-compatibility score (0-99) for two names, optionally boosted by geographic closeness.",
  inputSchema: {
    name1: z.string().min(1).describe("First person's name"),
    name2: z.string().min(1).describe("Second person's name"),
    location1: z
      .object({ lat: z.number(), lng: z.number() })
      .optional()
      .describe("Optional latitude/longitude for the first person"),
    location2: z
      .object({ lat: z.number(), lng: z.number() })
      .optional()
      .describe("Optional latitude/longitude for the second person"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ name1, name2, location1, location2 }) => {
    const score = calculateLoveScore(name1, name2, location1, location2);
    let verdict = "Just friends";
    if (score >= 85) verdict = "Soulmates";
    else if (score >= 70) verdict = "Strong match";
    else if (score >= 55) verdict = "Promising spark";
    else if (score >= 40) verdict = "Worth exploring";
    return {
      content: [
        {
          type: "text",
          text: `${name1} + ${name2}: ${score}% — ${verdict}`,
        },
      ],
      structuredContent: { score, verdict, name1, name2 },
    };
  },
});
