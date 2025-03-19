"use client";

import { useState, useEffect, useRef, createRef } from "react";
import "./home.css";
import TomatoPNG from "../media/tomato.png";
import TomatoSlice from "../media/tomato-slice.png"
import Image from "next/image";
import CountdownCircle from "./components/Timer";
import Button from "./components/Button";
import Task from "./components/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import Plant, { PlantRef } from "./components/Plant";
import React from "react";

export default function Home() {
  const [currentTask, setCurrentTask] = useState<string[]>([]);
  const [finishedTask, setFinishedTask] = useState<string[]>([]);
  const [currentlyGathered, setCurrentlyGathered] = useState(0);
  const workTime = 5;
  const restTime = 4;
  const [currentPhase, setCurrentPhase] = useState(workTime);
  const [timeLeft, setTimeLeft] = useState(currentPhase);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);

  const [plantsAmount, setPlantsAmount] = useState(1);

  const plantRefs = Array.from({ length: 4 }, () => createRef<PlantRef>());

  const addPlant = () => {
    setPlantsAmount((prev) => (prev === 4 ? 1 : prev + 1));
  };

  const handleGrowTomato = () => {
    if (isGrowing) return;
    setIsGrowing(true);
    plantRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.growTomato();
      }
    });
    setTimeout(() => setIsGrowing(false), 100);
  };

  const onComplete = () => {
    const nextPhase = currentPhase === workTime ? restTime : workTime;
    setCurrentPhase(nextPhase);
    console.log(currentPhase);
    setTimeLeft(nextPhase);
    if (currentPhase == restTime) {
      addPlant();
    }
  };

  const onAdd = (task: string) => {
    if (!currentTask.includes(task) && !finishedTask.includes(task)) {
      setCurrentTask((prevTasks) => [task, ...prevTasks]);
    }
  };

  const onRemove = (task: string) => {
    const index = currentTask.indexOf(task);
    currentTask.splice(index, 1);
    onFinish(task);
  };

  const onFinish = (task: string) => {
    if (!finishedTask.includes(task)) {
      setFinishedTask((prevTasks) => [task, ...prevTasks]);
    }
  };

  const removeFinish = (task: string) => {
    setFinishedTask((prevTasks) => prevTasks.filter((t) => t !== task));
  };

  const addTomato = () => {
    setCurrentlyGathered(currentlyGathered + 1);
  };

  const toggleTimer = () => {
    setTimerIsActive((prev) => !prev);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      (timeLeft == Math.floor(currentPhase * 0.25) &&
        currentPhase == workTime) ||
      (timeLeft == Math.floor(currentPhase * 0.5) &&
        currentPhase == workTime) ||
      (timeLeft == Math.floor(currentPhase * 0.75) && currentPhase == workTime)
    ) {
      handleGrowTomato();
    }

    if (timerIsActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsActive, timeLeft]);

  return (
    <div className="home-page-bg">
      <div className="half-circle-top">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: "100%", width: "100%", transform: "scale(1, -1)" }}
        >
          <path
            d="M4.80,148.53 C183.68,-35.02 316.31,-28.11 499.72,156.42 L497.45,155.44 L7.05,148.53 Z"
            style={{ stroke: "none", fill: "#1b0808" }}
          ></path>
        </svg>
      </div>{" "}
      <div className="title-score">
        <div className="logo-title">
          <Image src={TomatoPNG} alt="image of a tomato" width={43} />
          <h1>pomodoro-garden</h1>
        </div>
        <motion.p
          style={{ fontWeight: "bold" }}
          key={currentlyGathered}
          initial={{ scale: 0 }}
          animate={{ scale: [1.8, 1] }}
          className="tooltip"
        >
          <span className="tooltiptext">how much ketchups made</span>
          <span>{currentlyGathered}&nbsp; </span>
          <Image src={TomatoSlice} alt="image of a tomato" width={28} />
        </motion.p>
      </div>
      <div className="ad-expl">
        <div className="ad-box1"></div>
        <p>
          grow tomatoes while <span style={{ color: "#ee4744" }}>working</span>{" "}
          collect them while taking a{" "}
          <span style={{ color: "#ee4744" }}>break</span>
        </p>
      </div>
      <div className="horizontal-container">
        <div className="tasks">
          <p>tasks</p>
          <Task inputTask={true} func={(value: string) => onAdd(value)} />
          <Reorder.Group
            axis="y"
            values={currentTask}
            onReorder={setCurrentTask}
            className="created-tasks"
          >
            <AnimatePresence>
              {currentTask.map((task, index) => (
                <Reorder.Item
                  key={task}
                  value={task}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <div>
                    <Task
                      inputTask={false}
                      taskName={task}
                      func={(value: string) => onRemove(value)}
                    />
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
        <CountdownCircle
          phase={currentPhase}
          timeLeft={timeLeft}
          timerIsActive={timerIsActive}
          toggleTimer={toggleTimer}
          onComplete={onComplete}
        />
        <div className="tasks">
          <p>finished tasks</p>
          <Reorder.Group
            axis="y"
            values={finishedTask}
            onReorder={() => {}}
            className="finished-tasks"
          >
            <AnimatePresence>
              {finishedTask.map((task) => (
                <Reorder.Item
                  key={task}
                  value={task}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <div>
                    <Task
                      finished
                      inputTask={false}
                      taskName={task}
                      func={(value: string) => removeFinish(value)}
                    />
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      </div>
      <Button
        buttonText={timerIsActive ? "pause" : "resume"}
        buttonFunc={toggleTimer}
      />
      <div className="half-circle-bottom">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: "100%", width: "100%" }}
        >
          <path
            d="M4.80,148.53 C183.68,-35.02 316.31,-28.11 499.72,156.42 L497.45,155.44 L7.05,148.53 Z"
            style={{ stroke: "none", fill: "#1b0808" }}
          ></path>
        </svg>
      </div>
      <div className="plants-bottom">
        {Array.from({ length: plantsAmount }).map((_, index) => (
          <Plant
            paused={timerIsActive}
            key={index}
            ref={plantRefs[index]} // Ensure ref is correctly assigned
            addTomato={addTomato}
            pickable={currentPhase == restTime}
            delay={0.2 * index}
          />
        ))}
      </div>
      ;
    </div>
  );
}
