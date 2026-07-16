import { defineMcp } from "@lovable.dev/mcp-js";
import calculateLoveScoreTool from "./tools/calculate-love-score";
import distanceBetweenTool from "./tools/distance-between";

export default defineMcp({
  name: "map-my-heart-mcp",
  title: "Map My Heart MCP",
  version: "0.1.0",
  instructions:
    "Tools from the Map My Heart love-test app. Use `calculate_love_score` to score compatibility between two names (optionally with locations), and `distance_between` to measure the great-circle distance between two lat/lng points.",
  tools: [calculateLoveScoreTool, distanceBetweenTool],
});
