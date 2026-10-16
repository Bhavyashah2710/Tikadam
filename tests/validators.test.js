import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

const run = (f) => { try { return { code: 0, out: execFileSync("node", [f], { encoding: "utf8" }) }; } catch (e) { return { code: e.status, out: String(e.stdout) }; } };
describe("project validators", () => {
  it("syllabus validator passes (31 chapters, unique ids)", () => {
    const r = run("scripts/validate-syllabus.mjs"); expect(r.code, r.out).toBe(0); expect(r.out).toContain("chapters=31");
  });
  it("content validator passes on all 249 topics", () => {
    const r = run("scripts/validate-content.mjs"); expect(r.code, r.out).toBe(0); expect(r.out).toContain("fully-valid=249");
  });
});
