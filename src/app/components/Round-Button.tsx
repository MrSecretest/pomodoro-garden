import React from 'react';
import "./Buttons-style.css"

interface RoundButtonProps {
  children: React.ReactNode;
  buttonFunc?: () => void,
  big? : boolean
}

function RoundButton({big, children, buttonFunc }: RoundButtonProps) {
  return (
    <div className={`round-button ${big? 'round-button-big' : ''}`} onClick={buttonFunc}>
      {children}
    </div>
  );
}

export default RoundButton;