import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SUBJECTS, SUBJECT_BY_ID, CHAPTER_BY_ID, TOPIC_BY_ID, topicsOfSubject, oneLine } from "./lib/data.js";
import { actions, progressOf, useStore } from "./lib/store.js";
import { search } from "./lib/search.js";
import { Answer, BLOCKS, Breadcrumb, Card, FORMULA_BLOCKS, ImportanceBadge, KnowledgeCheck, ProgressBar, RevisionSheet, Table, Bullets, Text, renderBlock } from "./components.jsx";

const NotFound = () => <Card title="Not found"><p>That page does not exist. <Link to="/">Go home</Link></p></Card>;

export function Home() {
  const state = useStore();
  const last = state.last && TOPIC_BY_ID[state.last];
  const recent = state.recent.map((id) => TOPIC_BY_ID[id]).filter(Boolean).slice(0, 6);
  const marked = Object.keys(state.bookmarks).map((id) => TOPIC_BY_ID[id]).filter(Boolean);
  return (
    <>
      <h1>Exam Revision Hub</h1>
      <p className="muted">Private revision site · 5 subjects · 31 chapters · 249 topics · everything is saved only in this browser.</p>
      <div className="grid dash">
        <Card title="Continue Revision">
          {last ? <p><Link className="btn" to={`/topic/${last.id}`}>▶ {last.title}</Link><br /><span className="muted">{SUBJECT_BY_ID[last.subjectId].short} · Ch {last.chapterNumber}</span></p> : <p className="muted">Open any topic to start. Your last visited topic shows here.</p>}
        </Card>
        <Card title="Exam Mode">
          <label className="switch"><input type="checkbox" checked={state.examMode} onChange={(e) => actions.setExam(e.target.checked)} /> Exam Mode {state.examMode ? "ON" : "OFF"}</label>
          <p className="muted">ON shows only definitions, key points, must-remember, formulas, questions and knowledge checks.</p>
        </Card>
        <Card title="Quick Revision">
          <ul className="plain">{SUBJECTS.map((s) => <li key={s.id}><Link to={`/subject/${s.id}/rapid`}>{s.icon} {s.short} → Rapid Revision</Link></li>)}</ul>
        </Card>
        <Card title="Recently Viewed">
          {recent.length ? <ul className="plain">{recent.map((t) => <li key={t.id}><Link to={`/topic/${t.id}`}>{t.title}</Link> <span className="muted">({SUBJECT_BY_ID[t.subjectId].short})</span></li>)}</ul> : <p className="muted">Nothing yet.</p>}
        </Card>
        <Card title="Bookmarked Topics" className="wide">
          {marked.length ? <ul className="plain">{marked.map((t) => <li key={t.id}>🔖 <Link to={`/topic/${t.id}`}>{t.title}</Link> <span className="muted">({SUBJECT_BY_ID[t.subjectId].short} · Ch {t.chapterNumber})</span></li>)}</ul> : <p className="muted">Bookmark difficult topics with 🔖 on any revision page.</p>}
        </Card>
        <Card title="Subject Progress" className="wide">
          {SUBJECTS.map((s) => { const p = progressOf(state, topicsOfSubject(s.id)); return <div key={s.id} className="prow"><span>{s.icon} {s.short}</span><ProgressBar pct={p.pct} label={`${p.done}/${p.total}`} /></div>; })}
        </Card>
      </div>
      <h2>Subjects</h2>
      <div className="grid subjects">
        {SUBJECTS.map((s) => {
          const topics = topicsOfSubject(s.id); const p = progressOf(state, topics);
          return (
            <article className="card subject" key={s.id}>
              <div className="big-icon">{s.icon}</div>
              <h3>{s.name}</h3>
              <p className="muted">{s.chapterCount} chapters · {s.topicCount} topics</p>
              <ProgressBar pct={p.pct} label={`Revision ${p.pct}%`} />
              <p><Link className="btn" to={`/subject/${s.id}`}>Start Revision</Link></p>
            </article>
          );
        })}
      </div>
    </>
  );
}

export function SubjectPage() {
  const { sid } = useParams(); const state = useStore(); const s = SUBJECT_BY_ID[sid];
  if (!s) return <NotFound />;
  const p = progressOf(state, topicsOfSubject(sid));
  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: s.name }]} />
      <h1>{s.icon} {s.name}</h1>
      <p className="muted">Course code {s.code} · {s.course} Semester {s.semester} · {s.credits} credits · Prerequisite: {s.prereq}</p>
      <p>{s.desc}</p>
      <details><summary>{s.objective_label}</summary><p>{s.objective}</p></details>
      <ProgressBar pct={p.pct} label={`${p.done}/${p.total} topics complete`} />
      <p><Link className="btn" to={`/subject/${sid}/rapid`}>⚡ Rapid Revision</Link></p>
      <div className="list">
        {s.chapters.map((c) => { const cp = progressOf(state, c.topics); return (
          <article className="card row" key={c.id}>
            <div><h3>Chapter {c.number}: {c.title}</h3><p className="muted">{c.topics.length} topics · weightage {c.weightage}% · {c.teachingHours} hrs</p><ProgressBar pct={cp.pct} /></div>
            <Link className="btn" to={`/chapter/${c.id}`}>Start Revision</Link>
          </article>); })}
      </div>
    </>
  );
}

