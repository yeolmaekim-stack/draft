export default function MenuImage({
  emoji,
  gradient,
  size = "md",
}: {
  emoji: string;
  gradient: [string, string];
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "lg" ? "h-40" : size === "sm" ? "h-16 w-16 shrink-0" : "h-28";
  const fontSize = size === "lg" ? "text-6xl" : size === "sm" ? "text-2xl" : "text-5xl";
  return (
    <div
      className={`relative flex ${dims} w-full items-center justify-center overflow-hidden rounded-2xl`}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,.6) 0, transparent 40%), radial-gradient(circle at 85% 75%, rgba(0,0,0,.25) 0, transparent 45%)",
        }}
      />
      <span className={`${fontSize} drop-shadow-md`}>{emoji}</span>
      <span className="absolute bottom-1 right-2 rounded-full bg-black/25 px-1.5 py-0.5 text-[9px] text-white/70">
        예시 이미지
      </span>
    </div>
  );
}
