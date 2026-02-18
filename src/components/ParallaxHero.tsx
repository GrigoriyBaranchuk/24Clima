"use client";

type ParallaxHeroProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ParallaxHero({ children, className = "" }: ParallaxHeroProps) {
  return (
    <div
      className={`relative min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(13, 34, 64, 0.9) 50%, rgba(10, 22, 40, 0.95) 100%)`,
          backgroundAttachment: "fixed",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