export function ChapterPage() {
  const { cid } = useParams(); const state = useStore(); const c = CHAPTER_BY_ID[cid];
  if (!c) return <NotFound />;
  const s = SUBJECT_BY_ID[c.subjectId]; const p = progressOf(state, c.topics);
  const important = c.topics.filter((t) => t.content.importance === "high");
  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: s.name, to: `/subject/${s.id}` }, { label: `Chapter ${c.number}` }]} />
      <h1>Chapter {c.number}: {c.title}</h1>
      <Card title="Chapter Overview"><p>{c.topics.length} topics · weightage {c.weightage}% · {c.teachingHours} teaching hours.</p><ProgressBar pct={p.pct} label={`${p.done}/${p.total} complete`} /><p><Link className="btn" to={`/chapter/${c.id}/revision`}>📋 Chapter Revision</Link></p></Card>
      <Card title="Important Topics"><p>{important.length ? important.map((t) => <Link key={t.id} className="chip" to={`/topic/${t.id}`}>{t.title}</Link>) : "—"}</p></Card>
      <h2>Topics</h2>
      <div className="list">
        {c.topics.map((t) => (
          <article className="card row" key={t.id}>
            <div><h3><Link to={`/topic/${t.id}`}>{t.title}</Link></h3><p className="muted">{oneLine(t)}</p></div>
            <div className="meta"><ImportanceBadge level={t.content.importance} /><span className={`status ${state.completed[t.id] ? "done" : ""}`}>{state.completed[t.id] ? "✔ Done" : "Not done"}</span>{state.bookmarks[t.id] && <span title="Bookmarked">🔖</span>}</div>
          </article>
        ))}
      </div>
    </>
  );
}

export function ChapterRevision() {
  const { cid } = useParams(); const c = CHAPTER_BY_ID[cid];
  if (!c) return <NotFound />;
  const s = SUBJECT_BY_ID[c.subjectId];
  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: s.name, to: `/subject/${s.id}` }, { label: `Chapter ${c.number}`, to: `/chapter/${c.id}` }, { label: "Revision" }]} />
      <h1>Chapter Revision — {c.title}</h1>
      <Card title="Overview"><p>{c.topics.length} topics · weightage {c.weightage}%. Important: {c.topics.filter((t) => t.content.importance === "high").map((t) => t.title).join(", ") || "—"}.</p></Card>
      <RevisionSheet topics={c.topics} />
    </>
  );
}

export function RapidRevision() {
  const { sid } = useParams(); const s = SUBJECT_BY_ID[sid];
  if (!s) return <NotFound />;
  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: s.name, to: `/subject/${s.id}` }, { label: "Rapid Revision" }]} />
      <h1>{s.icon} {s.short} → Rapid Revision</h1>
      <p className="muted">Whole subject in one page. Expand a chapter to revise its definitions, key points, checklists, comparisons and questions.</p>
      {s.chapters.map((c, i) => (
        <details className="chapter-fold" key={c.id} open={i === 0}>
          <summary><strong>Chapter {c.number}: {c.title}</strong> <span className="muted">({c.topics.length} topics)</span></summary>
          <RevisionSheet topics={c.topics} />
        </details>
      ))}
    </>
  );
}

