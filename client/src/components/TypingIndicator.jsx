export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white/70" />
    </div>
  );
}
