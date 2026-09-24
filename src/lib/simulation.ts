export const tickRate = 128;

export const trackedTicks = 16;

const prestrafeDuration = 1;

const hopDuration = 0.72;

const hopCount = 8;

const restDuration = 0.8;

export const cycleDuration =
  prestrafeDuration + hopDuration * hopCount + restDuration;

const nonPerfectHop = 5;

const crouchJumpHop = 0;

const jumpBugHop = 6;

const firstTickGainHop = 2;

const overlapHop = 4;

export type Buttons = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  duck: boolean;
};

export type MovementFrame = {
  speed: number;
  oldSpeed: number;
  takeoffSpeed: number;
  didTakeoff: boolean;
  didJump: boolean;
  jumpedRecently: boolean;
  onGround: boolean;
  buttons: Buttons;
  mouseX: number;
  didPerf: boolean;
  didJumpBug: boolean;
  didCrouchJump: boolean;
  firstTickGain: boolean;
  speedChanges: number[];
};

type Phase = {
  kind: "prestrafe" | "hop" | "rest";
  hop: number;
  elapsed: number;
};

const idleButtons: Buttons = {
  forward: false,
  back: false,
  left: false,
  right: false,
  duck: false,
};

function getPhase(time: number): Phase {
  const cycleTime = time % cycleDuration;

  if (cycleTime < prestrafeDuration) {
    return { kind: "prestrafe", hop: -1, elapsed: cycleTime };
  }

  const hopTime = cycleTime - prestrafeDuration;
  const hop = Math.floor(hopTime / hopDuration);

  if (hop >= hopCount) {
    const elapsed = hopTime - hopCount * hopDuration;

    return { kind: "rest", hop: hopCount, elapsed };
  }

  const elapsed = hopTime - hop * hopDuration;

  return { kind: "hop", hop, elapsed };
}

function getHopStartSpeed(hop: number): number {
  if (hop <= 0) {
    return 276;
  }

  const previousStart = getHopStartSpeed(hop - 1);
  const previousGain = getHopGain(hop - 1);
  const penalty = hop === nonPerfectHop ? 24 : 0;

  return previousStart + previousGain - penalty;
}

function getHopGain(hop: number) {
  const baseGain = 14 - hop * 0.9;

  return baseGain;
}

function getAirSpeed(hop: number, elapsed: number) {
  const start = getHopStartSpeed(hop);
  const gain = getHopGain(hop);
  const progress = elapsed / hopDuration;
  const switchDip = Math.max(0, 1 - Math.abs(progress - 0.5) * 20) * 2.5;
  const wobble = Math.sin(progress * Math.PI * 6) * 0.35;

  return start + gain * progress - switchDip + wobble;
}

function getSpeed(time: number) {
  const phase = getPhase(time);

  if (phase.kind === "prestrafe") {
    const progress = phase.elapsed / prestrafeDuration;
    const eased = 1 - (1 - progress) ** 2;

    return 250 + 26 * eased;
  }

  if (phase.kind === "hop") {
    return getAirSpeed(phase.hop, phase.elapsed);
  }

  const landingSpeed = getAirSpeed(hopCount - 1, hopDuration);
  const decay = Math.max(0, 1 - phase.elapsed / 0.25);

  return 250 + (landingSpeed - 250) * decay;
}

function getHopButtons(hop: number, elapsed: number): Buttons {
  const progress = elapsed / hopDuration;
  const isFirstHalf = progress < 0.5;
  const isOverlap = hop === overlapHop && Math.abs(progress - 0.5) < 0.04;
  const isCrouching = hop === crouchJumpHop && progress < 0.4;

  return {
    forward: false,
    back: false,
    left: isFirstHalf || isOverlap,
    right: !isFirstHalf || isOverlap,
    duck: isCrouching,
  };
}

function getButtons(phase: Phase): Buttons {
  if (phase.kind === "prestrafe") {
    return {
      ...idleButtons,
      forward: true,
      right: phase.elapsed > 0.2,
    };
  }

  if (phase.kind === "rest") {
    return idleButtons;
  }

  return getHopButtons(phase.hop, phase.elapsed);
}

function getMouseX(phase: Phase) {
  if (phase.kind === "prestrafe") {
    return phase.elapsed > 0.2 ? 1 : 0;
  }

  if (phase.kind === "rest") {
    return 0;
  }

  const progress = phase.elapsed / hopDuration;

  return progress < 0.5 ? -1 : 1;
}

function getSpeedChanges(time: number) {
  const tickDuration = 1 / tickRate;
  const offsets = Array.from({ length: trackedTicks }, (_, index) => index);

  const changes = offsets.map((offset) => {
    const current = getSpeed(time - offset * tickDuration);
    const previous = getSpeed(time - (offset + 1) * tickDuration);

    return current - previous;
  });

  return changes;
}

export function quantizeTime(time: number, updateSpeed: number) {
  const ticksPerUpdate = updateSpeed + 1;
  const tick = Math.floor(time * tickRate);
  const updateTick = tick - (tick % ticksPerUpdate);

  return updateTick / tickRate;
}

export function getFrame(time: number): MovementFrame {
  const phase = getPhase(time);
  const tickDuration = 1 / tickRate;
  const speed = getSpeed(time);
  const oldSpeed = getSpeed(time - tickDuration);
  const isHop = phase.kind === "hop";
  const hop = phase.hop;
  const takeoffSpeed = isHop ? getHopStartSpeed(hop) : 0;
  const jumpedRecently = isHop && phase.elapsed <= 0.1;
  const buttons = getButtons(phase);
  const mouseX = getMouseX(phase);
  const speedChanges = getSpeedChanges(time);

  return {
    speed,
    oldSpeed,
    takeoffSpeed,
    didTakeoff: isHop,
    didJump: isHop,
    jumpedRecently,
    onGround: !isHop,
    buttons,
    mouseX,
    didPerf: isHop && hop > 0 && hop !== nonPerfectHop && hop !== jumpBugHop,
    didJumpBug: isHop && hop === jumpBugHop,
    didCrouchJump: isHop && hop === crouchJumpHop,
    firstTickGain: isHop && hop === firstTickGainHop,
    speedChanges,
  };
}
