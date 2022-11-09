import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    if (replace) {
      setMode(prev => newMode);
      return setHistory(prev => [...prev.slice(0, -1), newMode]);
    }
    setMode(prev => newMode);
    setHistory(prev => [...prev, newMode]);

  };

  function back() {
    if (history.length > 1) {
      setHistory(prev => {
        setMode(prev[prev.length - 2]);
        return [...prev.slice(0, -1)];
      });
    }
  }

  return { mode, transition, back };
}