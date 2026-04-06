import { useMemo, useRef, useState } from "react";
import {
  Mic,
  Paperclip,
  Send,
  StopCircle,
  Image as ImageIcon,
} from "lucide-react";

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [attachmentDescription, setAttachmentDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const fileRef = useRef(null);
  const recognitionRef = useRef(null);

  const canUseSpeech = useMemo(
    () =>
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    [],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() && !attachmentName && !attachmentDescription.trim())
      return;

    const attachment =
      attachmentDescription.trim() || attachmentName
        ? {
            type: attachmentName ? "image" : "note",
            description: attachmentDescription.trim(),
            name: attachmentName || "attachment",
          }
        : null;

    onSend(value.trim(), attachment);
    setValue("");
    setAttachmentDescription("");
    setAttachmentName("");
  };

  const toggleListening = () => {
    if (!canUseSpeech) return;
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) setValue((prev) => `${prev} ${transcript}`.trim());
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
      {/* File attachment indicator */}
      {attachmentName && (
        <div className="flex items-center gap-2 self-start rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs text-rose-200">
          <ImageIcon className="h-3 w-3" />
          <span className="max-w-[150px] truncate">{attachmentName}</span>
          <button
            type="button"
            onClick={() => setAttachmentName("")}
            className="ml-1 text-rose-400 hover:text-rose-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Input Row */}
      <div className="flex items-end gap-2 w-full">
        {/* Input Wrapper */}
        <div className="relative flex-1 flex items-center bg-rose-950/40 border border-rose-500/20 rounded-2xl focus-within:border-rose-400/50 focus-within:ring-2 focus-within:ring-rose-400/20 transition-all shadow-inner overflow-hidden min-h-[48px] sm:min-h-[52px]">
          {/* Left Action Buttons */}
          <div className="flex items-center pl-1 sm:pl-2 shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-full transition-colors"
              title="Attach File"
            >
              <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${listening ? "text-rose-100 bg-rose-500/40 animate-pulse" : "text-rose-300 hover:text-rose-100 hover:bg-rose-500/20"}`}
              title="Voice Typing"
            >
              {listening ? (
                <StopCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>

          {/* Text Input */}
          <input
            className="w-full bg-transparent px-2 sm:px-3 py-3 text-sm sm:text-base text-rose-50 placeholder:text-rose-200/40 outline-none"
            placeholder={listening ? "Listening..." : "Message her..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {/* Send Button (Shrink-0 prevents it from getting squished on small screens) */}
        <button
          type="submit"
          disabled={
            isLoading ||
            (!value.trim() && !attachmentName && !attachmentDescription.trim())
          }
          className="shrink-0 h-12 w-12 sm:h-[52px] sm:w-[52px] rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:from-rose-900 disabled:to-rose-950 disabled:text-rose-500/50"
        >
          {/* Added ml-0.5 to physically center the send icon nicely */}
          <Send className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || "")}
      />

      {/* Attachment Context Input - Styled to blend in perfectly */}
      <div className="relative w-full">
        <input
          className="w-full h-9 sm:h-10 rounded-xl border border-rose-500/10 bg-black/20 px-4 text-xs sm:text-sm text-rose-100 outline-none placeholder:text-rose-200/30 focus:border-rose-500/30 focus:bg-rose-950/30 transition-all"
          placeholder="Attachment context (what this means to you)..."
          value={attachmentDescription}
          onChange={(e) => setAttachmentDescription(e.target.value)}
        />
      </div>
    </form>
  );
}
