import { Link } from "react-router-dom";
import {
  Brain,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";

function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px",
        maxWidth: "1200px",
        margin: "auto"
      }}
    >
      <div style={{ marginBottom: "50px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#a99fff",
            marginBottom: "15px"
          }}
        >
          <Brain size={22} />
          <span>MindOS</span>
        </div>

        <h1 style={{ fontSize: "44px" }}>
          Your mind is a workspace.
        </h1>

        <p
          style={{
            color: "#a2a9bc",
            fontSize: "17px",
            maxWidth: "600px",
            lineHeight: 1.7
          }}
        >
          Capture thoughts, protect your attention and
          explore the questions that matter to you.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px"
        }}
      >
        <DashboardCard
          icon={<Brain />}
          title="Mind"
          description="Capture what's occupying your mind."
          to="/mind"
        />

        <DashboardCard
          icon={<Target />}
          title="Focus"
          description="Protect your attention and do meaningful work."
          to="/focus"
        />

        <DashboardCard
          icon={<Sparkles />}
          title="Explore"
          description="Ask questions and explore ideas with AI."
          to="/explore"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  to
}) {
  return (
    <Link
      to={to}
      style={{
        padding: "28px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#111624",
        transition: "0.2s ease"
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(139,124,255,0.12)",
          color: "#a99fff",
          marginBottom: "25px"
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p
        style={{
          color: "#8b93a7",
          lineHeight: 1.6
        }}
      >
        {description}
      </p>

      <div
        style={{
          color: "#a99fff",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "13px",
          marginTop: "25px"
        }}
      >
        Explore
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}

export default Dashboard;
