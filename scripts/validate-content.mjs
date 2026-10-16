// Full content validator. Exit code 1 on ERRORS. WARNINGS are informational.
// NOTE: checks structure/coverage only — it can NOT verify academic correctness.
import fs from "fs";
const sy="src/data/syllabus/",ct="src/data/content/";
const errors=[],warnings=[];
const err=(m)=>errors.push(m),warn=(m)=>warnings.push(m);
function readJSON(p){try{return JSON.parse(fs.readFileSync(p,"utf8"))}catch(e){err(`INVALID JSON ${p}: ${e.message}`);return null}}
const idx=readJSON(sy+"subjects.json");
const core=["definition","simpleExplanation","realLifeAnalogy","example","quickRevision"];
const arr=["keyPoints","mustKnow","ifYouKnow","commonMistakes","examQuestions","knowledgeCheck"];
const min={keyPoints:4,mustKnow:2,ifYouKnow:3,commonMistakes:2,examQuestions:1,knowledgeCheck:5};
const subjectFields={
 daa:["problemStatement","approach","algorithmSteps","pseudocode","workedExample","timeComplexity","spaceComplexity"],
 epj:["syntax","code","expectedOutput","codeExplanation","apis","commonErrors"],
 toc:["formalDefinition","notation","components","examples","counterexamples","properties","examProblems"],
 aws:["purpose","features","components","working","scenario","comparison"],
 ai:["algorithmSteps","stateSpace","workedExample","comparison","complexity"]};
const seen=new Set(),contentIds=new Set();
let totalTopics=0,okTopics=0,totalChapters=0;const perSubject={};
for(const s of idx.subjects){
  const syl=readJSON(sy+s.file);const c=readJSON(ct+s.id+".json")||{};
  if(!syl)continue;perSubject[s.id]={topics:0,ok:0,sf:{}};
  totalChapters+=syl.chapters.length;
  if(Object.keys(c).some(k=>!k.startsWith(s.id+"-")))err(`${s.id}: content contains foreign ids`);
  for(const ch of syl.chapters){
    if(seen.has(ch.id))err(`DUP id ${ch.id}`);seen.add(ch.id);
    for(const t of ch.topics){
      totalTopics++;perSubject[s.id].topics++;
      if(seen.has(t.id))err(`DUP id ${t.id}`);seen.add(t.id);
      for(const sb of t.subtopics){if(seen.has(sb.id))err(`DUP id ${sb.id}`);seen.add(sb.id)}
      const e=c[t.id];
      if(!e){err(`MISSING content ${t.id} ${t.title}`);continue}
      contentIds.add(t.id);let bad=false;
      if(e.id!==t.id){err(`${t.id}: content.id mismatch`);bad=true}
      for(const k of core)if(!e[k]||typeof e[k]!=="string"||e[k].trim().length<10){err(`${t.id}: missing/short ${k}`);bad=true}
      for(const k of arr){if(!Array.isArray(e[k])||!e[k].length){err(`${t.id}: missing ${k}`);bad=true}else if(e[k].length<min[k]){err(`${t.id}: ${k} has ${e[k].length} (<${min[k]})`);bad=true}}
      if(!["high","medium","low"].includes(e.importance)){err(`${t.id}: bad importance`);bad=true}
      (e.knowledgeCheck||[]).forEach((q,i)=>{
        if(!q.question||!q.answer){err(`${t.id}: KC[${i}] missing question/answer`);bad=true}
        if(String(q.type).toLowerCase()==="mcq"){
          if(!Array.isArray(q.options)||q.options.length<2){err(`${t.id}: KC[${i}] MCQ without options`);bad=true}
          else if(!q.options.includes(q.answer)){err(`${t.id}: KC[${i}] MCQ answer not in options ("${q.answer}")`);bad=true}}
      });
      (e.examQuestions||[]).forEach((q,i)=>{if(!q.question||!q.answer){err(`${t.id}: examQ[${i}] incomplete`);bad=true}});
      const types=new Set((e.knowledgeCheck||[]).map(q=>String(q.type).toLowerCase()));
      if(types.size<3)warn(`${t.id}: knowledge check has <3 distinct question types`);
      // subject-specific field coverage (applicable-only → informational)
      for(const f of subjectFields[s.id]||[])if(e[f]!==undefined&&e[f]!==""&&!(Array.isArray(e[f])&&!e[f].length))perSubject[s.id].sf[f]=(perSubject[s.id].sf[f]||0)+1;
      if(!bad){okTopics++;perSubject[s.id].ok++}
    }
  }
  for(const id of Object.keys(c))if(!contentIds.has(id)&&c[id]){/* orphan check below */}
  const sylIds=new Set(syl.chapters.flatMap(ch=>ch.topics.map(t=>t.id)));
  for(const id of Object.keys(c))if(!sylIds.has(id))err(`ORPHAN content entry ${id}`);
}
// subject-specific minimums (heuristic expectations)
const expect={daa:["algorithmSteps","pseudocode","timeComplexity"],epj:["code","expectedOutput"],toc:["formalDefinition","examples"],aws:["purpose"],ai:[]};
for(const s of idx.subjects)for(const f of expect[s.id]||[]){const n=perSubject[s.id].sf[f]||0;if(n===0)err(`${s.id}: no topic has subject field ${f}`)}
console.log("=== Content validation ===");
console.log(`chapters=${totalChapters} topics=${totalTopics} fully-valid=${okTopics}`);
for(const [k,v] of Object.entries(perSubject))console.log(` ${k}: ${v.ok}/${v.topics} valid; subject fields: ${Object.entries(v.sf).map(([a,b])=>a+"="+b).join(", ")||"-"}`);
warnings.slice(0,15).forEach(w=>console.log("WARN",w));if(warnings.length>15)console.log(`… ${warnings.length-15} more warnings`);
errors.slice(0,60).forEach(e=>console.log("ERROR",e));if(errors.length>60)console.log(`… ${errors.length-60} more errors`);
console.log(errors.length?`FAILED: ${errors.length} error(s)`:"PASSED: structure/coverage OK (academic correctness NOT verified)");
process.exit(errors.length?1:0);
