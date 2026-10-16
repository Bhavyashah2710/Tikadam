import fs from "fs";
const d="src/data/syllabus/";
const idx=JSON.parse(fs.readFileSync(d+"subjects.json","utf8"));
const seen=new Set();let ch=0,tp=0,err=0;
for(const s of idx.subjects){
  const j=JSON.parse(fs.readFileSync(d+s.file,"utf8"));
  ch+=j.chapters.length;
  for(const c of j.chapters){
    const ids=[c.id];
    for(const t of c.topics){tp++;ids.push(t.id,...t.subtopics.map(x=>x.id));}
    for(const id of ids){if(seen.has(id)){console.log("DUP",id);err++;}seen.add(id);}}
}
const ok=ch===31&&tp===idx.totals.topics&&idx.subjects.length===5;
console.log(`subjects=5 chapters=${ch} topics=${tp} errors=${err}`);
process.exit(ok&&!err?0:1);
