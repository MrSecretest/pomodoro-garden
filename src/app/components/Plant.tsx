"use client";

import PlantImg from "../../media/plant.png";
import TomatoPNG from "../../media/tomato.png";
import React, { useState } from "react";
import Image from "next/image";
import "./Plant.css";

interface PlantProps {
  addTomato : () => void;
}

function Plant({addTomato} : PlantProps) {
  const [tomatoes, setTomatoes] = useState<boolean[]>(new Array(3).fill(true));
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
    <div className="plant-container">
      <div className="plant">
        <Image src={PlantImg} width={129} alt="image of plant" />
      </div>
      {tomatoes.map(
        (tomato, index) =>
          tomato && (
            <div
              onClick={() => removeTomato(index)}
              className="tomato"
              key={index}
              style={tomatoesPos[index]}
            >
              <Image src={TomatoPNG} width={43} alt="image of a tomato" />
            </div>
          ),
      )}
    </div>
  );
}

export default Plant;
