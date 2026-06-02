import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FoldersTab from "./pages/FoldersTab.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotesTab from "./pages/NotesTab.jsx";
import TagsTab from "./pages/TagsTab.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />}>
            <Route index element={<Navigate to="/notes" replace />} />
            <Route path="notes" element={<NotesTab />} />
            <Route path="folders" element={<FoldersTab />} />
            <Route path="tags" element={<TagsTab />} />
          </Route>
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
