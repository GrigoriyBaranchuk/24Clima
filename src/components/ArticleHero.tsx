"use client";

type ArticleHeroProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ArticleHero({ children, className = "" }: ArticleHeroProps) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(145deg, #1e3a5f 0%, #152d4a 50%, #0d2240 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.5), 0 50px 100px -25px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}
