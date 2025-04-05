"use client";
import { motion } from "motion/react";
import RoundButton from "./Round-Button";
import "./WelcomePopUp.css";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface WelcomePopUpProps {
  smallScreen: boolean;
}

export default function WelcomePopup({ smallScreen }: WelcomePopUpProps) {
  const [showPopup, setShowPopup] = useState(false);
  const t = useTranslations("");

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasVisited", "true");
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="modal-container"
    >
      <div className="popup-container">
        <h2>{t("welcome_msg")}</h2>
        <p>{t("watch_grow")}</p>
        <p className="tutorial-info">{t("each_completed")}</p>
        {smallScreen ? (
          <p className="tutorial-info">{t("swipe_switch")}</p>
        ) : null}

        <RoundButton buttonFunc={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </RoundButton>
      </div>
    </motion.div>
  );
}
