import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import MealsPage from "./pages/MealsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="meals" element={<MealsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
