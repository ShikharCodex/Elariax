import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function MessageBubble({ role, content, createdAt }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "max-w-[80%] rounded-2xl border p-3 shadow-md",
        isUser
          ? "ml-auto border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-600/80 to-violet-600/80"
          : "border-white/10 bg-white/10"
      )}
    >
      <p className="text-sm text-white">{content}</p>
      <p className="mt-1 text-right text-[11px] text-white/60">
        {new Date(createdAt || Date.now()).toLocaleTimeString()}
      </p>
    </motion.div>
  );
}
