import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Chat from "./pages/ChatPage";
import Closet from "./pages/ClosetPage";
import ItemPage from "./pages/ItemPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            token ? (
              <Navigate to="/chat" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="chat"
          element={token ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="closet"
          element={token ? <Closet /> : <Navigate to="/login" replace />}
        />
        <Route
          path="items/:id"
          element={token ? <ItemPage /> : <Navigate to="/login" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
