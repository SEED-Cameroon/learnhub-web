import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Tutors from "./pages/Tutors";
import TutorProfile from "./pages/TutorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tutors" replace />} />

        <Route path="/tutors" element={<Tutors />} />

        <Route path="/tutors/:id" element={<TutorProfile />} />

        <Route
          path="*"
          element={<h1>404 - Page Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;