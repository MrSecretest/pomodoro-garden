"use client";

import { useState, useEffect, useRef, createRef } from "react";
import "../home.css";
import Image from "next/image";
import CountdownCircle from ".././components/Timer";
import Button from "../components/Button";
import Task from "../components/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import Plant, { PlantRef } from "../components/Plant";
import React from "react";
import { useTranslations } from "next-intl";
import LanguageSelector from "../components/Language-selector";
import RoundButton from "../components/Round-Button";

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
  const [audio, setAudio] = useState(true);
  const [plantsAmount, setPlantsAmount] = useState(1);
  const [tasksDone, setTasksDone] = useState(0);
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

  const toggleAudio = () => {
    setAudio((prevAudio) => !audio);
  };

  const removeFinish = (task: string) => {
    setFinishedTask((prevTasks) => prevTasks.filter((t) => t !== task));
  };

  const addTomato = () => {
    if (audio) {
      const audio = new Audio("/tomato.wav");
      audio.playbackRate = Math.random() * (1.2 - 0.5) + 0.5;
      audio.volume = 0.1;
      audio.play();
    }
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
      if (audio) {
        const audio = new Audio("/timer.mp3");
        audio.volume = 0.3;
        audio.play();
      }
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsActive, timeLeft]);
  const t = useTranslations("");
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
      </div>
      <div className="title-score">
        <div className="logo-title">
          <Image
            src="/tomato.png"
            height={43}
            alt="Tomato growing in the Pomodoro Garden app"
            width={43}
          />
          <h1>{t("title")}</h1>
        </div>
        <motion.p
          style={{ fontWeight: "bold" }}
          key={currentlyGathered}
          initial={{ scale: 0 }}
          animate={{ scale: [1.8, 1] }}
          className="tooltip"
        >
          <span className="tooltiptext">{t("tooltip_text")}</span>
          <span>{currentlyGathered}&nbsp; </span>
          <Image
            src="/tomato-slice.png"
            alt="Tomato ketchup made from collected tomatoes in the Pomodoro Garden app"
            width={28}
            height={28}
          />
        </motion.p>
      </div>
      <div className="ad-expl">
        <div className="ad-box1"></div>
        <p>
          {t("grow_work")} <span style={{ color: "#ee4744" }}>{t("work")}</span>{" "}
          {t("collect_break")}{" "}
          <span style={{ color: "#ee4744" }}>{t("break")}</span>
        </p>
      </div>

      <div className="horizontal-container">
        <div className="tasks">
          <p>{t("tasks")}</p>
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
          <p>{t("finished_tasks")}</p>
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
      <div className="round-buttons-wrapper">
        <RoundButton buttonFunc={toggleAudio}>
          {audio ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
            >
              <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
            >
              <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
            </svg>
          )}
        </RoundButton>
        <RoundButton buttonFunc={toggleTimer} big>
          {timerIsActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
            >
              <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
            >
              <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
            </svg>
          )}
        </RoundButton>
        <RoundButton buttonFunc={onComplete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
          >
            <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
          </svg>
        </RoundButton>
      </div>
      <div className="plants-bottom">
        <div className="plant-container-wrapper">
          {Array.from({ length: plantsAmount }).map((_, index) => (
            <Plant
              paused={timerIsActive}
              key={index}
              ref={plantRefs[index]}
              addTomato={addTomato}
              pickable={currentPhase == restTime}
              delay={0.2 * index}
            />
          ))}
        </div>
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
    </div>
  );
}
