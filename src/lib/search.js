import { SUBJECTS, CHAPTERS, ALL_TOPICS } from "./data.js";

const flat = (v) => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ") : v || "");
const low = (s) => String(s || "").toLowerCase();

export function buildIndex() {
  const entries = [];
  for (const s of SUBJECTS) {
    entries.push({ type: "subject", id: s.id, path: `/subject/${s.id}`, title: s.name, sub: `${s.short} · ${s.code}`, title_l: low(s.name + " " + s.short + " " + s.code), body_l: low(s.desc), subtopics_l: "", extra_l: "" });
  }
  for (const c of CHAPTERS) {
    const s = SUBJECTS.find((x) => x.id === c.subjectId);
    entries.push({ type: "chapter", id: c.id, path: `/chapter/${c.id}`, title: `Chapter ${c.number}: ${c.title}`, sub: s.name, title_l: low(c.title), body_l: low(s.name), subtopics_l: "", extra_l: low(c.topics.map((t) => t.title).join(" ")) });
  }
  for (const t of ALL_TOPICS) {
    const c = t.content || {};
    const s = SUBJECTS.find((x) => x.id === t.subjectId);
    entries.push({
      type: "topic", id: t.id, path: `/topic/${t.id}`, title: t.title, sub: `${s.short} · Ch ${t.chapterNumber} ${t.chapterTitle}`,
      title_l: low(t.title),
      subtopics_l: low(t.subtopics.map((x) => x.title).join(" ")),
      body_l: low([c.definition, c.quickRevision, flat(c.keyPoints), flat(c.mustKnow)].join(" ")),
      extra_l: low([c.simpleExplanation, c.example, c.technicalDefinition, c.formalDefinition, c.purpose, flat(c.properties), flat(c.features), t.chapterTitle, s.name].join(" ")),
    });
  }
  return entries;
}

let INDEX = null;
export function search(query, limit = 40) {
  const tokens = low(query).split(/[^a-z0-9+#*.]+/).filter((x) => x.length > 0);
  if (!tokens.length) return [];
  INDEX = INDEX || buildIndex();
  const scoreEntry = (e, toks, needAll) => {
    let score = 0, matched = 0;
    for (const tk of toks) {
      let s = 0;
      if (e.title_l.includes(tk)) s += e.title_l.split(/\W+/).includes(tk) ? 14 : 10;
      if (e.subtopics_l.includes(tk)) s += 6;
      if (e.body_l.includes(tk)) s += 3;
      if (e.extra_l.includes(tk)) s += 1;
      if (s > 0) matched++;
      score += s;
    }
    if (needAll && matched < toks.length) return 0;
    if (!needAll && matched === 0) return 0;
    if (e.type === "subject") score += 2; else if (e.type === "chapter") score += 1;
    return score;
  };
  let res = INDEX.map((e) => ({ e, s: scoreEntry(e, tokens, true) })).filter((x) => x.s > 0);
  if (!res.length && tokens.length > 1) res = INDEX.map((e) => ({ e, s: scoreEntry(e, tokens, false) })).filter((x) => x.s > 0);
  res.sort((a, b) => b.s - a.s || a.e.title.localeCompare(b.e.title));
  return res.slice(0, limit).map(({ e, s }) => ({ type: e.type, id: e.id, path: e.path, title: e.title, sub: e.sub, score: s }));
}
