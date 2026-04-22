// components/SkeletonCard.jsx
export function SkeletonCard() {
<<<<<<< HEAD
  return (
    <div className="flex-none w-36 md:w-44 animate-pulse">
      <div className="w-full h-64 bg-white/5 rounded-xl mb-2" />
      <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  );
}

export function SkeletonRow({ count = 6, title }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[100vh] bg-neutral-900 animate-pulse flex items-end px-12 pb-20">
      <div className="max-w-xl w-full">
        <div className="h-12 bg-white/5 rounded-xl w-3/4 mb-4" />
        <div className="h-4 bg-white/5 rounded w-full mb-2" />
        <div className="h-4 bg-white/5 rounded w-2/3 mb-8" />
        <div className="flex gap-4">
          <div className="h-12 w-36 bg-white/5 rounded-xl" />
          <div className="h-12 w-36 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
=======
    return (
        <div className="flex-none w-36 md:w-44 animate-pulse">
            <div className="w-full h-64 bg-white/5 rounded-xl mb-2" />
            <div className="h-3 bg-white/5 rounded w-3/4 mb-1" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
    );
}

export function SkeletonRow({ count = 6, title }) {
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
            </div>
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </section>
    );
}

export function SkeletonHero() {
    return (
        <div className="w-full h-[100vh] bg-neutral-900 animate-pulse flex items-end px-12 pb-20">
            <div className="max-w-xl w-full">
                <div className="h-12 bg-white/5 rounded-xl w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-2/3 mb-8" />
                <div className="flex gap-4">
                    <div className="h-12 w-36 bg-white/5 rounded-xl" />
                    <div className="h-12 w-36 bg-white/5 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
