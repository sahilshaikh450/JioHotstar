function MovieCard({ movie, onClick, rank, progress, inWatchlist, onToggle }) {
  return (
    <article className="movie-card-wrap">
      {rank && <span className="rank">{rank}</span>}
      <div className="movie-card" onClick={onClick}>
        <div className="poster-wrap">
          <img src={movie.bannerUrl} alt={movie.name} loading="lazy" />
          {movie.badge && <span className="badge">{movie.badge}</span>}
          <button
            className={inWatchlist ? "list-btn saved" : "list-btn"}
            title={inWatchlist ? "Remove from My List" : "Add to My List"}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            {inWatchlist ? "✓" : "+"}
          </button>
          <div className="poster-overlay"><span>▶</span></div>
          {progress && <div className="progress"><span style={{ width: `${progress}%` }} /></div>}
        </div>
        <div className="card-info">
          <h3>{movie.name}</h3>
          <div className="card-meta"><span>★ {movie.rating}</span><span>{movie.releaseYear}</span><span>{movie.language || "Hindi"}</span></div>
          <p>{movie.genre}</p>
        </div>
      </div>
    </article>
  );
}
export default MovieCard;
