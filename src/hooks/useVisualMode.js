import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode) {
    setMode(prev => newMode);
    history.push(newMode);
  };

  function back() {
    let backHistory = [...history]
    if (backHistory.length > 1) {
    backHistory.pop()
    setMode(prev => backHistory[(backHistory.length - 1)])
    }
    setHistory(prev => backHistory)
  }

  return { mode, transition, back };
}