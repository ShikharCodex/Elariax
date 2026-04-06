const clamp = (value) => Math.max(0, Math.min(100, value));
const toward = (current, target, factor = 0.1) => current + (target - current) * factor;

const KEYWORDS = {
  romantic: ["love", "miss you", "darling", "baby", "kiss"],
  angry: ["hate", "stupid", "annoying", "idiot", "mad"],
  sad: ["sad", "alone", "lonely", "depressed", "hurt"],
  happy: ["happy", "great", "awesome", "amazing", "excited"],
};

const POSITIVE_WORDS = ["love", "happy", "sweet", "thanks", "cute", "beautiful", "great", "amazing", "support"];
const NEGATIVE_WORDS = ["hate", "angry", "stupid", "alone", "sad", "depressed", "hurt", "annoyed"];
const AFFECTION_WORDS = ["love", "miss you", "hug", "kiss", "baby", "darling", "care"];
const TRUST_WORDS = ["trust", "honest", "share", "open", "safe", "understand"];

const getDominantEmotion = (emotionState) =>
  Object.entries(emotionState).sort((a, b) => b[1] - a[1])[0][0];

const applyEmotionDelta = (state, deltas) => ({
  happy: clamp(state.happy + (deltas.happy || 0)),
  sad: clamp(state.sad + (deltas.sad || 0)),
  angry: clamp(state.angry + (deltas.angry || 0)),
  romantic: clamp(state.romantic + (deltas.romantic || 0)),
});

const countMatches = (text, words) => words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);

const analyzeEmotionShift = (message, currentState, currentInsights = {}, currentRelationship = {}) => {
  const normalized = message.toLowerCase();
  const deltas = { happy: 0, sad: 0, angry: 0, romantic: 0 };

  Object.entries(KEYWORDS).forEach(([emotion, words]) => {
    words.forEach((word) => {
      if (normalized.includes(word)) {
        deltas[emotion] += 8;
      }
    });
  });

  const hasQuestion = normalized.includes("?");
  const hasExclamation = normalized.includes("!");
  const uppercaseRatio = message ? message.replace(/[^A-Z]/g, "").length / Math.max(1, message.length) : 0;
  const msgLengthFactor = Math.min(1, message.length / 140);
  const intensityBoost = Math.round((Number(hasExclamation) * 2 + uppercaseRatio * 12 + msgLengthFactor * 3) * 2);
  if (hasQuestion) deltas.happy += 1;
  if (hasExclamation) deltas.romantic += 2 + Math.round(intensityBoost / 4);

  deltas.sad -= 1;
  deltas.angry -= 1;

  const baseline = { happy: 50, sad: 12, angry: 8, romantic: 45 };
  const decayed = {
    happy: toward(currentState.happy ?? baseline.happy, baseline.happy, 0.08),
    sad: toward(currentState.sad ?? baseline.sad, baseline.sad, 0.08),
    angry: toward(currentState.angry ?? baseline.angry, baseline.angry, 0.08),
    romantic: toward(currentState.romantic ?? baseline.romantic, baseline.romantic, 0.08),
  };

  const nextState = applyEmotionDelta(decayed, deltas);
  const positiveHits = countMatches(normalized, POSITIVE_WORDS);
  const negativeHits = countMatches(normalized, NEGATIVE_WORDS);
  const affectionHits = countMatches(normalized, AFFECTION_WORDS);
  const trustHits = countMatches(normalized, TRUST_WORDS);
  const sentimentScore = clamp(50 + positiveHits * 8 - negativeHits * 9);

  const emotionalInsights = {
    valence: clamp(Math.round(toward(currentInsights.valence ?? 60, sentimentScore, 0.35))),
    arousal: clamp(
      Math.round(toward(currentInsights.arousal ?? 50, clamp(35 + intensityBoost + Math.abs(positiveHits - negativeHits) * 7), 0.3))
    ),
    stability: clamp(Math.round(toward(currentInsights.stability ?? 70, clamp(100 - Math.abs(50 - sentimentScore)), 0.25))),
  };

  const affectionScore = clamp(
    Math.round(toward(currentRelationship.affectionScore ?? 35, clamp(30 + affectionHits * 12 + nextState.romantic * 0.4), 0.28))
  );
  const trustScore = clamp(
    Math.round(toward(currentRelationship.trustScore ?? 40, clamp(35 + trustHits * 12 + emotionalInsights.stability * 0.35), 0.25))
  );
  const affectionStreak = affectionHits > 0 ? (currentRelationship.affectionStreak ?? 0) + 1 : 0;
  const level = clamp(Math.round(1 + (affectionScore + trustScore) / 22));

  return {
    emotionState: nextState,
    dominantEmotion: getDominantEmotion(nextState),
    emotionalInsights,
    relationship: {
      level,
      affectionScore,
      trustScore,
      affectionStreak,
    },
  };
};

module.exports = { analyzeEmotionShift, getDominantEmotion };
