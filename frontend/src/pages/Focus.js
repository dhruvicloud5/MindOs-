import { useCallback, useEffect, useState } from "react";
import { Check, Clock3, Plus, Target, Trash2 } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "";

function Focus() {
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);
  const [active, setActive] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}/api/focus${path}`, {
      ...options,
      headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }, []);

  const load = useCallback(async () => { try { setSessions(await request("/")); } catch (loadError) { setError(loadError.message); } }, [request]);
  const complete = useCallback(async (id) => {
    try { await request(`/${id}/complete`, { method: "PATCH" }); setActive(null); setRemaining(0); await load(); } catch (completeError) { setError(completeError.message); }
  }, [load, request]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  useEffect(() => { if (active && remaining === 0) complete(active.id); }, [active, remaining, complete]);

  const start = async (event) => {
    event.preventDefault();
    try {
      const session = await request("/", { method: "POST", body: JSON.stringify({ title, duration }) });
      setActive(session);
      setRemaining(Number(session.duration_minutes || duration) * 60);
      setTitle("");
      setError("");
    } catch (startError) { setError(startError.message); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this focus session?")) return;
    try { await request(`/${id}`, { method: "DELETE" }); await load(); } catch (removeError) { setError(removeError.message); }
  };
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const inputStyle = { padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#0b0f19", color: "#f5f7ff", fontSize: "14px" };

  return <div style={{ maxWidth: "900px", margin: "0 auto" }}>
    <div style={{ marginBottom: "30px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><Target color="#62e6a7" /><h1 style={{ fontSize: "32px", margin: 0 }}>Focus</h1></div><p style={{ color: "#8b93a7" }}>Protect one meaningful block of time and record what you completed.</p><form onSubmit={start} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What will you focus on?" style={{ ...inputStyle, flex: 1, minWidth: "220px" }} /><input type="number" min="1" max="240" value={duration} onChange={(event) => setDuration(event.target.value)} style={{ ...inputStyle, width: "90px" }} /><button type="submit" style={{ padding: "12px 18px", border: 0, borderRadius: "10px", background: "#31b878", color: "white", fontWeight: 600, cursor: "pointer" }}><Plus size={16} /> Start</button></form></div>
    {error && <p style={{ color: "#ff6b81" }}>{error}</p>}
    {active && <section style={{ padding: "28px", marginBottom: "24px", textAlign: "center", borderRadius: "16px", background: "rgba(98,230,167,0.1)" }}><Clock3 color="#62e6a7" /><h2>{active.title}</h2><div style={{ fontSize: "48px", color: "#62e6a7", fontVariantNumeric: "tabular-nums" }}>{minutes}:{seconds}</div><button onClick={() => complete(active.id)} style={{ padding: "11px 16px", border: 0, borderRadius: "10px", background: "#31b878", color: "white", cursor: "pointer" }}><Check size={16} /> Complete</button></section>}
    <h2 style={{ fontSize: "19px" }}>Recent sessions</h2>{sessions.length === 0 ? <p style={{ color: "#8b93a7" }}>No focus sessions yet.</p> : <div style={{ display: "grid", gap: "12px" }}>{sessions.map((session) => <article key={session.id} style={{ padding: "18px", borderRadius: "12px", background: "#111624", display: "flex", justifyContent: "space-between", gap: "14px" }}><div><strong>{session.title}</strong><p style={{ color: "#8b93a7", margin: "6px 0 0" }}>{session.duration_minutes} minutes · {new Date(session.started_at).toLocaleString()}</p></div><span style={{ color: session.completed ? "#62e6a7" : "#f5c76b" }}>{session.completed ? "Completed" : "Active"}</span><button aria-label="Delete focus session" onClick={() => remove(session.id)} style={{ background: "none", border: 0, color: "#8b93a7", cursor: "pointer" }}><Trash2 size={17} /></button></article>)}</div>}
  </div>;
}

export default Focus;
