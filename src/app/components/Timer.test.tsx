import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Timer from "./Timer";
import React, { useState } from "react";

describe("Timer", () => {
  const mockWorkPhase = 1500;
  const mockRestPhase = 300;

  it("Timer exist", () => {
    render(<Timer phase={mockWorkPhase} timeLeft={mockWorkPhase} />);
    expect(screen.getByTestId("timer")).toBeInTheDocument;
  });
  it("renders time correctly", () => {
    render(<Timer phase={mockWorkPhase} timeLeft={mockWorkPhase} />);
    expect(screen.getByTestId("timer")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("00")).toBeInTheDocument();
  });
  it("applies 'rest-bg' class correctly", () => {
    render(<Timer phase={mockRestPhase} timeLeft={mockRestPhase} />);
    const timer = screen.getByTestId("timer").firstChild as HTMLElement;
    expect(timer).toHaveClass("rest-bg");
  });
  it("applies 'work-bg' class correctly", () => {
    render(<Timer phase={mockWorkPhase} timeLeft={mockWorkPhase} />);
    const timer = screen.getByTestId("timer").firstChild as HTMLElement;
    expect(timer).toHaveClass("work-bg");
  });
});
