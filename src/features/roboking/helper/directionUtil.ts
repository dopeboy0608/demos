import type { RobotDirection } from './types';

const MOVABLE_DIRECTIONS: RobotDirection[] = ['left', 'right', 'up', 'down'];

/** `bed/Dog.as`의 `ArrayUtil.shuffle(_typeArr)[0]`과 동일하게 4방향 중 하나를 무작위로 고른다. */
export function pickRandomDirection(
  random: () => number = Math.random,
): RobotDirection {
  const index = Math.floor(random() * MOVABLE_DIRECTIONS.length);
  return MOVABLE_DIRECTIONS[Math.min(index, MOVABLE_DIRECTIONS.length - 1)];
}
