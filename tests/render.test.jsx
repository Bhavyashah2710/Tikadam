import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { ChapterPage, ChapterRevision, Home, RapidRevision, SearchPage, SubjectPage, TopicPage } from "../src/pages.jsx";
import { ALL_TOPICS, CHAPTERS, SUBJECTS } from "../src/lib/data.js";
import { actions } from "../src/lib/store.js";

const page = (url) => renderToString(
  <StaticRouter location={url}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/subject/:sid" element={<SubjectPage />} />
      <Route path="/subject/:sid/rapid" element={<RapidRevision />} />
      <Route path="/chapter/:cid" element={<ChapterPage />} />
      <Route path="/chapter/:cid/revision" element={<ChapterRevision />} />
      <Route path="/topic/:tid" element={<TopicPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  </StaticRouter>
);

describe("pages render without errors", () => {
  it("home shows all five subjects", () => {
    const h = page("/"); expect(h).toContain("Exam Revision Hub");
    for (const s of SUBJECTS) expect(h).toContain(s.name);
  });
  it("subject, rapid revision, chapter and chapter revision pages", () => {
    for (const s of SUBJECTS) { expect(page(`/subject/${s.id}`)).toContain(s.name); expect(page(`/subject/${s.id}/rapid`)).toContain("Rapid Revision"); }
    for (const c of CHAPTERS) { expect(page(`/chapter/${c.id}`)).toContain(c.title.replace(/&/g, "&amp;")); expect(page(`/chapter/${c.id}/revision`)).toContain("Chapter Revision"); }
  });
  it("all 249 topic pages render in normal mode with the full section set", () => {
    actions.setExam(false);
    for (const t of ALL_TOPICS) {
      const h = page(`/topic/${t.id}`);
      for (const sec of ["Definition", "Simple Explanation", "Real-Life Analogy", "Example", "Key Points", "Must Remember", "Common Mistakes", "Exam Questions", "Knowledge Check"]) expect(h, `${t.id} ${sec}`).toContain(sec);
    }
  });
  it("Exam Mode hides explanation/analogy but keeps core sections", () => {
    actions.setExam(true);
    const h = page("/topic/ai-c2-t02");
    expect(h).toContain("Key Points"); expect(h).toContain("Knowledge Check"); expect(h).toContain("Important Questions");
    expect(h).not.toContain("Real-Life Analogy"); expect(h).not.toContain("Simple Explanation");
    for (const t of ALL_TOPICS) expect(() => page(`/topic/${t.id}`)).not.toThrow();
    actions.setExam(false);
  });
  it("search page renders results", () => { expect(page("/search?q=heuristic")).toContain("Heuristic Search"); });
});
