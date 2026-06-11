// @vitest-environment jsdom
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Milestones from "../src/pages/Milestones";
import { BirthDateProvider } from "../src/context/BirthDateContext";
import { PreferencesProvider } from "../src/context/PreferencesContext";
import { UserProfileProvider } from "../src/context/UserProfileContext";

vi.mock("../src/hooks/useHistoricalEvents", () => ({
  useHistoricalEvents: () => ({ events: [], status: "success", error: null }),
}));

vi.mock("../src/hooks/useProjectedEvents", () => ({
  useProjectedEvents: () => ({ events: [], status: "success", error: null }),
}));

vi.mock("../src/hooks/useElementSize", () => ({
  useElementSize: () => [() => undefined, { width: 960, height: 360 }],
}));

vi.mock("../src/hooks/usePinchZoom", () => ({
  usePinchZoom: () => ({ showPinchHint: false }),
}));

vi.mock("../src/hooks/useMediaQuery", () => ({
  useMediaQuery: () => true,
}));

vi.mock("../src/utils/webgl", () => ({
  WEB_GL_SUPPORTED: false,
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    aside: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
      <aside {...props}>{children}</aside>
    ),
  },
}));

function renderMilestones() {
  return render(
    <BirthDateProvider>
      <PreferencesProvider>
        <UserProfileProvider>
          <MemoryRouter initialEntries={["/milestones"]}>
            <Routes>
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </MemoryRouter>
        </UserProfileProvider>
      </PreferencesProvider>
    </BirthDateProvider>,
  );
}

describe("Milestones lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    localStorage.setItem("dob", new Date(1994, 5, 12).toISOString());
    localStorage.setItem("dobTime", "08:30");
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => ({
        setTransform: vi.fn(),
        scale: vi.fn(),
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        fillText: vi.fn(),
        arc: vi.fn(),
        quadraticCurveTo: vi.fn(),
        closePath: vi.fn(),
        setLineDash: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.useRealTimers();
  });

  it("clears the perspective unlock toast timer on unmount", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const view = renderMilestones();

    fireEvent.click(screen.getByRole("tab", { name: /biological/i }));
    expect(screen.getByRole("status")).toBeTruthy();

    view.unmount();
    act(() => {
      vi.advanceTimersByTime(4_000);
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
