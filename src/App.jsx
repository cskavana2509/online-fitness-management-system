import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  AuthProvider
} from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Sidebar from "./components/Sidebar";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import Members from "./pages/Members";

import Trainers from "./pages/Trainers";

import Schedules from "./pages/Schedules";

import WorkoutPlans from "./pages/WorkoutPlans";

import "./App.css";

function ProtectedLayout({
  children
}) {

  return (

    <ProtectedRoute>

      <div className="app-layout">

        <Sidebar />

        <div className="main-content">

          <Navbar />

          <main>
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>

  );
}

function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedLayout>
                <Members />
              </ProtectedLayout>
            }
          />

          <Route
            path="/trainers"
            element={
              <ProtectedLayout>
                <Trainers />
              </ProtectedLayout>
            }
          />

          <Route
            path="/schedules"
            element={
              <ProtectedLayout>
                <Schedules />
              </ProtectedLayout>
            }
          />

          <Route
            path="/workout-plans"
            element={
              <ProtectedLayout>
                <WorkoutPlans />
              </ProtectedLayout>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );
}

export default App;
