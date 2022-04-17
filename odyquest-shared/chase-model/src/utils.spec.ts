import { createUniqueId } from './utils';

describe('Utils', () => {
  beforeEach(() => {
  });

  it('should create unique ids', () => {
    let ids: string[] = [];
    ids.push(createUniqueId(ids));
    expect(ids.includes(createUniqueId(ids))).toBeFalsy();
  });
});
