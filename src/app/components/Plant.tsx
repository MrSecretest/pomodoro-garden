"use client";

import PlantImg from "../../media/plant.png";
import TomatoPNG from "../../media/tomato.png";
import React, { useImperativeHandle, useState } from "react";
import Image from "next/image";
import "./Plant.css";
import { AnimatePresence, motion } from "framer-motion";

interface PlantProps {
  addTomato: () => void;
  ref?: React.Ref<PlantRef>;
  pickable: boolean;
  delay: number;
  paused: boolean;
}

export interface PlantRef {
  growTomato: () => void;
}

function Plant({paused, delay, pickable, addTomato, ref }: PlantProps) {
  const [tomatoes, setTomatoes] = useState<boolean[]>(new Array(3).fill(false));

  const growTomato = () => {
    const newTomatoes = [...tomatoes];
    const availableIndexes = newTomatoes
      .map((value, index) => (value === false ? index : -1))
      .filter((index) => index !== -1);
    if (availableIndexes.length > 0) {
      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      newTomatoes[randomIndex] = true;
      setTomatoes(newTomatoes);
    }
  };

  useImperativeHandle(ref, () => ({
    growTomato,
  }));
  
  const tomatoesPos = [
    { left: "20px", top: "5px" },
    { left: "60px", top: "7px" },
    { left: "65px", top: "40px" },
  ];
  const removeTomato = (index: number) => {
    setTomatoes((prevTomatoes) => {
      const newTomatoes = [...prevTomatoes];
      newTomatoes[index] = false;
      return newTomatoes;
    });
    addTomato();
  };

  return (
    <motion.div
      animate={(!pickable && paused)? { y: [-5, 5, -5] } : {}}
      transition={{
        delay: delay,
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      className="plant-container"
      
    >
      <div className="plant">
        <Image src={PlantImg} width={129} alt="image of plant" />
      </div>
      <AnimatePresence>
        {tomatoes.map(
          (tomato, index) =>
            tomato && (
              <motion.div
                initial={{ scale: 0, y: -30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                onClick={pickable ? () => removeTomato(index) : undefined}
                className={`tomato ${pickable ? "ready" : "not_ready"}`}
                key={index}
                style={tomatoesPos[index]}
              >
                <Image src={TomatoPNG} width={43} alt="image of a tomato" />
              </motion.div>
            ),
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Plant;
