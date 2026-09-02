export interface ReplayProgress {
  currentLayer: number | null;
  completedThrough: number;
  completedCount: number;
  isIdle: boolean;
  isComplete: boolean;
  isPaused: boolean;
}

export function getReplayProgress(
  currentPosition: number,
  isPlaying: boolean,
): ReplayProgress {
  const boundedPosition = Math.max(0, Math.min(18, Math.trunc(currentPosition)));
  const isIdle = boundedPosition === 0;
  const isComplete = boundedPosition === 18 && !isPlaying;
  const currentLayer = isIdle ? null : boundedPosition;
  const completedThrough = isIdle
    ? 0
    : isComplete
      ? 18
      : Math.max(0, boundedPosition - 1);

  return {
    currentLayer,
    completedThrough,
    completedCount: completedThrough,
    isIdle,
    isComplete,
    isPaused: !isIdle && !isComplete && !isPlaying,
  };
}
