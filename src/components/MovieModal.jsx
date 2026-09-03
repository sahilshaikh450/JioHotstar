function MovieModal({ movie, onClose, inWatchlist, onToggleWatchlist }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-hero">
          <img src={movie.bannerUrl} alt={movie.name} />
          <div className="modal-gradient" />
          <div className="modal-title">
            <span className="eyebrow">{movie.type || "JioHotstar Original"}</span>
            <h1>{movie.name}</h1>
            <div className="hero-meta"><span>★ {movie.rating}</span><span>{movie.releaseYear}</span><span>{movie.duration}</span><span>U/A 13+</span></div>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-actions">
            <button className="primary-btn" onClick={() => alert("Demo player: trailer starts below.")}>▶ Watch Now</button>
            <button className="ghost-btn" onClick={onToggleWatchlist}>{inWatchlist ? "✓ In My List" : "＋ My List"}</button>
          </div>
          <p className="description">{movie.description}</p>
          <div className="detail-grid">
            <div><small>Genre</small><strong>{movie.genre}</strong></div>
            <div><small>Director</small><strong>{movie.director}</strong></div>
            <div><small>Cast</small><strong>{movie.cast}</strong></div>
          </div>
          <div className="trailer-box">
            <div className="section-heading"><h2>Trailer</h2></div>
            <iframe src={movie.trailer} title={`${movie.name} trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
export default MovieModal;
