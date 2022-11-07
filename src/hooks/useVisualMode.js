import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    if (replace) {
      let newHist = [...history];
      newHist.pop();
      newHist.push(newMode);
      setMode(prev => newHist[newHist.length - 1]);
      return setHistory(prev => newHist);
    }
    setMode(newMode);
    let newHist = [...history, newMode];
    setHistory(prev => newHist);
  };

  function back() {
    let backHistory = [...history];
    if (backHistory.length > 1) {
      backHistory.pop();
      setMode(backHistory[(backHistory.length - 1)]);
    }
    setHistory(prev => backHistory);
  }

  return { mode, transition, back };
}