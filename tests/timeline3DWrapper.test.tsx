// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

let mockWebGLSupported = true;
let mockMediaQuery: (query: string) => boolean = () => false;

vi.mock("../src/hooks/useMediaQuery", () => ({
  useMediaQuery: (query: string) => mockMediaQuery(query),
}));

vi.mock("../src/utils/webgl", () => ({
  get WEB_GL_SUPPORTED() {
    return mockWebGLSupported;
  },
}));

vi.mock("../src/components/3d/Timeline3D", () => ({
  default: ({ qualityProfile }: { qualityProfile: string }) => (
    <div data-testid="timeline3d-mock">{qualityProfile}</div>
  ),
}));

import { Timeline3DWrapper } from "../src/components/3d/Timeline3DWrapper";

const baseProps = {
  events: [],
  range: { start: 0, end: 10 },
  focusValue: 5,
  onExitTo2D: vi.fn(),
  onFocusValueChange: vi.fn(),
};

afterEach(() => {
  cleanup();
  mockWebGLSupported = true;
  mockMediaQuery = () => false;
});

describe("Timeline3DWrapper", () => {
  it("passes the resolved low-power profile to the lazy 3D scene when mobile constraints are active", async () => {
    mockMediaQuery = (query: string) => query === "(max-width:719px)";

    render(<Timeline3DWrapper {...baseProps} />);

    expect((await screen.findByTestId("timeline3d-mock")).textContent).toBe("low-power");
  });

  it("renders the explicit WebGL fallback when 3D is unavailable", () => {
    mockWebGLSupported = false;

    render(<Timeline3DWrapper {...baseProps} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(/webgl is not available in this browser/i)).toBeTruthy();
  });

  it("does not mount the WebGL scene for an invalid range", () => {
    render(<Timeline3DWrapper {...baseProps} range={{ start: 10, end: 10 }} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(/date range cannot be rendered in 3d/i)).toBeTruthy();
    expect(screen.queryByTestId("timeline3d-mock")).toBeNull();
  });
});




