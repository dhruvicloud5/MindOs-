import { useState, useEffect } from "react";
import { Brain, Plus } from "lucide-react";

function Mind() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    energy: 5,
    clarity: 5,
    stress: 5,
    mood: "",
    note: ""
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mind`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.REACT_APP_API_URL}/api/mind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      setFormData({
        energy: 5,
        clarity: 5,
        stress: 5,
        mood: "",
        note: ""
      });
      setShowForm(false);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "11px",
              background: "rgba(139,124,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a99fff"
            }}
          >
            <Brain size={20} />
          </div>
          <h1 style={{ fontSize: "32px", margin: 0 }}>Mind</h1>
        </div>
        
        <p style={{ color: "#8b93a7", margin: "0 0 20px 0" }}>
          Track your mental state and energy levels.
        </p>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "11px",
            border: "none",
            background: "linear-gradient(135deg, #8b7cff, #725cf0)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          <Plus size={18} />
          New Check-in
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            padding: "28px",
            borderRadius: "16px",
            background: "#111624",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "30px"
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>How are you feeling?</h3>

          <form onSubmit={handleSubmit}>
            {/* Energy Slider */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#d9dced" }}>
                  Energy
                </label>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#62e6a7" }}>
                  {formData.energy}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #ff6b81, #62e6a7)",
                  outline: "none",
                  cursor: "pointer"
                }}
              />
            </div>

            {/* Clarity Slider */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#d9dced" }}>
                  Clarity
                </label>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#5ee7df" }}>
                  {formData.clarity}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.clarity}
                onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #ff6b81, #5ee7df)",
                  outline: "none",
                  cursor: "pointer"
                }}
              />
            </div>

            {/* Stress Slider */}
            <div style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#d9dced" }}>
                  Stress
                </label>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#f5c76b" }}>
                  {formData.stress}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => setFormData({ ...formData, stress: e.target.value })}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: "linear-gradient(90deg, #62e6a7, #ff6b81)",
                  outline: "none",
                  cursor: "pointer"
                }}
              />
            </div>

            {/* Mood */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#d9dced" }}>
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0b0f19",
                  color: "#f5f7ff",
                  fontSize: "14px",
                  outline: "none"
                }}
              >
                <option value="">Select mood...</option>
                <option value="great">😄 Great</option>
                <option value="good">🙂 Good</option>
                <option value="okay">😐 Okay</option>
                <option value="tired">😴 Tired</option>
                <option value="stressed">😓 Stressed</option>
                <option value="anxious">😰 Anxious</option>
                <option value="low">😔 Low</option>
              </select>
            </div>

            {/* Note */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#d9dced" }}>
                Notes (optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Anything on your mind?"
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0b0f19",
                  color: "#f5f7ff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #8b7cff, #725cf0)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Save Check-in
            </button>
          </form>
        </div>
      )}

      {/* Entries List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#686f84" }}>
          Loading...
        </div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#686f84" }}>
          <Brain size={48} style={{ marginBottom: "20px", opacity: 0.3 }} />
          <p>No check-ins yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "#111624",
                border: "1px solid rgba(255,255,255,0.07)"
              }}
            >
              <div style={{ marginBottom: "18px", color: "#686f84", fontSize: "13px" }}>
                {new Date(entry.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
                {entry.mood && <span> • {entry.mood}</span>}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  marginBottom: entry.note ? "18px" : 0
                }}
              >
                <MetricCard label="Energy" value={entry.energy} color="#62e6a7" />
                <MetricCard label="Clarity" value={entry.clarity} color="#5ee7df" />
                <MetricCard label="Stress" value={entry.stress} color="#f5c76b" />
              </div>

              {entry.note && (
                <p style={{ margin: 0, color: "#d9dced", lineHeight: 1.6 }}>
                  {entry.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)"
      }}
    >
      <div style={{ fontSize: "12px", color: "#8b93a7", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "700", color }}>
        {value}<span style={{ fontSize: "14px", opacity: 0.6 }}>/10</span>
      </div>
    </div>
  );
}

export default Mind;