"use client";

import { useState, useEffect } from "react";
import "./Timer-style.css";
import { motion } from "framer-motion";
import { p } from "framer-motion/client";

interface CountdownCircleProps {
  timeLeft: number;
  timerIsActive: boolean;
  toggleTimer: () => void;
  onComplete: () => void;
  phase : number;
}

export default function CountdownCircle({
  timeLeft,
  timerIsActive,
  toggleTimer,
  onComplete,
  phase,
}: CountdownCircleProps) {
  const workTime = 5 ;
  const restTime = 4;
  const radius = 133;
  const circumference = 2 * Math.PI * radius;
  const size = 320;

  const progress = (timeLeft / (phase)) * circumference;

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  return (
    <div className="timer-button">
      <div className="timer">
        <svg width={String(size)} height={String(size)}>
          <circle
            cx={String(size / 2)}
            cy={String(size / 2)}
            r={radius}
            stroke="#625050"
            strokeWidth="20"
            fill="none"
          />
          <motion.circle
            cx={String(size / 2)}
            cy={String(size / 2)}
            r={radius}
            stroke="#AF9D9D"
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="butt"
            transform={`rotate(-90 ${String(size / 2)} ${String(size / 2)})`}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </svg>
        <div className="text">
          <h1>{Math.floor(timeLeft / 60)}</h1>
          <p>{String(timeLeft % 60).padStart(2, "0")}</p>
        </div>
      </div>
    </div>
  );
}
