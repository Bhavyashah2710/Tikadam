import { useSyncExternalStore } from "react";

const KEY = "erh:v1";
const defaults = () => ({ completed: {}, bookmarks: {}, recent: [], scores: {}, examMode: false, last: null });

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

export function createStore(storage) {
  let state = defaults();
  try {
    const raw = storage.getItem(KEY);
    if (raw) state = { ...defaults(), ...JSON.parse(raw) };
  } catch (e) { /* corrupted storage → start fresh */ }
  const listeners = new Set();
  const set = (patch) => {
    state = { ...state, ...patch };
    try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota */ }
    listeners.forEach((l) => l());
  };
  const actions = {
    toggleComplete(id) {
      const c = { ...state.completed };
      if (c[id]) delete c[id]; else c[id] = true;
      set({ completed: c });
    },
    toggleBookmark(id) {
      const b = { ...state.bookmarks };
      if (b[id]) delete b[id]; else b[id] = true;
      set({ bookmarks: b });
    },
    visit(id) {
      const recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 12);
      set({ recent, last: id });
    },
    answer(id, i, ok) {
      const cur = state.scores[id] || { answers: {} };
      set({ scores: { ...state.scores, [id]: { answers: { ...cur.answers, [i]: ok } } } });
    },
    resetScore(id) {
      const s = { ...state.scores };
      delete s[id];
      set({ scores: s });
    },
    setExam(v) { set({ examMode: !!v }); },
    resetAll() { set(defaults()); },
  };
  return { getState: () => state, subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); }, actions };
}

const storage = typeof window !== "undefined" && window.localStorage ? window.localStorage : memoryStorage();
export const store = createStore(storage);
export const actions = store.actions;
export const useStore = () => useSyncExternalStore(store.subscribe, store.getState, store.getState);

export function scoreOf(state, id, total) {
  const a = state.scores[id]?.answers || {};
  const vals = Object.values(a);
  const correct = vals.filter(Boolean).length;
  const wrong = vals.length - correct;
  return { correct, wrong, answered: vals.length, total, pct: total ? Math.round((correct / total) * 100) : 0 };
}
export function progressOf(state, topics) {
  const done = topics.filter((t) => state.completed[t.id]).length;
  return { done, total: topics.length, pct: topics.length ? Math.round((done / topics.length) * 100) : 0 };
}
