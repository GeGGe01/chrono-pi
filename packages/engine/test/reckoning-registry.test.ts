import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearReckonings,
  listReckonings,
  reckoningsFor,
  registerReckoning,
} from '../src/reckonings/registry';
import type { Reckoning } from '../src/types';

const stub: Reckoning = {
  id: 'stub-mm-dd-yy',
  calendarId: 'gregorian',
  tier: 'canonical',
  minDepth: 5,
  timeExtends: false,
  read: () => ({ digits: '31415', label: 'stub' }),
};

describe('reckoning registry', () => {
  beforeEach(() => {
    clearReckonings();
  });

  it('starts empty', () => {
    expect(listReckonings()).toEqual([]);
  });

  it('lists a registered reckoning', () => {
    registerReckoning(stub);
    expect(listReckonings()).toContain(stub);
  });

  it('returns only the reckonings for a given calendar', () => {
    registerReckoning(stub);
    registerReckoning({ ...stub, id: 'other', calendarId: 'julian' });
    expect(reckoningsFor('gregorian')).toEqual([stub]);
  });
});
