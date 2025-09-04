import "./Buttons-style.css";
interface ButtonProps {
  buttonText: string;
  buttonFunc?: () => void;
}
export default function Button({ buttonText, buttonFunc }: ButtonProps) {
  return (
    <>
      <div
        data-testid="button"
        className="button-container"
        onClick={buttonFunc}
      >
        <p data-testid="button-text">{buttonText}</p>
      </div>
    </>
  );
}
