// The digits of π with no decimal point: the leading 3 followed by the fractional digits,
// long enough to cover the deepest reckoning a perfect day can reach.
export const PI_DIGITS =
  '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';

// Length of the common leading prefix shared by `digits` and π — the depth to which the string reads π.
export function matchDepth(digits: string): number {
  const limit = Math.min(digits.length, PI_DIGITS.length);
  let depth = 0;
  while (depth < limit && digits[depth] === PI_DIGITS[depth]) {
    depth += 1;
  }
  return depth;
}
