import { describe, it, expect } from "vitest";
import { search } from "../src/lib/search.js";

const ids = (q, n = 10) => search(q).slice(0, n).map((r) => r.id);
describe("global search", () => {
  it("returns nothing for empty query", () => expect(search("  ")).toEqual([]));
  it("'heuristic' finds AI search topics", () => {
    const r = search("heuristic", 30);
    expect(r.length).toBeGreaterThan(3);
    expect(r.some((x) => x.id === "ai-c2-t07")).toBe(true); // Heuristic Search
    expect(r.filter((x) => x.id.startsWith("ai-")).length).toBeGreaterThan(3);
  });
  it("finds topics by title", () => {
    expect(ids("kruskal")).toContain("daa-c3-t03");
    expect(ids("dynamodb")).toContain("aws-c5-t08");
    expect(ids("servlet lifecycle")[0]).toBe("epj-c2-t02");
  });
  it("finds subjects and chapters", () => {
    expect(search("theory of computation")[0].type).toBe("subject");
    expect(search("hibernate").some((r) => r.type === "chapter")).toBe(true);
  });
  it("finds by concept keyword not in title", () => {
    expect(ids("pumping", 20)).toEqual(expect.arrayContaining(["toc-c2-t08", "toc-c3-t06"]));
  });
});
