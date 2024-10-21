export const utter = ({text, voiceIndex, onStart, onEnd}: {text: string, voiceIndex: number, onStart: () => void | null, onEnd: () => void | null}) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.onstart = onStart
  utterance.lang = "en-GB"
  utterance.voice = window.speechSynthesis.getVoices()[voiceIndex]
  window.speechSynthesis.speak(utterance)
  utterance.onend = onEnd
}

export const cancelUtter = () => {
  window.speechSynthesis.cancel()
}
