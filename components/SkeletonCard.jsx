export function SkeletonCard() {
  return (
    <div className="flex-none w-36 animate-pulse md:w-44">
      <div className="mb-2 h-64 w-full rounded-xl bg-white/5" />
      <div className="mb-1 h-3 w-3/4 rounded bg-white/5" />
      <div className="h-3 w-1/2 rounded bg-white/5" />
    </div>
  );
}

export function SkeletonRow({ count = 6 }) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded bg-white/5" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
}

export function SkeletonHero() {
  return (
    <div className="flex h-[100vh] w-full animate-pulse items-end bg-neutral-900 px-12 pb-20">
      <div className="w-full max-w-xl">
        <div className="mb-4 h-12 w-3/4 rounded-xl bg-white/5" />
        <div className="mb-2 h-4 w-full rounded bg-white/5" />
        <div className="mb-8 h-4 w-2/3 rounded bg-white/5" />
        <div className="flex gap-4">
          <div className="h-12 w-36 rounded-xl bg-white/5" />
          <div className="h-12 w-36 rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetailPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="h-[55vh] w-full animate-pulse bg-white/5 opacity-30" />
      <div className="relative z-10 mx-auto -mt-40 flex max-w-6xl gap-8 px-6">
        <div className="h-72 w-48 flex-shrink-0 animate-pulse rounded-2xl bg-white/5" />
        <div className="flex-1 pt-16">
          <div className="mb-4 h-10 w-2/3 animate-pulse rounded-xl bg-white/5" />
          <div className="mb-4 h-4 w-1/3 animate-pulse rounded bg-white/5" />
          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-7 w-20 animate-pulse rounded-full bg-white/5" />
            ))}
          </div>
          <div className="mb-2 h-4 w-full animate-pulse rounded bg-white/5" />
          <div className="mb-2 h-4 w-full animate-pulse rounded bg-white/5" />
          <div className="mb-8 h-4 w-3/4 animate-pulse rounded bg-white/5" />
          <div className="flex gap-3">
            <div className="h-12 w-40 animate-pulse rounded-xl bg-white/5" />
            <div className="h-12 w-32 animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
