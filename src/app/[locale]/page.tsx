"use client";

import { useState, useEffect, createRef } from "react";
import "../home.css";
import Image from "next/image";
import CountdownCircle from ".././components/Timer";
import Task from "../components/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import Plant, { PlantRef } from "../components/Plant";
import React from "react";
import { useTranslations } from "next-intl";
import RoundButton from "../components/Round-Button";
import LanguageDropdown from "../components/Language-selector";

export default function Home() {
  const [currentTask, setCurrentTask] = useState<string[]>([]);
  const [finishedTask, setFinishedTask] = useState<string[]>([]);
  const [currentlyGathered, setCurrentlyGathered] = useState(0);
  const workTime = 1500;
  const restTime = 300;
  const [currentPhase, setCurrentPhase] = useState(workTime);
  const [timeLeft, setTimeLeft] = useState(currentPhase);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);
  const [audio, setAudio] = useState(true);
  const [plantsAmount, setPlantsAmount] = useState(1);
  const [tasksDone, setTasksDone] = useState<string | null>(null);
  const [ketchupsMade, setKetchupsMade] = useState<string | null>(null);
  const [workPhasesDone, setWorkPhasesDone] = useState<string | null>(null);
  const [restPhasesDone, setRestPhasesDone] = useState<string | null>(null);

  const [statsShow, setStatsShow] = useState(false);
  const [infoShow, setInfoShow] = useState(false);

  const plantRefs = Array.from({ length: 4 }, () => createRef<PlantRef>());
  const [windowWidth, setWindowWidth] = useState<number>(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
      const currentFinishedWorks = parseInt(workPhasesDone || "0");
      const newFinishedWorks = currentFinishedWorks + 1;
      setWorkPhasesDone(newFinishedWorks.toString());

      localStorage.setItem("workPhasesDone", newFinishedWorks.toString());
    } else {
      const currentFinishedRests = parseInt(restPhasesDone || "0");
      const newFinishedRests = currentFinishedRests + 1;
      setRestPhasesDone(newFinishedRests.toString());

      localStorage.setItem("restPhasesDone", newFinishedRests.toString());
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
      const currentFinishedTask = parseInt(tasksDone || "0");
      const newFinishedTask = currentFinishedTask + 1;
      setTasksDone(newFinishedTask.toString());

      localStorage.setItem("tasksDone", newFinishedTask.toString());
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

    const currentKetchupsMade = parseInt(ketchupsMade || "0");
    const newKetchupsMade = currentKetchupsMade + 1;
    setKetchupsMade(newKetchupsMade.toString());

    localStorage.setItem("ketchupsMade", newKetchupsMade.toString());
  };

  const toggleTimer = () => {
    setTimerIsActive((prev) => !prev);
  };

  const toggleStats = () => {
    setStatsShow((prev) => !prev);
  };

  const toggleInfo = () => {
    setInfoShow((prev) => !prev);
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
  }, [
    audio,
    currentPhase,
    handleGrowTomato,
    onComplete,
    timerIsActive,
    timeLeft,
  ]);
  const t = useTranslations("");

  useEffect(() => {
    setTasksDone(localStorage.getItem("tasksDone") ?? "0");
    setKetchupsMade(localStorage.getItem("ketchupsMade") ?? "0");
    setWorkPhasesDone(localStorage.getItem("workPhasesDone") ?? "0");
    setRestPhasesDone(localStorage.getItem("restPhasesDone") ?? "0");
  }, []);

  return (
    <>
      <head>
        <meta
          name="google-site-verification"
          content="8CXgFntaN4mZ5prWxiD90nML_uYVgro_Sz4yyPAXJ48"
        />
        <meta name="google-adsense-account" content="ca-pub-5003635462439536" />
      </head>
      <body>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5003635462439536"
          crossOrigin="anonymous"
        ></script>
      </body>
      <div className="home-page-bg">
        <div className="info-toggle">
          <RoundButton buttonFunc={toggleInfo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </RoundButton>
        </div>
        <div className="statistic-toggle">
          <RoundButton buttonFunc={toggleStats}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M160-160v-320h160v320H160Zm240 0v-640h160v640H400Zm240 0v-440h160v440H640Z" />
            </svg>
          </RoundButton>
        </div>

        <div className="language-toggle">
          <LanguageDropdown></LanguageDropdown>
        </div>
        <AnimatePresence>
          {statsShow ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="stats-container"
            >
              <h1>{t("stats")}</h1>
              <p className="stat-name"> {t("tasks_done")}</p>
              <p className="stat">{`${tasksDone == null ? "0" : tasksDone}`}</p>
              <p className="stat-name">{t("ketchups_made")}</p>

              <p className="stat">{`${ketchupsMade == null ? "0" : ketchupsMade}`}</p>
              <p className="stat-name">{t("work_phases_completed")}</p>

              <p className="stat">{`${workPhasesDone == null ? "0" : workPhasesDone}`}</p>
              <p className="stat-name">{t("rest_phases_completed")}</p>

              <p className="stat">{`${restPhasesDone == null ? "0" : restPhasesDone}`}</p>
              <RoundButton buttonFunc={toggleStats}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </RoundButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {infoShow ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="stats-container"
            >
              <h1>{t("made by Oleh Kulys")}</h1>
              <p className="stat-name">attribution</p>
              <a
                href="https://www.flaticon.com/free-icons/tomato"
                title="tomato icons"
              >
                Tomato icons created by Vectoricons - Flaticon
              </a>
              <a
                href="https://www.flaticon.com/free-icons/tomato"
                title="tomato icons"
              >
                Tomato icons created by Pixelmeetup - Flaticon
              </a>{" "}
              <a
                href="https://www.flaticon.com/free-icons/flower-pot"
                title="flower pot icons"
              >
                Flower pot icons created by Yogi Aprelliyanto - Flaticon
              </a>
              <a href="https://github.com/google/material-design-icons">
                Icons by Google (Material Icons) — Licensed under Apache License
                2.0
              </a>
              <RoundButton buttonFunc={toggleInfo}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </RoundButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
        <div className="box-expl">
          <div className="box"></div>
          <p>
            {t("grow_work")}{" "}
            <span style={{ color: "#ee4744" }}>{t("work")}</span>{" "}
            {t("collect_break")}{" "}
            <span style={{ color: "#ee4744" }}>{t("break")}</span>
          </p>
          {windowWidth <= 1200 && (
            <p style={{ paddingTop: "10px" }}>{t("swipe_to_switch")}</p>
          )}
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
                <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
              >
                <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
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
    </>
  );
}
