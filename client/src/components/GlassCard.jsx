import { cn } from "../utils/cn";

export default function GlassCard({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
