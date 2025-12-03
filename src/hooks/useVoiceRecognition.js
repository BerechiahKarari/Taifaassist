import { useState, useRef, useCallback } from 'react';

export const useVoiceRecognition = () => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onResultCallback = useRef(null);

  const start = useCallback((language = 'en-US', onResult) => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported in your browser");
      return false;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      onResultCallback.current = onResult;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResultCallback.current) {
          onResultCallback.current(transcript);
        }
        recognitionRef.current = null;
        setListening(false);
      };

      recognition.onerror = (event) => {
        setError(`Voice recognition error: ${event.error}`);
        setListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to start voice recognition");
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      recognitionRef.current = null;
    }
  }, []);

  const retry = useCallback((language, onResult) => {
    stop();
    setTimeout(() => start(language, onResult), 500);
  }, [start, stop]);

  return { listening, error, start, stop, retry, recognitionRef };
};
