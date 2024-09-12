import type { GridPosition } from './tabletop.types';

export function isPositiveInteger(n: number): boolean {
  return n > 0 && Number.isInteger(n);
}

export function isPositiveIntegerOrZero(n: number): boolean {
  return n >= 0 && Number.isInteger(n);
}

export function isWithinGrid(position: GridPosition, width: number, height: number): boolean {
  // Is position positive integers?
  if (!isPositiveIntegerOrZero(position.x) || !isPositiveIntegerOrZero(position.y)) {
    return false;
  }
  // Is position within the grid dimensions?
  if (position.x >= width || position.y >= height) {
    return false;
  }
  return true;
}
