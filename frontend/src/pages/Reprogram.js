import { useCallback, useEffect, useState } from "react";
import { Check, Plus, RefreshCw, Trash2, X } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "";

function Reprogram() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", affirmation: "" });

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}/api/reprograms${path}`, {
      ...options,
      headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setHabits(await request("/"));
    } catch (loadError) {
      setError(loadError.message || "Unable to load habits");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { loadHabits(); }, [loadHabits]);

  const createHabit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError("Habit title is required");
    try {
      await request("/", { method: "POST", body: JSON.stringify(form) });
      setForm({ title: "", description: "", affirmation: "" });
      setShowForm(false);
      setError("");
      await loadHabits();
    } catch (createError) {
      setError(createError.message || "Unable to create habit");
    }
  };

  const toggleHabit = async (id) => {
    try {
      await request(`/${id}/complete`, { method: "PATCH" });
      await loadHabits();
    } catch (toggleError) {
      setError(toggleError.message || "Unable to update habit");
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await request(`/${id}`, { method: "DELETE" });
      await loadHabits();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete habit");
    }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#0b0f19", color: "#f5f7ff", fontSize: "14px", outline: "none" };
  const buttonStyle = { border: "none", borderRadius: "10px", padding: "12px 18px", color: "white", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" };
  const now = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date());

  const renderHabits = () => {
    if (loading) return <p style={{ color: "#8b93a7" }}>Loading habits...</p>;
    if (habits.length === 0) return <p style={{ color: "#8b93a7", textAlign: "center", padding: "50px" }}>No habits yet. Start with one small repeatable action.</p>;

    return <div style={{ display: "grid", gap: "14px" }}>{habits.map((habit) => <article key={habit.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px", borderRadius: "14px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
      <button aria-label={habit.completed ? "Mark habit incomplete" : "Mark habit complete"} onClick={() => toggleHabit(habit.id)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: `1px solid ${habit.completed ? "#62e6a7" : "rgba(255,255,255,0.2)"}`, background: habit.completed ? "rgba(98,230,167,0.15)" : "transparent", color: "#62e6a7", cursor: "pointer" }}>{habit.completed && <Check size={18} />}</button>
      <div style={{ flex: 1 }}><h2 style={{ fontSize: "17px", margin: 0, textDecoration: habit.completed ? "line-through" : "none" }}>{habit.title}</h2><p style={{ color: "#8b93a7", margin: "6px 0 0" }}>{habit.description || "Keep this action small and repeatable."}</p>{habit.affirmation && <small style={{ color: "#a99fff" }}>{habit.affirmation}</small>}</div>
      <button aria-label="Delete habit" onClick={() => deleteHabit(habit.id)} style={{ background: "none", border: "none", color: "#8b93a7", cursor: "pointer" }}><Trash2 size={17} /></button>
    </article>)}</div>;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><RefreshCw color="#a99fff" /><h1 style={{ fontSize: "32px", margin: 0 }}>Reprogram</h1></div>
        <p style={{ color: "#8b93a7" }}>Build intentional routines through repetition. {now}</p>
        <button onClick={() => setShowForm(!showForm)} style={{ ...buttonStyle, background: "linear-gradient(135deg, #8b7cff, #725cf0)" }}><Plus size={18} /> New habit</button>
      </header>

      {error && <div style={{ padding: "14px 18px", marginBottom: "20px", borderRadius: "10px", color: "#ff6b81", background: "rgba(255,107,129,0.12)" }}>{error}</div>}

      {showForm && <section style={{ padding: "24px", marginBottom: "24px", borderRadius: "16px", background: "#111624", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><h2 style={{ fontSize: "18px", margin: 0 }}>Create a habit</h2><button aria-label="Close form" onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#8b93a7", cursor: "pointer" }}><X size={20} /></button></div>
        <form onSubmit={createHabit} style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
          <input required placeholder="Habit title, for example: Walk for 20 minutes" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} style={inputStyle} />
          <textarea rows={3} placeholder="Why does this matter?" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          <input placeholder="A short affirmation (optional)" value={form.affirmation} onChange={(event) => setForm({ ...form, affirmation: event.target.value })} style={inputStyle} />
          <button type="submit" style={{ ...buttonStyle, background: "linear-gradient(135deg, #8b7cff, #725cf0)", justifyContent: "center" }}>Save habit</button>
        </form>
      </section>}

      {renderHabits()}
    </div>
  );
}

export default Reprogram;
