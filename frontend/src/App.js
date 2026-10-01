import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Mind from "./pages/Mind";
import Thoughts from "./pages/Thoughts";
import Focus from "./pages/Focus";
import Filter from "./pages/Filter";
import Reprogram from "./pages/Reprogram";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public pages */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Application */}

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/mind"
            element={<Mind />}
          />

          <Route
            path="/thoughts"
            element={<Thoughts />}
          />

          <Route
            path="/focus"
            element={<Focus />}
          />

          <Route
            path="/filter"
            element={<Filter />}
          />

          <Route
            path="/reprogram"
            element={<Reprogram />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
