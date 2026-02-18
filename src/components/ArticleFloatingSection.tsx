"use client";

type ArticleFloatingSectionProps = {
  children: React.ReactNode;
  index: number;
  totalSections: number;
};

export default function ArticleFloatingSection({
  children,
  index,
  totalSections,
}: ArticleFloatingSectionProps) {
  const overlap = index > 0 ? -48 : 0;
  const zIndex = 10 + totalSections - index;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_60px_120px_-30px_rgba(0,0,0,0.4)]"
      style={{
        zIndex,
        marginTop: overlap,
        boxShadow:
          index === 0
            ? "0 20px 40px -12px rgba(0,0,0,0.45), 0 40px 80px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.15)"
            : `0 ${24 + index * 10}px ${48 + index * 20}px -20px rgba(0,0,0,0.5), 0 60px 120px -30px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.12)`,
      }}
    >
      <div
        className="p-8 lg:p-12 backdrop-blur-sm border border-[#7BC043]/20"
        style={{
          background: "linear-gradient(160deg, rgba(30, 58, 95, 0.97) 0%, rgba(21, 45, 74, 0.98) 50%, rgba(13, 34, 64, 0.99) 100%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
