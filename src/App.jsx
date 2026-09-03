import { useEffect, useMemo, useState } from "react";
import "./App.css";
import moviesData from "./data/movies";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";

const STORAGE_KEY = "jiohotstar_library";
const WATCH_KEY = "jiohotstar_watchlist";
const HISTORY_KEY = "jiohotstar_history";

const categories = ["All", "Action", "Drama", "Comedy", "Romance", "Thriller", "Science Fiction", "Sports"];
const navItems = ["Home", "Movies", "Shows", "Sports", "Kids"];

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9 ]/g, "");

function getLibrary() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : moviesData;
  } catch {
    return moviesData;
  }
}

function App() {
  const [library, setLibrary] = useState(getLibrary);
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem(WATCH_KEY) || "[]"));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(library)), [library]);
  useEffect(() => localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist)), [watchlist]);
  useEffect(() => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)), [history]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const enriched = useMemo(
    () =>
      library.map((movie, index) => ({
        ...movie,
        type: index % 4 === 0 ? "Hotstar Specials" : index % 4 === 1 ? "Movies" : "Shows",
        language: index % 3 === 0 ? "Hindi" : index % 3 === 1 ? "English" : "Tamil",
        badge: index % 5 === 0 ? "NEW" : index % 3 === 0 ? "HOT" : "",
      })),
    [library]
  );

  const filtered = useMemo(() => {
    const q = normalize(search);
    return enriched.filter((movie) => {
      const categoryMatch =
        activeCategory === "All" ||
        normalize(movie.genre).includes(normalize(activeCategory));
      const navMatch =
        activeNav === "Home" ||
        activeNav === "Movies" ? activeNav === "Home" || movie.type === "Movies" : true;
      const text = normalize(
        `${movie.name} ${movie.genre} ${movie.director} ${movie.cast} ${movie.description} ${movie.language}`
      );
      return categoryMatch && navMatch && (!q || text.includes(q));
    });
  }, [enriched, search, activeCategory, activeNav]);

  const trending = enriched.slice(0, 8);
  const topRated = [...enriched].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 8);
  const action = enriched.filter((m) => normalize(m.genre).includes("action")).slice(0, 8);
  const continueWatching = history
    .map((id) => enriched.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) =>
      prev.includes(movie.id) ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
    );
    setToast(watchlist.includes(movie.id) ? "Removed from My List" : "Added to My List");
  };

  const openMovie = (movie) => {
    setSelectedMovie(movie);
    setHistory((prev) => [movie.id, ...prev.filter((id) => id !== movie.id)].slice(0, 10));
  };

  const saveMovie = (movie) => {
    if (editingId) {
      setLibrary((prev) => prev.map((item) => (item.id === editingId ? { ...movie, id: editingId } : item)));
      setToast("Movie updated successfully");
    } else {
      setLibrary((prev) => [{ ...movie, id: Date.now() }, ...prev]);
      setToast("Movie added successfully");
    }
    setEditingId(null);
  };

  const deleteMovie = (id) => {
    setLibrary((prev) => prev.filter((movie) => movie.id !== id));
    setWatchlist((prev) => prev.filter((item) => item !== id));
    setToast("Movie deleted successfully");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => { setActiveNav("Home"); setSearch(""); }}>
          <span className="brand-jio">Jio</span><span className="brand-hotstar">Hotstar</span>
        </div>

        <nav className="main-nav">
          {navItems.map((item) => (
            <button key={item} className={activeNav === item ? "nav-link active" : "nav-link"} onClick={() => setActiveNav(item)}>
              {item}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <div className="search-wrap">
            <span>⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for Movies, Shows..." />
            {search && <button className="clear-search" onClick={() => setSearch("")}>×</button>}
          </div>
          <button className="login-btn" onClick={() => setToast("Login screen coming soon")}>Login</button>
          <button className="subscribe-btn" onClick={() => setToast("Subscription flow opened")}>Subscribe</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker">JioHotstar Specials</div>
            <h1>Stories that<br /><span>stay with you.</span></h1>
            <p>Stream blockbuster movies, originals, live sports and your favourite shows — all in one place.</p>
            <div className="hero-meta"><span>★ 8.6</span><span>2024</span><span>2h 46m</span><span>U/A 16+</span></div>
            <div className="hero-buttons">
              <button className="primary-btn" onClick={() => openMovie(enriched.find((m) => m.name === "Dune: Part Two") || enriched[0])}>▶ Watch Now</button>
              <button className="ghost-btn" onClick={() => toggleWatchlist(enriched[0])}>＋ My List</button>
            </div>
          </div>
          <div className="hero-fade" />
        </section>

        <section className="content">
          <div className="category-bar">
            <div>
              <p className="eyebrow">EXPLORE</p>
              <h2>{activeNav === "Home" ? "Curated for you" : activeNav}</h2>
            </div>
            <div className="category-pills">
              {categories.map((cat) => (
                <button key={cat} className={activeCategory === cat ? "pill selected" : "pill"} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {search ? (
            <MovieRow title={`Search results for “${search}”`} movies={filtered} onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />
          ) : activeNav !== "Home" ? (
            <MovieRow title={`${activeNav} picks`} movies={filtered.length ? filtered : enriched} onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />
          ) : (
            <>
              {continueWatching.length > 0 && <MovieRow title="Continue Watching" movies={continueWatching} progress onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />}
              <MovieRow title="Trending Now" movies={trending} rank onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />
              <MovieRow title="Top Rated" movies={topRated} onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />
              <MovieRow title="Action-packed" movies={action} onSelect={openMovie} watchlist={watchlist} onToggle={toggleWatchlist} />
            </>
          )}

          <section className="sports-banner">
            <div>
              <span className="live-dot">● LIVE</span>
              <h2>Catch the biggest moments.</h2>
              <p>Cricket, football, tennis and more — live and on demand.</p>
              <button onClick={() => { setActiveNav("Sports"); setToast("Sports section opened"); }}>Explore Sports →</button>
            </div>
            <div className="sports-art"><span>🏏</span><span>⚽</span><span>🏆</span></div>
          </section>

          <section className="my-list">
            <div className="section-heading">
              <div><p className="eyebrow">YOUR LIBRARY</p><h2>My List</h2></div>
              <span>{watchlist.length} titles</span>
            </div>
            <MovieRow
              title=""
              movies={watchlist.map((id) => enriched.find((m) => m.id === id)).filter(Boolean)}
              onSelect={openMovie}
              watchlist={watchlist}
              onToggle={toggleWatchlist}
              emptyText="Add movies and shows to My List to see them here."
            />
          </section>

          <section className="admin-section">
            <div className="section-heading">
              <div><p className="eyebrow">DEVELOPER MODE</p><h2>Content Management</h2></div>
              <button className="manage-btn" onClick={() => setShowAdmin(!showAdmin)}>{showAdmin ? "Close Manager" : "Open CRUD Manager"}</button>
            </div>
            {showAdmin && (
              <AdminPanel
                movies={library}
                onSave={saveMovie}
                onDelete={deleteMovie}
                onEdit={(movie) => setEditingId(movie.id)}
                editingId={editingId}
                selected={editingId ? library.find((m) => m.id === editingId) : null}
                onCancel={() => setEditingId(null)}
              />
            )}
          </section>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><span className="brand-jio">Jio</span><span className="brand-hotstar">Hotstar</span></div>
        <p>© 2026 JioHotstar-style React project • Built for learning & portfolio use.</p>
        <div className="footer-links"><span>About</span><span>Terms</span><span>Privacy</span><span>Help</span></div>
      </footer>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} inWatchlist={watchlist.includes(selectedMovie.id)} onToggleWatchlist={() => toggleWatchlist(selectedMovie)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function MovieRow({ title, movies, onSelect, watchlist, onToggle, rank, progress, emptyText }) {
  if (!movies.length && title) return <section className="movie-section"><div className="section-heading"><h2>{title}</h2></div><div className="empty">{emptyText || "No titles found."}</div></section>;
  return (
    <section className="movie-section">
      {title && <div className="section-heading"><h2>{title}</h2><button>View All →</button></div>}
      <div className="movie-row">
        {movies.map((movie, index) => <MovieCard key={movie.id} movie={movie} rank={rank ? index + 1 : null} progress={progress ? 30 + (index * 11) % 55 : null} onClick={() => onSelect(movie)} inWatchlist={watchlist.includes(movie.id)} onToggle={() => onToggle(movie)} />)}
      </div>
    </section>
  );
}

function AdminPanel({ movies, onSave, onDelete, onEdit, editingId, selected, onCancel }) {
  const empty = { name: "", genre: "Action Drama", releaseYear: 2026, rating: "8.0/10", duration: "2h 10m", director: "", cast: "", description: "", bannerUrl: "", trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
  const [form, setForm] = useState(selected || empty);

  useEffect(() => setForm(selected || empty), [selected, editingId]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.bannerUrl) return;
    onSave(form);
    setForm(empty);
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? "Edit title" : "Add new title"}</h3>
        <div className="form-grid">
          {["name", "genre", "releaseYear", "rating", "duration", "director", "cast", "bannerUrl", "trailer"].map((key) => (
            <label key={key}>{key.replace(/([A-Z])/g, " $1")}
              <input value={form[key] ?? ""} onChange={(e) => update(key, e.target.value)} />
            </label>
          ))}
          <label className="full">description
            <textarea rows="4" value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} />
          </label>
        </div>
        <div className="form-actions">
          <button className="primary-btn" type="submit">{editingId ? "Update Title" : "Add Title"}</button>
          {editingId && <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div className="admin-table-wrap">
        <h3>Library • {movies.length} titles</h3>
        <div className="admin-table">
          {movies.map((movie) => (
            <div className="admin-row" key={movie.id}>
              <img src={movie.bannerUrl} alt="" />
              <div><strong>{movie.name}</strong><small>{movie.genre}</small></div>
              <button onClick={() => onEdit(movie)}>Edit</button>
              <button className="danger" onClick={() => onDelete(movie.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
