import { Link } from "react-router-dom";
import { actions, scoreOf } from "./lib/store.js";

export const ImportanceBadge = ({ level }) => (
  <span className={`badge imp-${level}`}>{level === "high" ? "⭐ High" : level === "medium" ? "Medium" : "Low"}</span>
);

export function ProgressBar({ pct, label }) {
  return (
    <div className="progress" title={`${pct}%`}>
      <div className="progress-bar" style={{ width: `${pct}%` }} />
      {label !== false && <span className="progress-label">{label || `${pct}%`}</span>}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="sep"> → </span>}
        </span>
      ))}
    </nav>
  );
}

export const Card = ({ title, children, className = "" }) => (
  <section className={`card ${className}`}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

export const Text = ({ children }) => <p className="pre">{children}</p>;
export const Code = ({ children }) => <pre className="code"><code>{children}</code></pre>;
export const Bullets = ({ items, ordered }) => {
  const Tag = ordered ? "ol" : "ul";
  return <Tag>{items.map((x, i) => <li key={i}>{typeof x === "string" ? x : JSON.stringify(x)}</li>)}</Tag>;
};

export function Table({ table }) {
  return (
    <div className="table-wrap">
      {table.title && <h4>{table.title}</h4>}
      <table>
        <thead><tr>{table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export const Answer = ({ q, a, type }) => (
  <details className="qa">
    <summary>{type && <span className="qtype">{type}</span>}{q}</summary>
    <div className="answer"><strong>Answer:</strong> <span className="pre">{a}</span></div>
  </details>
);

export function KnowledgeCheck({ topic, state }) {
  const qs = topic.content.knowledgeCheck;
  const sc = scoreOf(state, topic.id, qs.length);
  const answers = state.scores[topic.id]?.answers || {};
  return (
    <Card title="Knowledge Check" className="kc">
      <div className="scorebar" role="status">
        <span className="ok">✔ Correct: {sc.correct}</span>
        <span className="bad">✘ Wrong: {sc.wrong}</span>
        <strong>Score: {sc.correct}/{sc.total}</strong>
        <button className="link" onClick={() => actions.resetScore(topic.id)}>Reset</button>
      </div>
      {qs.map((q, i) => {
        const isMcq = String(q.type).toLowerCase() === "mcq" && q.options;
        const done = answers[i] !== undefined;
        return (
          <div className={`kq ${done ? (answers[i] ? "right" : "wrong") : ""}`} key={i}>
            <p><span className="qtype">{q.type}</span> <strong>Q{i + 1}.</strong> {q.question}</p>
            {isMcq ? (
              <div className="opts">
                {q.options.map((o) => (
                  <button key={o} className="opt" disabled={done} onClick={() => actions.answer(topic.id, i, o === q.answer)}>{o}</button>
                ))}
              </div>
            ) : (
              <details>
                <summary>Show Answer</summary>
                <p className="answer"><strong>Answer:</strong> {q.answer}</p>
                {!done && (
                  <p>
                    <button className="btn small" onClick={() => actions.answer(topic.id, i, true)}>I got it right</button>{" "}
                    <button className="btn small ghost" onClick={() => actions.answer(topic.id, i, false)}>I got it wrong</button>
                  </p>
                )}
              </details>
            )}
            {done && (
              <p className="answer">
                {answers[i] ? "✔ Correct" : "✘ Wrong"} — <strong>Answer:</strong> {q.answer}
                {q.explanation ? <> · <em>{q.explanation}</em></> : null}
              </p>
            )}
          </div>
        );
      })}
    </Card>
  );
}

// Subject-specific blocks in display order: [field, label, kind]
export const BLOCKS = [
  ["problemStatement", "Problem", "text"], ["approach", "Approach / Idea", "text"], ["purpose", "Purpose", "text"],
  ["formalDefinition", "Formal Definition", "text"], ["notation", "Notation", "text"], ["components", "Components", "list"],
  ["architecture", "Architecture", "text"], ["stateSpace", "State-Space Representation", "text"], ["syntax", "Syntax", "code"],
  ["algorithmSteps", "Algorithm Steps", "olist"], ["derivationSteps", "Derivation / Conversion Steps", "olist"], ["working", "How It Works", "text"],
  ["pseudocode", "Pseudocode", "code"], ["code", "Code Example", "code"], ["expectedOutput", "Expected Output", "code"],
  ["codeExplanation", "Explanation of the Code", "text"], ["workedExample", "Worked Example", "text"], ["examples", "Examples", "list"],
  ["counterexamples", "Counterexamples", "list"], ["diagram", "Diagram / Representation", "code"], ["scenario", "Real-World Scenario", "text"],
  ["features", "Important Features", "list"], ["apis", "Important Classes / APIs", "list"], ["properties", "Properties", "list"],
  ["commonErrors", "Common Errors", "list"],
];
export const FORMULA_BLOCKS = [["syntax", "Syntax", "code"], ["notation", "Notation", "text"], ["timeComplexity", "Time Complexity", "text"], ["spaceComplexity", "Space Complexity", "text"], ["complexity", "Complexity", "text"]];

export function renderBlock(c, [field, label, kind]) {
  const v = c[field];
  if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) return null;
  return (
    <div className="block" key={field}>
      <h3>{label}</h3>
      {kind === "text" && <Text>{v}</Text>}
      {kind === "code" && <Code>{v}</Code>}
      {kind === "list" && <Bullets items={v} />}
      {kind === "olist" && <Bullets items={v} ordered />}
    </div>
  );
}

export function RevisionSheet({ topics }) {
  return (
    <div className="rev">
      {topics.map((t) => {
        const c = t.content;
        const pts = c.keyPoints.slice(0, 4);
        return (
          <article className="card rev-topic" key={t.id}>
            <h3><Link to={`/topic/${t.id}`}>{t.title}</Link> <ImportanceBadge level={c.importance} /></h3>
            <p><strong>Definition:</strong> {c.definition}</p>
            <p className="quick"><strong>Quick:</strong> {c.quickRevision}</p>
            <h4>Key points</h4><Bullets items={pts} />
            <h4>Must-know checklist</h4>
            <ul className="check">{c.mustKnow.map((m, i) => <li key={i}><label><input type="checkbox" /> {m}</label></li>)}</ul>
            {(c.timeComplexity || c.complexity || c.spaceComplexity) && (
              <p><strong>Formulas / complexity:</strong> {[c.timeComplexity && `Time: ${c.timeComplexity}`, c.spaceComplexity && `Space: ${c.spaceComplexity}`, c.complexity].filter(Boolean).join(" · ")}</p>
            )}
            {(c.algorithmSteps || c.pseudocode) && (
              <details><summary>Algorithm</summary>{c.algorithmSteps && <Bullets items={c.algorithmSteps} ordered />}{c.pseudocode && <Code>{c.pseudocode}</Code>}</details>
            )}
            {c.comparison && <details><summary>Comparison</summary><Table table={c.comparison} /></details>}
            <details><summary>Important questions</summary>
              {c.examQuestions.slice(0, 3).map((q, i) => <Answer key={i} q={q.question} a={q.answer} type={q.type} />)}
            </details>
          </article>
        );
      })}
    </div>
  );
}
