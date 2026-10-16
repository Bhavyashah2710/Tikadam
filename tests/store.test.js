import { describe, it, expect } from "vitest";
import { createStore, scoreOf, progressOf } from "../src/lib/store.js";

const mem = () => { const m = {}; return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = v; }, dump: () => m }; };

describe("local store", () => {
  it("bookmarks, completion and recents", () => {
    const s = createStore(mem());
    s.actions.toggleBookmark("a"); s.actions.toggleComplete("a"); s.actions.visit("a"); s.actions.visit("b"); s.actions.visit("a");
    const st = s.getState();
    expect(st.bookmarks.a).toBe(true); expect(st.completed.a).toBe(true);
    expect(st.recent).toEqual(["a", "b"]); expect(st.last).toBe("a");
    s.actions.toggleBookmark("a"); expect(s.getState().bookmarks.a).toBeUndefined();
  });
  it("knowledge-check scoring", () => {
    const s = createStore(mem());
    s.actions.answer("t", 0, true); s.actions.answer("t", 1, false); s.actions.answer("t", 2, true);
    expect(scoreOf(s.getState(), "t", 5)).toMatchObject({ correct: 2, wrong: 1, answered: 3, total: 5 });
    s.actions.resetScore("t"); expect(scoreOf(s.getState(), "t", 5).answered).toBe(0);
  });
  it("persists to storage and reloads", () => {
    const st = mem(); const a = createStore(st); a.actions.setExam(true); a.actions.toggleComplete("x");
    const b = createStore(st);
    expect(b.getState().examMode).toBe(true); expect(b.getState().completed.x).toBe(true);
  });
  it("survives corrupted storage", () => {
    const st = mem(); st.setItem("erh:v1", "{not json");
    expect(createStore(st).getState().examMode).toBe(false);
  });
  it("progress percentage", () => {
    const s = createStore(mem()); s.actions.toggleComplete("1");
    expect(progressOf(s.getState(), [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }]).pct).toBe(25);
  });
});
