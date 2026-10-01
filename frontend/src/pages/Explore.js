import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Loader,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X
} from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "";
const types = ["question", "problem", "idea", "insight", "goal"];
const typeIcons = { question: HelpCircle, problem: AlertCircle, idea: Lightbulb, insight: Sparkles, goal: Target };
const typeColors = { question: "#5ee7df", problem: "#ff6b81", idea: "#f5c76b", insight: "#a99fff", goal: "#62e6a7" };

function Explore() {
  const [explorations, setExplorations] = useState([]);
  const [formData, setFormData] = useState({ type: "question", title: "", content: "" });
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [results, setResults] = useState([]);
  const [correctedQuery, setCorrectedQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const request = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/explore${path}`, {
      ...options,
      headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Request failed");
    return data;
  };

  const loadExplorations = async () => {
    try {
      setLoading(true);
      const data = await request("/");
      setExplorations(data.data);
    } catch (loadError) {
      setError(loadError.message || "Failed to load explorations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadExplorations(); }, []);

  const createExploration = async (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and details are required");
      return;
    }
    try {
      await request("/", { method: "POST", body: JSON.stringify(formData) });
      setFormData({ type: "question", title: "", content: "" });
      setShowForm(false);
      setError("");
      await loadExplorations();
    } catch (createError) {
      setError(createError.message || "Failed to create exploration");
    }
  };

  const search = async (event, requestedQuery = query) => {
    event?.preventDefault();
    const searchQuery = requestedQuery.trim();
    if (!searchQuery) {
      setError("Enter a question or problem to search");
      return;
    }
    try {
      setSearching(true);
      setCurrentQuery(searchQuery);
      const data = await request("/search", { method: "POST", body: JSON.stringify({ query: searchQuery }) });
      setResults(data.data.results || data.data);
      setCorrectedQuery(data.data.correctedQuery || "");
      setError("");
    } catch (searchError) {
      setError(searchError.message || "Failed to search for solutions");
    } finally {
      setSearching(false);
    }
  };

  const saveInsights = async () => {
    if (!currentQuery || results.length === 0) return;
    try {
      await request("/", {
        method: "POST",
        body: JSON.stringify({
          type: "question",
          title: currentQuery,
          content: currentQuery,
          status: "researching",
          insights: results.slice(0, 3).map((result) => `• ${result.snippet}`).join("\n\n"),
          related_links: results.slice(0, 3).map((result) => result.link).join("\n")
        })
      });
      setResults([]);
      setCurrentQuery("");
      setCorrectedQuery("");
      await loadExplorations();
    } catch (saveError) {
      setError(saveError.message || "Failed to save insights");
    }
  };

  const deleteExploration = async (id) => {
    if (!window.confirm("Delete this exploration?")) return;
    try {
      await request(`/${id}`, { method: "DELETE" });
      await loadExplorations();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete exploration");
    }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#0b0f19", color: "#f5f7ff", fontSize: "14px", outline: "none" };
  const buttonStyle = { border: "none", borderRadius: "10px", padding: "12px 18px", color: "white", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" };
  const formattedNow = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date());

  const renderSearchContent = () => {
    if (searching) return <p style={{ color: "#8b93a7" }}>Searching the web...</p>;
    if (results.length === 0) return <p style={{ color: "#8b93a7" }}>No results found. Try a different query.</p>;

    return <>
      <div style={{ display: "grid", gap: "12px", margin: "18px 0" }}>{results.map((result, index) => <article key={`${result.link}-${index}`} style={{ padding: "16px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
        <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ color: "#5ee7df", fontWeight: "600", textDecoration: "none" }}>{result.title} <ExternalLink size={13} /></a>
        <p style={{ color: "#d9dced", lineHeight: 1.5, fontSize: "14px" }}>{result.snippet}</p>
        <small style={{ color: "#686f84" }}>{result.source}</small>
      </article>)}</div>
      <button onClick={saveInsights} style={{ ...buttonStyle, width: "100%", background: "rgba(139,124,255,0.16)", color: "#a99fff" }}><BookOpen size={16} /> Save with Insights</button>
    </>;
  };

  const renderExplorations = () => {
    if (loading) return <p style={{ color: "#8b93a7" }}>Loading explorations...</p>;
    if (explorations.length === 0) return <p style={{ color: "#8b93a7", textAlign: "center", padding: "50px" }}>No explorations yet. Start exploring.</p>;

    return <div style={{ display: "grid", gap: "16px" }}>{explorations.map((exploration) => {
      const Icon = typeIcons[exploration.type] || HelpCircle;
      const color = typeColors[exploration.type] || "#8b93a7";
      return <article key={exploration.id} style={{ padding: "22px", borderRadius: "14px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><div style={{ display: "flex", gap: "10px", alignItems: "center" }}><Icon color={color} size={20} /><div><h2 style={{ fontSize: "17px", margin: 0 }}>{exploration.title}</h2><small style={{ color: "#686f84" }}>{exploration.status} · {new Date(exploration.created_at).toLocaleDateString()}</small></div></div><button aria-label="Delete exploration" onClick={() => deleteExploration(exploration.id)} style={{ background: "none", border: "none", color: "#8b93a7", cursor: "pointer" }}><Trash2 size={17} /></button></div>
        <p style={{ color: "#d9dced", lineHeight: 1.6 }}>{exploration.content}</p>
        {exploration.insights && <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(139,124,255,0.08)", color: "#d9dced", whiteSpace: "pre-line" }}><strong style={{ color: "#a99fff" }}>Insights</strong><p style={{ marginBottom: 0 }}>{exploration.insights}</p></div>}
        {exploration.related_links && <div style={{ marginTop: "14px" }}>{exploration.related_links.split("\n").map((link) => <a key={link} href={link} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: "#5ee7df", marginTop: "6px", overflowWrap: "anywhere" }}>{link}</a>)}</div>}
      </article>;
    })}</div>;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Sparkles color="#a99fff" />
          <h1 style={{ fontSize: "32px", margin: 0 }}>Explore</h1>
        </div>
        <p style={{ color: "#8b93a7" }}>Ask questions, find solutions from the web, and explore ideas.</p>
        <button style={{ ...buttonStyle, background: "linear-gradient(135deg, #8b7cff, #725cf0)" }} onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New Exploration
        </button>
      </header>

      <nav style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }} aria-label="Explore sections">
        {[{ id: "discover", label: "Discover" }, { id: "saved", label: "Saved" }, { id: "daily", label: "Daily reflection" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 14px", border: "none", borderBottom: activeTab === tab.id ? "2px solid #5ee7df" : "2px solid transparent", background: "transparent", color: activeTab === tab.id ? "#f5f7ff" : "#8b93a7", cursor: "pointer", fontWeight: "600" }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {error && <div style={{ padding: "14px 18px", marginBottom: "20px", borderRadius: "10px", color: "#ff6b81", background: "rgba(255,107,129,0.12)" }}>{error}</div>}

      {activeTab === "discover" && <section style={{ padding: "24px", marginBottom: "24px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(139,124,255,0.08), rgba(94,231,223,0.05))", border: "1px solid rgba(139,124,255,0.15)" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 8px" }}>Search for solutions</h2>
        <p style={{ color: "#8b93a7", fontSize: "14px", margin: "0 0 18px" }}>Search uses DuckDuckGo for free, or Google Custom Search when configured.</p>
        <form onSubmit={search} style={{ display: "flex", gap: "10px" }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="How can I reduce stress naturally?" style={inputStyle} />
          <button type="submit" disabled={searching} style={{ ...buttonStyle, background: "linear-gradient(135deg, #5ee7df, #4ac9c2)", opacity: searching ? 0.6 : 1 }}>
            {searching ? <Loader size={16} /> : <Search size={16} />} Search
          </button>
        </form>
      </section>}

      {activeTab === "discover" && currentQuery && <section style={{ padding: "24px", marginBottom: "24px", borderRadius: "16px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", margin: 0 }}>Results for “{currentQuery}”</h2>
          <button aria-label="Close search results" onClick={() => { setCurrentQuery(""); setResults([]); setCorrectedQuery(""); }} style={{ background: "none", border: "none", color: "#8b93a7", cursor: "pointer" }}><X size={20} /></button>
        </div>
        {correctedQuery && correctedQuery !== currentQuery && <p style={{ color: "#f5c76b", marginBottom: "8px" }}>Google correction: <button onClick={() => { setQuery(correctedQuery); search(undefined, correctedQuery); }} style={{ border: "none", background: "none", color: "#5ee7df", cursor: "pointer", padding: 0, fontWeight: "600" }}>{correctedQuery}</button></p>}
        <p style={{ color: "#686f84", fontSize: "12px" }}>Web results are informational. For urgent or serious health symptoms, contact a qualified professional or local emergency service.</p>
        {renderSearchContent()}
      </section>}

      {activeTab === "daily" && <section style={{ padding: "24px", marginBottom: "24px", borderRadius: "16px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h2 style={{ fontSize: "20px", marginTop: 0 }}>Today</h2>
        <p style={{ color: "#5ee7df" }}>{formattedNow}</p>
        <p style={{ color: "#d9dced", lineHeight: 1.6 }}>Use a short daily reflection to notice what you are thinking, what helped your habits, and what you want to try next.</p>
        <button onClick={() => { setActiveTab("discover"); setShowForm(true); }} style={{ ...buttonStyle, background: "linear-gradient(135deg, #8b7cff, #725cf0)" }}><Plus size={16} /> Add today’s reflection</button>
      </section>}

      {showForm && activeTab !== "saved" && <section style={{ padding: "24px", marginBottom: "24px", borderRadius: "16px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><h2 style={{ fontSize: "18px", margin: 0 }}>New Exploration</h2><button aria-label="Close form" onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#8b93a7", cursor: "pointer" }}><X size={20} /></button></div>
        <form onSubmit={createExploration} style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })} style={inputStyle}>{types.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select>
          <input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} placeholder="What do you want to explore?" style={inputStyle} />
          <textarea required rows={5} value={formData.content} onChange={(event) => setFormData({ ...formData, content: event.target.value })} placeholder="Describe your question, problem, or idea..." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          <button type="submit" style={{ ...buttonStyle, background: "linear-gradient(135deg, #8b7cff, #725cf0)" }}>Save Exploration</button>
        </form>
      </section>}

      {activeTab === "saved" && renderExplorations()}
      {activeTab === "daily" && <div style={{ marginTop: "20px" }}><h2 style={{ fontSize: "18px" }}>Recent reflections</h2>{renderExplorations()}</div>}
    </div>
  );
}

export default Explore;
