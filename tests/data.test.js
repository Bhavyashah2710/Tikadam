import { describe, it, expect } from "vitest";
import { SUBJECTS, ALL_TOPICS, CHAPTERS, TOPIC_BY_ID, topicsOfSubject } from "../src/lib/data.js";

describe("syllabus + content integrity", () => {
  it("has exactly 5 subjects, 31 chapters, 249 topics", () => {
    expect(SUBJECTS.map((s) => s.short)).toEqual(["AI", "AWS", "DAA", "EPJ", "TOC"]);
    expect(CHAPTERS.length).toBe(31);
    expect(ALL_TOPICS.length).toBe(249);
  });
  it("per-subject chapter counts match the syllabus screenshots", () => {
    const counts = Object.fromEntries(SUBJECTS.map((s) => [s.id, s.chapters.length]));
    expect(counts).toEqual({ ai: 7, aws: 6, daa: 7, epj: 6, toc: 5 });
  });
  it("ids are unique", () => {
    expect(new Set(ALL_TOPICS.map((t) => t.id)).size).toBe(249);
    expect(Object.keys(TOPIC_BY_ID).length).toBe(249);
  });
  it("every topic has a content entry with core fields", () => {
    for (const t of ALL_TOPICS) {
      const c = t.content;
      expect(c, t.id).toBeTruthy();
      for (const k of ["definition", "simpleExplanation", "realLifeAnalogy", "example", "quickRevision"]) expect(c[k]?.length, `${t.id}.${k}`).toBeGreaterThan(9);
      expect(c.knowledgeCheck.length, t.id).toBeGreaterThanOrEqual(5);
      expect(c.examQuestions.length, t.id).toBeGreaterThanOrEqual(1);
    }
  });
  it("MCQ answers are among options", () => {
    for (const t of ALL_TOPICS) for (const q of t.content.knowledgeCheck)
      if (String(q.type).toLowerCase() === "mcq") expect(q.options, t.id).toContain(q.answer);
  });
  it("topicsOfSubject sums to subject topic count", () => {
    for (const s of SUBJECTS) expect(topicsOfSubject(s.id).length).toBe(s.topicCount);
  });
});
