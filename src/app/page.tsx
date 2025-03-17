"use client";

import { useState, useEffect } from "react";
import "./home.css";
import TomatoPNG from "../media/tomato.png";
import Image from "next/image";
import CountdownCircle from "./components/Timer";
import Button from "./components/Button";
import Task from "./components/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import Plant from "./components/Plant";

export default function Home() {
  const [currentTask, setCurrentTask] = useState<string[]>([]);
  const [finishedTask, setFinishedTask] = useState<string[]>([]);
  const [currentlyGathered, setCurrentlyGathered] = useState(0);
  const workTime = 5;
  const restTime = 4;
  const [currentPhase, setCurrentPhase] = useState(workTime); 
  const [timeLeft, setTimeLeft] = useState(currentPhase); 
  const [timerIsActive, setTimerIsActive] = useState(false);

  const onComplete = () => {
    const nextPhase = currentPhase === workTime ? restTime : workTime; 
    setCurrentPhase(nextPhase);
    setTimeLeft(nextPhase); 
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

    if (timerIsActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup the interval
    };
  }, [timerIsActive, timeLeft]);

  return (
    <div className="home-page-bg">
      <div className="title-score">
        <div className="logo-title">
          <Image src={TomatoPNG} alt="image of a tomato" width={43} />
          <h1>pomodoro-garden</h1>
        </div>
        <p>
          currently gathered:
          <span> {currentlyGathered} </span>
          <Image src={TomatoPNG} alt="image of a tomato" width={24} />
        </p>
      </div>
      <div className="ad-expl">
        <div className="ad-box1"></div>
        <p>grow tomatoes while working collect them while taking a break</p>
      </div>
      <div className="horizontal-container">
        <div className="tasks">
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
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
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
        <div className="finished-tasks">
          <Reorder.Group
            axis="y"
            values={finishedTask}
            onReorder={() => {}}
            className="created-tasks"
          >
            <AnimatePresence>
              {finishedTask.map((task) => (
                <Reorder.Item
                  key={task}
                  value={task}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
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
          buttonText={timerIsActive ? "pause" : "resume"} // Button text changes when timer finishes
          buttonFunc={toggleTimer}
        />
      <div>
        <Plant addTomato={addTomato} />
        <Plant addTomato={addTomato} />
        <Plant addTomato={addTomato} />
        <Plant addTomato={addTomato} />
      </div>
    </div>
  );
}
