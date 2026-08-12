import {
  clamp,
  generateTicks,
  isValidRange,
  type Range,
  type TimelineTick,
} from "../../utils/scaleTransform";
import {
  LANE_META,
  type DetailPanelItem,
  type TimelineEvent,
  type TimelineLane,
} from "../timeline/types";
import { TIMELINE_LANE_ORDER } from "./buildTimelineScene";
import { buildTimelineSingleEventDescriptor } from "./interaction";
import { normalizeTimelineEvents } from "./normalizeTimelineEvents";

export const TIMELINE_3D_AXIS_MIN_X = -10;
export const TIMELINE_3D_AXIS_MAX_X = 10;
export const TIMELINE_3D_LANE_OFFSET_Y = 0.5;
export const TIMELINE_3D_COLLISION_GAP_X = 0.48;
export const TIMELINE_3D_STACK_OFFSET_Y = 0.34;
const TIMELINE_3D_STACK_OFFSET_Z = 0.14;
export const TIMELINE_3D_LANE_Y: Record<TimelineLane, number> = {
  personal: 1.85,
  global: -1.85,
};

export type Timeline3DSceneLane = {
  lane: TimelineLane;
  label: string;
  axisY: number;
};

export type Timeline3DSceneTick = TimelineTick & {
  x: number;
};

export type Timeline3DSceneMarker = {
  id: string;
  value: number;
  lane: TimelineLane;
  x: number;
  axisY: number;
  y: number;
  z: number;
  stackLevel: number;
  title: string;
  color: string;
  ariaLabel: string;
  semanticLabel: string;
  metaLabels: string[];
  selectionKey: string;
  detailItems: DetailPanelItem[];
  semanticKind?: TimelineEvent["semanticKind"];
  markerShape: NonNullable<TimelineEvent["markerShape"]>;
};

export type Timeline3DScene = {
  range: Range;
  focusValue: number;
  focusX: number;
  lanes: Timeline3DSceneLane[];
  ticks: Timeline3DSceneTick[];
  markers: Timeline3DSceneMarker[];
};

export type BuildTimeline3DSceneOptions = {
  events: TimelineEvent[];
  range: Range;
  focusValue: number;
  maxTickCount?: number;
};

const normalizeTimeline3DLane = (event: TimelineEvent): TimelineLane =>
  (event.lane ?? "personal") === "global" ? "global" : "personal";

export const toTimeline3DX = (value: number, range: Range): number => {
  if (!isValidRange(range) || !Number.isFinite(value)) return 0;

  const ratio = clamp((value - range.start) / (range.end - range.start), 0, 1);
  return TIMELINE_3D_AXIS_MIN_X + ratio * (TIMELINE_3D_AXIS_MAX_X - TIMELINE_3D_AXIS_MIN_X);
};

const buildTimeline3DTicks = (range: Range, maxTickCount: number): Timeline3DSceneTick[] => {
  const ticks = generateTicks(range, "linear");
  if (ticks.length === 0) return [];

  const safeMaxTickCount = Math.max(1, Math.floor(maxTickCount));
  const visibleTicks = ticks.length <= safeMaxTickCount
    ? ticks
    : ticks.filter((_, index) => {
      const step = Math.ceil(ticks.length / safeMaxTickCount);
      return index % step === 0 || index === ticks.length - 1;
    });

  return visibleTicks.map(tick => ({
    ...tick,
    x: toTimeline3DX(tick.value, range),
  }));
};

export const buildTimeline3DScene = ({
  events,
  range,
  focusValue,
  maxTickCount = 10,
}: BuildTimeline3DSceneOptions): Timeline3DScene => {
  const rangeIsValid = isValidRange(range);
  const safeFocusValue = rangeIsValid
    ? clamp(Number.isFinite(focusValue) ? focusValue : range.start, range.start, range.end)
    : range.start;

  const lanes = TIMELINE_LANE_ORDER.map(lane => ({
    lane,
    label: LANE_META[lane].label,
    axisY: TIMELINE_3D_LANE_Y[lane],
  }));

  const lastXByStack = new Map<string, number[]>();
  const markers = normalizeTimelineEvents(events)
    .filter(event => rangeIsValid && event.value >= range.start && event.value <= range.end)
    .sort((a, b) => a.value - b.value)
    .map(event => {
      const lane = normalizeTimeline3DLane(event);
      const axisY = TIMELINE_3D_LANE_Y[lane];
      const placement = event.placement === "below" ? "below" : "above";
      const direction = placement === "below" ? -1 : 1;
      const x = toTimeline3DX(event.value, range);
      const stackKey = `${lane}:${placement}`;
      const stackLastX = lastXByStack.get(stackKey) ?? [];
      let stackLevel = stackLastX.findIndex(lastX => x - lastX >= TIMELINE_3D_COLLISION_GAP_X);
      if (stackLevel < 0) stackLevel = stackLastX.length;
      stackLastX[stackLevel] = x;
      lastXByStack.set(stackKey, stackLastX);

      const y = axisY + direction * (
        TIMELINE_3D_LANE_OFFSET_Y + stackLevel * TIMELINE_3D_STACK_OFFSET_Y
      );
      const z = stackLevel === 0
        ? 0
        : (stackLevel % 2 === 1 ? 1 : -1) * Math.ceil(stackLevel / 2) * TIMELINE_3D_STACK_OFFSET_Z;
      const descriptor = buildTimelineSingleEventDescriptor(event);

      return {
        id: descriptor.id,
        value: event.value,
        lane,
        x,
        axisY,
        y,
        z,
        stackLevel,
        title: descriptor.title,
        color: descriptor.color,
        ariaLabel: descriptor.ariaLabel,
        semanticLabel: descriptor.semanticLabel,
        metaLabels: descriptor.metaLabels,
        selectionKey: descriptor.selectionKey,
        detailItems: descriptor.detailItems,
        semanticKind: descriptor.semanticKind,
        markerShape: descriptor.markerShape,
      } satisfies Timeline3DSceneMarker;
    });

  return {
    range,
    focusValue: safeFocusValue,
    focusX: toTimeline3DX(safeFocusValue, range),
    lanes,
    ticks: rangeIsValid ? buildTimeline3DTicks(range, maxTickCount) : [],
    markers,
  };
};

