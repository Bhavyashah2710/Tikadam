import subjectsIdx from "../data/syllabus/subjects.json";
import aiS from "../data/syllabus/ai.json";
import awsS from "../data/syllabus/aws.json";
import daaS from "../data/syllabus/daa.json";
import epjS from "../data/syllabus/epj.json";
import tocS from "../data/syllabus/toc.json";
import aiC from "../data/content/ai.json";
import awsC from "../data/content/aws.json";
import daaC from "../data/content/daa.json";
import epjC from "../data/content/epj.json";
import tocC from "../data/content/toc.json";

const SYL = { ai: aiS, aws: awsS, daa: daaS, epj: epjS, toc: tocS };
const CON = { ai: aiC, aws: awsC, daa: daaC, epj: epjC, toc: tocC };

export const SUBJECTS = subjectsIdx.subjects.map((meta) => {
  const syl = SYL[meta.id];
  const chapters = syl.chapters.map((ch) => ({
    ...ch,
    subjectId: meta.id,
    topics: ch.topics.map((t) => ({
      ...t,
      subjectId: meta.id,
      chapterId: ch.id,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      content: CON[meta.id][t.id] || null,
    })),
  }));
  return { ...meta, chapters };
});

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));
export const CHAPTERS = SUBJECTS.flatMap((s) => s.chapters);
export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
export const ALL_TOPICS = CHAPTERS.flatMap((c) => c.topics);
export const TOPIC_BY_ID = Object.fromEntries(ALL_TOPICS.map((t) => [t.id, t]));
export const topicsOfSubject = (sid) => SUBJECT_BY_ID[sid].chapters.flatMap((c) => c.topics);

export function oneLine(topic, max = 150) {
  const d = topic.content?.definition || "";
  const first = d.split(/(?<=[.!?])\s/)[0] || d;
  return first.length > max ? first.slice(0, max - 1) + "…" : first;
}
