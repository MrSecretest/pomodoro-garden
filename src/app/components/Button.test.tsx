import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";
import React from "react";

describe(`Button`, () => {
  const mockText = "Hello!";

  it("Renders the button", () => {
    render(<Button buttonText={mockText} />);
    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
  });
  it("Renders the button's text", () => {
    render(<Button buttonText={mockText} />);
    const para = screen.getByTestId("button-text");
    expect(para).toHaveTextContent(mockText);
  });
  it("Executes the function", () => {
    const mockFunction = jest.fn();

    render(<Button buttonText="Mock me!" buttonFunc={mockFunction} />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockFunction).toHaveBeenCalled();
  });
});
