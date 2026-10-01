import { useState, useEffect } from "react";
import {
  Lightbulb,
  Plus,
  Trash2,
  Search,
  X
} from "lucide-react";

function Thoughts() {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    category: ""
  });
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Fetch thoughts on component mount
  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/thoughts`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thoughts");
      }

      const data = await response.json();
      setThoughts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/thoughts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create thought");
      }

      // Reset form and fetch updated list
      setFormData({
        title: "",
        content: "",
        mood: "",
        category: ""
      });
      setShowForm(false);
      fetchThoughts();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this thought?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/thoughts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete thought");
      }

      fetchThoughts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter thoughts based on search and category
  const filteredThoughts = thoughts.filter((thought) => {
    const matchesSearch =
      thought.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (thought.title && thought.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory =
      !filterCategory || thought.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(thoughts.map((t) => t.category).filter(Boolean))];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px"
          }}
        >
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
            <Lightbulb size={20} />
          </div>
          <h1 style={{ fontSize: "32px", margin: 0 }}>Thoughts</h1>
        </div>
        
        <p style={{ color: "#8b93a7", margin: "0 0 25px 0" }}>
          Capture and organize your thoughts.
        </p>

        {/* Actions Bar */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
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
            New Thought
          </button>

          {/* Search */}
          <div
            style={{
              flex: "1",
              minWidth: "200px",
              position: "relative"
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#686f84"
              }}
            />
            <input
              type="text"
              placeholder="Search thoughts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px 11px 42px",
                borderRadius: "11px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#111624",
                color: "#f5f7ff",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: "11px 14px",
                borderRadius: "11px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#111624",
                color: "#f5f7ff",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "11px",
            background: "rgba(255,107,129,0.12)",
            border: "1px solid rgba(255,107,129,0.2)",
            color: "#ff6b81",
            marginBottom: "25px",
            fontSize: "14px"
          }}
        >
          {error}
        </div>
      )}

      {/* New Thought Form */}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px" }}>
              New Thought
            </h3>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                color: "#686f84",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "6px"
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#d9dced"
                }}
              >
                Title (optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Give your thought a title..."
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
              />
            </div>

            {/* Content */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#d9dced"
                }}
              >
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="What's on your mind?"
                required
                rows={5}
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

            {/* Mood and Category Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
                marginBottom: "22px"
              }}
            >
              {/* Mood */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#d9dced"
                  }}
                >
                  Mood
                </label>
                <select
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#0b0f19",
                    color: "#f5f7ff",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Select mood...</option>
                  <option value="happy">😊 Happy</option>
                  <option value="calm">😌 Calm</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="thoughtful">🤔 Thoughtful</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="sad">😢 Sad</option>
                  <option value="angry">😠 Angry</option>
                  <option value="confused">😕 Confused</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#d9dced"
                  }}
                >
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Work, Personal, Ideas..."
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
                />
              </div>
            </div>

            {/* Submit Button */}
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
              Save Thought
            </button>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#686f84" }}>
          Loading thoughts...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredThoughts.length === 0 && !showForm && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "#686f84"
          }}
        >
          <Lightbulb size={48} style={{ marginBottom: "20px", opacity: 0.3 }} />
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
            {searchTerm || filterCategory
              ? "No thoughts match your search"
              : "No thoughts yet"}
          </p>
          <p style={{ fontSize: "14px", marginBottom: "25px" }}>
            {searchTerm || filterCategory
              ? "Try different search terms"
              : "Capture your first thought"}
          </p>
          {!searchTerm && !filterCategory && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(139,124,255,0.1)",
                color: "#a99fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Plus size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Create Thought
            </button>
          )}
        </div>
      )}

      {/* Thoughts List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredThoughts.map((thought) => (
          <div
            key={thought.id}
            style={{
              padding: "24px",
              borderRadius: "14px",
              background: "#111624",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "border-color 0.2s ease"
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
            }
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px"
              }}
            >
              <div style={{ flex: 1 }}>
                {thought.title && (
                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "17px",
                      color: "#f5f7ff"
                    }}
                  >
                    {thought.title}
                  </h3>
                )}
                
                {/* Meta info */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    fontSize: "12px",
                    color: "#686f84"
                  }}
                >
                  <span>
                    {new Date(thought.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                  
                  {thought.mood && (
                    <>
                      <span>•</span>
                      <span>{thought.mood}</span>
                    </>
                  )}
                  
                  {thought.category && (
                    <>
                      <span>•</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: "rgba(139,124,255,0.12)",
                          color: "#a99fff"
                        }}
                      >
                        {thought.category}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleDelete(thought.id)}
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(255,255,255,0.04)",
                    color: "#8b93a7",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,107,129,0.12)";
                    e.currentTarget.style.color = "#ff6b81";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#8b93a7";
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: "#d9dced",
                whiteSpace: "pre-wrap"
              }}
            >
              {thought.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Thoughts;