import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  Outlet,
} from "react-router-dom";

import { supabase } from "./supabase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

/*
  Load these pages only when the user opens them.
  This prevents one broken page from breaking
  the entire application.
*/
const Members = lazy(
  () => import("./pages/Members")
);

const Trainers = lazy(
  () => import("./pages/Trainers")
);

const Schedules = lazy(
  () => import("./pages/Schedules")
);

const WorkoutPlans = lazy(
  () => import("./pages/WorkoutPlans")
);


/* =========================================================
   ERROR BOUNDARY
========================================================= */

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error) {
    console.error(
      "Page loading error:",
      error
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            minHeight: "300px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#b91c1c",
            }}
          >
            This page could not be loaded
          </h2>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            There is an error in this page's
            code or one of its imports.
          </p>

          <pre
            style={{
              padding: "15px",
              background: "#f3f4f6",
              borderRadius: "8px",
              overflowX: "auto",
              color: "#374151",
            }}
          >
            {this.state.error?.message ||
              "Unknown error"}
          </pre>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


/* =========================================================
   LOADING COMPONENT
========================================================= */

function PageLoading() {
  return (
    <div
      style={{
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        fontSize: "16px",
      }}
    >
      Loading page...
    </div>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkAuthentication() {
    if (!supabase) {
      setCheckingAuth(false);
      return;
    }

    try {
      const {
        data,
        error,
      } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "Authentication error:",
          error
        );

        setUser(null);
      } else {
        setUser(
          data?.session?.user || null
        );
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="auth-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* SIGNUP */}

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Signup />
            )
          }
        />

        {/* PROTECTED APPLICATION */}

        <Route
          element={
            user ? (
              <DashboardLayout
                user={user}
                setUser={setUser}
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        >

          {/* DASHBOARD */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* MEMBERS */}

          <Route
            path="/members"
            element={
              <PageErrorBoundary>
                <Suspense
                  fallback={<PageLoading />}
                >
                  <Members />
                </Suspense>
              </PageErrorBoundary>
            }
          />

          {/* TRAINERS */}

          <Route
            path="/trainers"
            element={
              <PageErrorBoundary>
                <Suspense
                  fallback={<PageLoading />}
                >
                  <Trainers />
                </Suspense>
              </PageErrorBoundary>
            }
          />

          {/* SCHEDULES */}

          <Route
            path="/schedules"
            element={
              <PageErrorBoundary>
                <Suspense
                  fallback={<PageLoading />}
                >
                  <Schedules />
                </Suspense>
              </PageErrorBoundary>
            }
          />

          {/* WORKOUT PLANS */}

          <Route
            path="/workout-plans"
            element={
              <PageErrorBoundary>
                <Suspense
                  fallback={<PageLoading />}
                >
                  <WorkoutPlans />
                </Suspense>
              </PageErrorBoundary>
            }
          />

        </Route>

        {/* UNKNOWN PAGE */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


/* =========================================================
   DASHBOARD LAYOUT
========================================================= */

function DashboardLayout({
  user,
  setUser,
}) {
  async function handleLogout() {
    try {
      if (supabase) {
        const { error } =
          await supabase.auth.signOut();

        if (error) {
          console.error(
            "Logout error:",
            error
          );
          return;
        }
      }

      setUser(null);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  return (
    <div className="app-layout">

      {/* NAVBAR */}

      <header className="navbar">

        <Link
          to="/"
          className="navbar-brand"
        >
          Fitness Management System
        </Link>

        <div className="navbar-right">

          <span className="navbar-user">
            {user?.email || "Admin"}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <div className="app-body">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="sidebar-title">

            <strong>
              FITNESS
            </strong>

            <small>
              Management
            </small>

          </div>


          <nav className="sidebar-nav">

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              📊 Dashboard
            </NavLink>


            <NavLink
              to="/members"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              👥 Members
            </NavLink>


            <NavLink
              to="/trainers"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              🏋️ Trainers
            </NavLink>


            <NavLink
              to="/schedules"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              📅 Schedules
            </NavLink>


            <NavLink
              to="/workout-plans"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              💪 Workout Plans
            </NavLink>

          </nav>

        </aside>


        {/* PAGE */}

        <main className="main-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default App;