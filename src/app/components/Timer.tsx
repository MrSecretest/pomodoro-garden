"use client";

import { useState, useEffect } from "react";
import "./Timer-style.css";
import { motion } from "framer-motion";
import { style } from "framer-motion/client";

interface CountdownCircleProps {
  timeLeft: number;
  timerIsActive: boolean;
  toggleTimer: () => void;
  onComplete: () => void;
  phase: number;
}

export default function CountdownCircle({
  timeLeft,
  timerIsActive,
  toggleTimer,
  onComplete,
  phase,
}: CountdownCircleProps) {
  const workTime = 1500;
  const restTime = 300;

  const [timerSize, setTimerSize] = useState(200);

  useEffect(() => {
    const updateSize = () => {
      const newSize = Math.min(300, Math.max(200, window.innerWidth * 0.5));
      setTimerSize(newSize);
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const radius = timerSize * 0.415;
  const strokeWidth = timerSize * 0.0625;
  const fontSize = timerSize * 0.3;
  const circumference = 2 * Math.PI * radius;

  const progress = (timeLeft / phase) * circumference;

  return (
    <div
      style={{
        height: "350px",
        width: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ width: timerSize, height: timerSize }}
        className={`timer ${phase == restTime ? "rest-bg" : "work-bg"}`}
      >
        <div className="text">
          <h1 style={{ fontSize: fontSize }}>{Math.floor(timeLeft / 60)}</h1>
          <p style={{ fontSize: fontSize / 1.7 }}>
            {String(timeLeft % 60).padStart(2, "0")}
          </p>
        </div>
        <svg width={timerSize} height={timerSize}>
          <circle
            cx={timerSize / 2}
            cy={timerSize / 2}
            r={radius}
            stroke="#625050"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={timerSize / 2}
            cy={timerSize / 2}
            r={radius}
            stroke="#AF9D9D"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="butt"
            transform={`rotate(-90 ${timerSize / 2} ${timerSize / 2})`}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 0.2, ease: "circOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
