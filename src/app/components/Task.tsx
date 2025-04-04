import React, { useEffect, useState } from "react";
import "./Task-style.css";
import "./Buttons-style.css";
import { useTranslations } from "next-intl";

interface TaskProps {
  inputTask: boolean;
  taskName?: string;
  func?: (task: string) => void;
  finished?: boolean;
}

const Task = ({
  inputTask,
  taskName = "",
  finished = false,
  func,
}: TaskProps) => {
  const [textValue, setTextValue] = useState("");

  const handleButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (func && textValue) {
      func(textValue);
      setTextValue("");
    }
  };

  useEffect(() => {
    setTextValue(taskName);
  }, [taskName]);
  const t = useTranslations("");

  return !finished ? (
    <form
      onSubmit={handleButtonClick}
      className={`task-container ${inputTask ? "task-input-container" : ""}`}
    >
      {inputTask ? (
        <input
          type="text"
          maxLength={30}
          value={textValue}
          readOnly={!inputTask}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={t("create_task")}
        />
      ) : (
        <p>{taskName}</p>
      )}
      <div className="round-button" onClick={handleButtonClick}>
        {inputTask ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
          >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        )}
      </div>
    </form>
  ) : (
    <div
      onSubmit={handleButtonClick}
      className={`task-container task-finished-container`}
    >
      <p>{taskName}</p>
      <div className="round-button" onClick={handleButtonClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
    </div>
  );
};

export default Task;
