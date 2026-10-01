import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Home,
  Sparkles,
  Lightbulb,
  Target,
  Filter,
  RefreshCw,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: Home
    },
    {
      name: "Mind",
      path: "/mind",
      icon: Brain
    },
    {
      name: "Thoughts",
      path: "/thoughts",
      icon: Lightbulb
    },
    {
      name: "Focus",
      path: "/focus",
      icon: Target
    },
    {
      name: "Filter",
      path: "/filter",
      icon: Filter
    },
    {
      name: "Reprogram",
      path: "/reprogram",
      icon: RefreshCw
    },
    {
      name: "Explore",
      path: "/explore",
      icon: Sparkles
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="app-shell">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Brain size={21} />
          </div>

          <span>MindOS</span>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path)
                    ? "nav-item-active"
                    : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">

          <Link
            to="/settings"
            className={`nav-item ${
              isActive("/settings")
                ? "nav-item-active"
                : ""
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>

        </div>
      </aside>

      {/* Main */}
      <main className="main-content">

        {/* Top bar */}
        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="navigation-buttons">

            <button
              onClick={() => navigate(-1)}
              className="history-button"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => navigate(1)}
              className="history-button"
              title="Go forward"
            >
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="topbar-right">

            <div className="user-avatar">
              A
            </div>

          </div>

        </header>

        {/* Page */}
        <section className="page-content">
          <Outlet />
        </section>

      </main>
    </div>
  );
}

export default Layout;
