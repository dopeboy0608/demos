/** 스피드업 남은 시간(초)을 1틱만큼 줄인다. 0 아래로 내려가지 않는다. */
export function tickSpeedSecondsLeft(
  secondsLeft: number,
  tickSeconds: number,
): number {
  return Math.max(0, secondsLeft - tickSeconds);
}
