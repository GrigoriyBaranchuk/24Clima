/**
 * Lightweight loading skeleton for lazy-loaded sections.
 * Matches the typical section height to prevent layout shift (CLS).
 */
export default function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`py-16 sm:py-20 ${className}`} role="status" aria-label="Loading...">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-current opacity-[0.08] rounded-lg w-3/4 mx-auto" />
          {/* Subtitle skeleton */}
          <div className="h-4 bg-current opacity-[0.06] rounded w-1/2 mx-auto" />
          {/* Content skeleton */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-current opacity-[0.05] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
