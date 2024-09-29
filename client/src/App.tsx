import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import MealsPage from "./pages/MealsPage";
import AgendaPage from "./pages/AgendaPage";
import AuthCallback from "./components/Strava/AuthCallback";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="meals" element={<MealsPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
