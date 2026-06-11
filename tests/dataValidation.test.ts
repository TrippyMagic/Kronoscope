import { describe, expect, it } from "vitest";

import { parseHistoricalEvents, parseProjectedEvents } from "../src/types/events";
import { parseGeoExplorerData } from "../src/types/geological";
import { parseTimescalePhenomena } from "../src/types/phenomena";

describe("public data validation", () => {
  it("filters invalid historical and projected timeline rows", () => {
    const historical = parseHistoricalEvents([
      { id: "ok", label: "Valid", date: "2020-01-01", category: "space" },
      { id: "bad-date", label: "Invalid", date: "nope", category: "space" },
      { id: "bad-category", label: "Invalid", date: "2020-01-01", category: "unknown" },
    ]);
    const projected = parseProjectedEvents([
      {
        id: "ok-proj",
        label: "Projection",
        date: "2030-01-01",
        category: "technological",
        projectionType: "forecast",
        certainty: "medium",
      },
      {
        id: "bad-certainty",
        label: "Projection",
        date: "2030-01-01",
        category: "technological",
        projectionType: "forecast",
        certainty: "certain",
      },
    ]);

    expect(historical).toHaveLength(1);
    expect(historical[0].id).toBe("ok");
    expect(projected).toHaveLength(1);
    expect(projected[0].id).toBe("ok-proj");
  });

  it("filters invalid Timescales and explorer rows without throwing", () => {
    const phenomena = parseTimescalePhenomena([
      { id: "planck", label: "Planck time", durationSeconds: 1e-44, category: "quantum" },
      { id: "bad-duration", label: "Broken", durationSeconds: Number.NaN, category: "quantum" },
      { id: "bad-category", label: "Broken", durationSeconds: 1, category: "unknown" },
    ]);

    const explorer = parseGeoExplorerData({
      geological: [
        { id: "phanerozoic", name: "Phanerozoic", rank: "eon", startMya: 541, endMya: 0, color: "#fff" },
        { id: "bad", name: "Bad", rank: "age", startMya: 1, endMya: 0, color: "#fff" },
      ],
      cosmic: [
        { id: "earth", name: "Earth forms", timeAgoMya: 4540 },
        { id: "bad", name: "Bad", timeAgoMya: "old" },
      ],
    });

    expect(phenomena.map(item => item.id)).toEqual(["planck"]);
    expect(explorer?.geological.map(item => item.id)).toEqual(["phanerozoic"]);
    expect(explorer?.cosmic.map(item => item.id)).toEqual(["earth"]);
  });
});
