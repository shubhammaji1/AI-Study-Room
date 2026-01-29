import { createContext, useState, useEffect } from "react";

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  // Initialize state from LocalStorage to persist data on refresh
  const [sessionTime, setSessionTime] = useState(
    parseInt(localStorage.getItem("studyTime")) || 0
  );
  
  const [isStudying, setIsStudying] = useState(
    localStorage.getItem("isStudying") === "true"
  );

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isStudying) {
      timer = setInterval(() => {
        setSessionTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("studyTime", newTime); // Save progress
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStudying]);

  // Start a new session (Resets timer)
  const startSession = () => {
    setIsStudying(true);
    setSessionTime(0);
    localStorage.setItem("isStudying", "true");
    localStorage.setItem("studyTime", "0");
  };

  // Stop session (Does not reset timer, allows saving in Tracker)
  const stopSession = () => {
    setIsStudying(false);
    localStorage.removeItem("isStudying");
    localStorage.removeItem("studyTime");
  };

  return (
    <StudyContext.Provider value={{ sessionTime, isStudying, startSession, stopSession }}>
      {children}
    </StudyContext.Provider>
  );
};

export default StudyContext;