export function TopicPage() {
  const { tid } = useParams(); const state = useStore(); const t = TOPIC_BY_ID[tid];
  useEffect(() => { if (t) { actions.visit(tid); window.scrollTo(0, 0); } }, [tid]);
  if (!t) return <NotFound />;
  const c = t.content; const s = SUBJECT_BY_ID[t.subjectId]; const ch = CHAPTER_BY_ID[t.chapterId];
  const idx = ch.topics.findIndex((x) => x.id === tid); const prev = ch.topics[idx - 1]; const next = ch.topics[idx + 1];
  const exam = state.examMode;
  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: s.name, to: `/subject/${s.id}` }, { label: `Chapter ${ch.number}`, to: `/chapter/${ch.id}` }, { label: t.title }]} />
      <header className="topic-head">
        <h1>{t.title}</h1>
        <div className="actions">
          <button className={`btn ${state.bookmarks[tid] ? "on" : "ghost"}`} onClick={() => actions.toggleBookmark(tid)}>🔖 {state.bookmarks[tid] ? "Bookmarked" : "Bookmark"}</button>
          <button className={`btn ${state.completed[tid] ? "on" : "ghost"}`} onClick={() => actions.toggleComplete(tid)}>{state.completed[tid] ? "✔ Completed" : "Mark complete"}</button>
          <button className="btn ghost" onClick={() => actions.setExam(!exam)}>Exam Mode: {exam ? "ON" : "OFF"}</button>
        </div>
      </header>
      <Card title="⭐ Exam Importance"><p><ImportanceBadge level={c.importance} /> {c.importance === "high" ? "Frequently asked — revise first." : c.importance === "medium" ? "Often asked — revise after high-importance topics." : "Lower priority."}</p>{t.subtopics.length > 0 && <p className="muted">Covers: {t.subtopics.map((x) => x.title).join(" · ")}</p>}{t.syllabusNote && <p className="note">Syllabus note: {t.syllabusNote}</p>}</Card>
      <Card title="Definition"><Text>{c.definition}</Text>{c.technicalDefinition && <><h4>Technical Definition</h4><Text>{c.technicalDefinition}</Text></>}</Card>
      {exam ? (
        <>
          <Card title="Quick Revision"><Text>{c.quickRevision}</Text></Card>
          <Card title="Key Points"><Bullets items={c.keyPoints} /></Card>
          <Card title="Must Remember"><Bullets items={c.mustKnow} /></Card>
          {FORMULA_BLOCKS.some(([f]) => c[f]) || c.cases || c.comparison ? (
            <Card title="Formulas, Complexity & Comparisons">
              {FORMULA_BLOCKS.map((b) => renderBlock(c, b))}
              {c.cases && <div className="block"><h3>Best / Average / Worst Case</h3><Bullets items={Object.entries(c.cases).map(([k, v]) => `${k}: ${v}`)} /></div>}
              {c.comparison && <Table table={c.comparison} />}
            </Card>
          ) : null}
        </>
      ) : (
        <>
          <Card title="Simple Explanation"><Text>{c.simpleExplanation}</Text></Card>
          <Card title="Real-Life Analogy"><Text>{c.realLifeAnalogy}</Text></Card>
          <Card title="Example"><Text>{c.example}</Text></Card>
          {BLOCKS.some((b) => c[b[0]] && (!Array.isArray(c[b[0]]) || c[b[0]].length)) && (
            <Card title="How It Works (details)">{BLOCKS.map((b) => renderBlock(c, b))}</Card>
          )}
          {(c.timeComplexity || c.spaceComplexity || c.complexity || c.cases) && (
            <Card title="Complexity">{["timeComplexity", "spaceComplexity", "complexity"].map((f) => c[f] && <p key={f}><strong>{f.replace("Complexity", " complexity")}:</strong> {c[f]}</p>)}{c.cases && <Bullets items={Object.entries(c.cases).map(([k, v]) => `${k}: ${v}`)} />}</Card>
          )}
          {c.comparison && <Card title="Comparison"><Table table={c.comparison} /></Card>}
          <Card title="Key Points"><Bullets items={c.keyPoints} /></Card>
          <Card title="Must Remember"><Bullets items={c.mustKnow} /></Card>
          <Card title="If You Know This Topic, You Should Be Able To…"><Bullets items={c.ifYouKnow} /></Card>
          <Card title="Common Mistakes"><Bullets items={c.commonMistakes} /></Card>
          <Card title="Quick Revision"><Text>{c.quickRevision}</Text></Card>
        </>
      )}
      <Card title={exam ? "Important Questions" : "Exam Questions"}>
        {c.examQuestions.map((q, i) => <Answer key={i} q={q.question} a={q.answer} type={q.type} />)}
        {c.examProblems && c.examProblems.map((q, i) => <Answer key={"p" + i} q={q.question} a={q.answer} type="problem" />)}
      </Card>
      <KnowledgeCheck topic={t} state={state} />
      <nav className="pager">
        {prev ? <Link className="btn ghost" to={`/topic/${prev.id}`}>← {prev.title}</Link> : <span />}
        {next ? <Link className="btn" to={`/topic/${next.id}`}>{next.title} →</Link> : <Link className="btn" to={`/chapter/${ch.id}`}>Back to chapter</Link>}
      </nav>
    </>
  );
}

export function SearchPage() {
  const [params, setParams] = useSearchParams(); const q = params.get("q") || "";
  const results = useMemo(() => search(q), [q]);
  const groups = { subject: [], chapter: [], topic: [] };
  results.forEach((r) => groups[r.type].push(r));
  return (
    <>
      <h1>Search</h1>
      <input className="search big" autoFocus value={q} onChange={(e) => setParams({ q: e.target.value })} placeholder="Search subjects, chapters, topics, concepts…" />
      {q && !results.length && <p className="muted">No results for “{q}”.</p>}
      {[["subject", "Subjects"], ["chapter", "Chapters"], ["topic", "Topics"]].map(([k, label]) => groups[k].length > 0 && (
        <Card key={k} title={`${label} (${groups[k].length})`}><ul className="plain">{groups[k].map((r) => <li key={r.id}><Link to={r.path}>{r.title}</Link> <span className="muted">{r.sub}</span></li>)}</ul></Card>
      ))}
    </>
  );
}

export function Header() {
  const state = useStore(); const nav = useNavigate(); const [q, setQ] = useState("");
  return (
    <header className="top">
      <Link to="/" className="brand">📚 Exam Revision Hub</Link>
      <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`); }}>
        <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. heuristic, DFA, Lambda…" aria-label="Search" />
      </form>
      <label className="switch small"><input type="checkbox" checked={state.examMode} onChange={(e) => actions.setExam(e.target.checked)} /> Exam Mode</label>
    </header>
  );
}
