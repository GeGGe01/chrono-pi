import { describe, expect, it } from 'vitest';

import { matchDepth } from '../src/pi';
import {
  mmddyy,
  unixTimestamp,
  yymdd,
  yyyymmdd,
} from '../src/reckonings/standard';

describe('standard reckonings', () => {
  it('mm-dd-yy reads 31415 for 2015-03-14 Gregorian, at depth 5', () => {
    const read = mmddyy.read({ year: 2015, month: 3, day: 14 }, 0);
    expect(read.digits).toBe('31415');
    expect(matchDepth(read.digits)).toBe(5);
  });

  it('yyyy-mm-dd reads 314159 for 3141-05-09, at depth 6', () => {
    const read = yyyymmdd.read({ year: 3141, month: 5, day: 9 }, 0);
    expect(read.digits).toBe('314159');
    expect(matchDepth(read.digits)).toBe(6);
  });

  it('yy-m-dd reads the inverted 31415 for 2031-04-15', () => {
    const read = yymdd.read({ year: 2031, month: 4, day: 15 }, 0);
    expect(read.digits).toBe('31415');
  });

  it('unix-timestamp renders the midnight second count', () => {
    const read = unixTimestamp.read({ year: 946684800, month: 1, day: 1 }, 0);
    expect(read.digits).toBe('946684800');
  });

  it('declares its qualifying floor and time extension', () => {
    expect(mmddyy.minDepth).toBe(5);
    expect(mmddyy.timeExtends).toBe(true);
    expect(unixTimestamp.minDepth).toBe(10);
  });
});
