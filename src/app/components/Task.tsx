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
  const t = useTranslations('');

  return !finished ? (
    <form
      onSubmit={handleButtonClick}
      className={`task-container ${inputTask ? "task-input-container" : ""}`}
    >
      {inputTask ? (
        <input
          type="text"
          value={textValue}
          readOnly={!inputTask}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder= {t('create_task')}
        />
      ) : (
        <p>{taskName}</p>
      )}
      <div className="round-button" onClick={handleButtonClick}>
        {inputTask ? "+" : "✓"}
      </div>
    </form>
  ) : (
    <div
      onSubmit={handleButtonClick}
      className={`task-container task-finished-container`}
    >
      <p>{taskName}</p>
      <div className="round-button" onClick={handleButtonClick}>
        {"⨯"}
      </div>
    </div>
  );
};

export default Task;
