import { useState } from "react";

export default function useVisualMode(initial) {

  // Visual mode state and history

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // transition function goes to a new mode and puts the mode at the end of the history array. if replace = true, it replaces current mode's place in history array.

  const transition = function(newMode, replace = false) {
    if (replace) {
      setMode(prev => newMode);
      return setHistory(prev => [...prev.slice(0, -1), newMode]);
    }
    setMode(prev => newMode);
    setHistory(prev => [...prev, newMode]);

  };

  // back function removes current mode from end of history array and returns to previous mode

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