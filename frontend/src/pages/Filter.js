import { useEffect, useState } from "react";
import { Check, Filter as FilterIcon, Plus, Trash2 } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "";

function Filter() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ thought: "", category: "important", reality: "", action: "" });
  const [error, setError] = useState("");

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}/api/filters${path}`, { ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${localStorage.getItem("token")}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  };
  const load = async () => { try { setItems(await request("/")); } catch (loadError) { setError(loadError.message); } };
  useEffect(() => { load(); }, []);
  const create = async (event) => { event.preventDefault(); try { await request("/", { method: "POST", body: JSON.stringify(form) }); setForm({ thought: "", category: "important", reality: "", action: "" }); await load(); } catch (createError) { setError(createError.message); } };
  const toggle = async (id) => { try { await request(`/${id}/toggle`, { method: "PATCH" }); await load(); } catch (toggleError) { setError(toggleError.message); } };
  const remove = async (id) => {
    if (!window.confirm("Delete this filtered thought?")) return;
    try { await request(`/${id}`, { method: "DELETE" }); await load(); } catch (removeError) { setError(removeError.message); }
  };
  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#0b0f19", color: "#f5f7ff", fontSize: "14px" };

  return <div style={{ maxWidth: "900px", margin: "0 auto" }}><header style={{ marginBottom: "30px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><FilterIcon color="#f5c76b" /><h1 style={{ fontSize: "32px", margin: 0 }}>Filter</h1></div><p style={{ color: "#8b93a7" }}>Separate facts, assumptions, feelings, and the next useful action.</p><form onSubmit={create} style={{ display: "grid", gap: "12px", padding: "22px", borderRadius: "14px", background: "#111624" }}><textarea required rows={3} placeholder="What is on your mind?" value={form.thought} onChange={(event) => setForm({ ...form, thought: event.target.value })} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} style={inputStyle}>{["important", "action-needed", "idea", "concern", "gratitude", "other"].map((category) => <option key={category}>{category}</option>)}</select><textarea rows={2} placeholder="What are the facts or reality?" value={form.reality} onChange={(event) => setForm({ ...form, reality: event.target.value })} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} /><input placeholder="What is the next action?" value={form.action} onChange={(event) => setForm({ ...form, action: event.target.value })} style={inputStyle} /><button type="submit" style={{ padding: "12px 18px", border: 0, borderRadius: "10px", background: "#d89b2b", color: "white", fontWeight: 600, cursor: "pointer" }}><Plus size={16} /> Save filtered thought</button></form></header>
    {error && <p style={{ color: "#ff6b81" }}>{error}</p>}
    {items.length === 0 ? <p style={{ color: "#8b93a7" }}>No filtered thoughts yet.</p> : <div style={{ display: "grid", gap: "14px" }}>{items.map((item) => <article key={item.id} style={{ padding: "20px", borderRadius: "14px", background: "#111624" }}><div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}><div><small style={{ color: "#f5c76b", textTransform: "uppercase" }}>{item.category}</small><h2 style={{ fontSize: "17px", margin: "6px 0" }}>{item.thought}</h2></div><div><button aria-label="Complete filtered thought" onClick={() => toggle(item.id)} style={{ background: "none", border: 0, color: item.completed ? "#62e6a7" : "#8b93a7", cursor: "pointer" }}>{item.completed && <Check size={18} />}</button><button aria-label="Delete filtered thought" onClick={() => remove(item.id)} style={{ background: "none", border: 0, color: "#8b93a7", cursor: "pointer" }}><Trash2 size={17} /></button></div></div>{item.reality && <p style={{ color: "#d9dced" }}><strong>Reality:</strong> {item.reality}</p>}{item.action && <p style={{ color: "#62e6a7" }}><strong>Next action:</strong> {item.action}</p>}</article>)}</div>}
  </div>;
}

export default Filter;
