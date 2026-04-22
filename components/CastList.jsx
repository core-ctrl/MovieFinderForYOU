// components/CastList.jsx
export default function CastList({ cast = [] }) {
  if (!cast.length) return null;
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {cast.slice(0, 12).map((actor) => (
        <div key={actor.id} className="flex-none w-24">
          <div className="w-full h-32 rounded-xl overflow-hidden bg-white/5 mb-2">
            {actor.profile_path ? (
              <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <p className="text-xs font-medium truncate">{actor.name}</p>
          <p className="text-xs text-neutral-500 truncate">{actor.character}</p>
        </div>
      ))}
    </div>
  );
}
