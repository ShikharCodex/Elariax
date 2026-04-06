import { useCallback } from "react";

const FEMALE_HINTS = ["female", "woman", "girl", "zira", "aria", "samantha", "victoria", "natasha", "hazel"];

export const useVoiceSynthesis = () => {
  const pickVoice = useCallback((voiceSettings) => {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    if (voiceSettings?.selectedVoiceName) {
      const selected = voices.find((v) => v.name === voiceSettings.selectedVoiceName);
      if (selected) return selected;
    }

    const preferredGender = voiceSettings?.preferredGender || "female";
    if (preferredGender === "female") {
      const femaleVoice = voices.find((voice) =>
        FEMALE_HINTS.some((hint) => `${voice.name} ${voice.voiceURI}`.toLowerCase().includes(hint))
      );
      if (femaleVoice) return femaleVoice;
    }

    return voices[0];
  }, []);

  const speak = useCallback((text, voiceSettings) => {
    if (!("speechSynthesis" in window) || !voiceSettings?.enabled || !text?.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voiceSettings);
    if (voice) utterance.voice = voice;
    utterance.rate = Number(voiceSettings.rate ?? 1);
    utterance.pitch = Number(voiceSettings.pitch ?? 1);
    utterance.volume = Number(voiceSettings.volume ?? 1);
    window.speechSynthesis.speak(utterance);
  }, [pickVoice]);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
};
