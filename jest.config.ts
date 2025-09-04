// jest.config.ts
import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.(css|scss|sass|png|jpg|jpeg|svg)$": "jest-transform-stub",
  },
  moduleNameMapper: {
    "^.+\\.module\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  clearMocks: true,
};

export default createJestConfig(customJestConfig);
