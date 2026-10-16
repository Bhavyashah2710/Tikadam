import { HashRouter, Route, Routes } from "react-router-dom";
import { ChapterPage, ChapterRevision, Header, Home, RapidRevision, SearchPage, SubjectPage, TopicPage } from "./pages.jsx";

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:sid" element={<SubjectPage />} />
          <Route path="/subject/:sid/rapid" element={<RapidRevision />} />
          <Route path="/chapter/:cid" element={<ChapterPage />} />
          <Route path="/chapter/:cid/revision" element={<ChapterRevision />} />
          <Route path="/topic/:tid" element={<TopicPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </HashRouter>
  );
}
