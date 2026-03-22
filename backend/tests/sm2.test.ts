import { describe, it, expect } from 'vitest';
import { sm2Update, accuracyToQuality } from '../src/services/sm2.service';

// Base card for tests
const baseCard = {
  conceptId: '4.5.05',
  userId: 'test-user-1',
  n: 0,
  EF: 2.5,
  interval: 1,
  nextReviewDate: new Date(),
  qualityHistory: [] as number[],
};

// ─── SM-2 Algorithm — Wozniak 1987 ───────────────────────────────────────────

describe('SM-2 algorithm — Wozniak 1987', () => {

  it('quality < 3 resets n and interval to initial values', () => {
    const card = { ...baseCard, n: 5, interval: 21 };
    const updated = sm2Update(card, 2);
    expect(updated.n).toBe(0);
    expect(updated.interval).toBe(1);
  });

  it('quality < 3 also resets when n = 0', () => {
    const updated = sm2Update(baseCard, 0);
    expect(updated.n).toBe(0);
    expect(updated.interval).toBe(1);
  });

  it('first successful repetition (n=0, q=5) sets interval=1 and n=1', () => {
    const updated = sm2Update(baseCard, 5);
    expect(updated.n).toBe(1);
    expect(updated.interval).toBe(1);
  });

  it('second successful repetition (n=1, q=5) sets interval=6', () => {
    const card = { ...baseCard, n: 1, interval: 1 };
    const updated = sm2Update(card, 5);
    expect(updated.n).toBe(2);
    expect(updated.interval).toBe(6);
  });

  it('third successful repetition (n=2) sets interval = round(6 * EF)', () => {
    const card = { ...baseCard, n: 2, interval: 6, EF: 2.5 };
    const updated = sm2Update(card, 5);
    expect(updated.n).toBe(3);
    expect(updated.interval).toBe(Math.round(6 * 2.5)); // 15
  });

  it('interval grows by EF factor after n > 1', () => {
    const card = { ...baseCard, n: 2, interval: 6, EF: 2.5 };
    const updated = sm2Update(card, 5);
    expect(updated.interval).toBe(Math.round(6 * 2.5)); // 15
  });

  it('EF floor is 1.3 — never drops below', () => {
    let card = { ...baseCard, EF: 1.35 };
    card = sm2Update(card, 0);
    expect(card.EF).toBeGreaterThanOrEqual(1.3);
  });

  it('EF floor applies even after multiple quality=0 updates', () => {
    let card = { ...baseCard };
    for (let i = 0; i < 10; i++) {
      card = sm2Update(card, 0);
    }
    expect(card.EF).toBeGreaterThanOrEqual(1.3);
  });

  it('EF formula is exact: EF + (0.1 - (5-q)*(0.08+(5-q)*0.02))', () => {
    const q = 4;
    const expectedEF = 2.5 + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    const updated = sm2Update(baseCard, q);
    expect(updated.EF).toBeCloseTo(expectedEF, 10);
  });

  it('EF formula for q=5 increases EF by 0.1', () => {
    const updated = sm2Update(baseCard, 5);
    expect(updated.EF).toBeCloseTo(2.5 + 0.1, 10); // 2.6
  });

  it('EF formula for q=3 leaves EF almost unchanged', () => {
    // q=3: EF + (0.1 - 2*(0.08 + 2*0.02)) = EF + 0.1 - 0.24 = EF - 0.14
    const updated = sm2Update(baseCard, 3);
    const expected = 2.5 + (0.1 - 2 * (0.08 + 2 * 0.02));
    expect(updated.EF).toBeCloseTo(expected, 10);
  });

  it('quality history is appended correctly', () => {
    let card = { ...baseCard };
    card = sm2Update(card, 5);
    card = sm2Update(card, 3);
    card = sm2Update(card, 1);
    expect(card.qualityHistory).toEqual([5, 3, 1]);
  });

  it('nextReviewDate is in the future after a successful review', () => {
    const before = new Date();
    const updated = sm2Update({ ...baseCard, n: 2, interval: 6, EF: 2.5 }, 5);
    expect(updated.nextReviewDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('nextReviewDate is exactly interval days ahead (±1 second tolerance)', () => {
    const card = { ...baseCard, n: 1, interval: 1 };
    const before = Date.now();
    const updated = sm2Update(card, 5); // interval becomes 6
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 6);
    const diffMs = Math.abs(updated.nextReviewDate.getTime() - expectedDate.getTime());
    expect(diffMs).toBeLessThan(2000); // within 2 seconds
  });

  it('quality=2 (failure) does NOT change EF compared to q=0', () => {
    const r0 = sm2Update({ ...baseCard, EF: 2.5 }, 0);
    const r2 = sm2Update({ ...baseCard, EF: 2.5 }, 2);
    // Both are failures (quality < 3) but EF changes differently
    // q=0: EF + (0.1 - 5*(0.08 + 5*0.02)) = 2.5 + 0.1 - 0.9 = 1.7 but floored at 1.3
    // q=2: EF + (0.1 - 3*(0.08 + 3*0.02)) = 2.5 + 0.1 - 0.42 = 2.18
    expect(r0.EF).not.toBe(r2.EF);
  });

  it('throws if quality is not an integer in [0,5]', () => {
    expect(() => sm2Update(baseCard, -1)).toThrow();
    expect(() => sm2Update(baseCard, 6)).toThrow();
    expect(() => sm2Update(baseCard, 2.5)).toThrow();
  });

  it('quality=3 is the minimum passing grade (n increments)', () => {
    const updated = sm2Update(baseCard, 3);
    expect(updated.n).toBe(1); // success
  });

  it('quality=2 is a failure (n resets)', () => {
    const card = { ...baseCard, n: 5, interval: 21 };
    const updated = sm2Update(card, 2);
    expect(updated.n).toBe(0); // failure
  });
});

// ─── accuracyToQuality mapping ────────────────────────────────────────────────

describe('accuracyToQuality', () => {
  it('100% accuracy → quality 5', () => {
    expect(accuracyToQuality(1.0)).toBe(5);
  });

  it('90% accuracy → quality 5', () => {
    expect(accuracyToQuality(0.9)).toBe(5);
  });

  it('75% accuracy → quality 4', () => {
    expect(accuracyToQuality(0.75)).toBe(4);
  });

  it('60% accuracy → quality 3 (minimum passing)', () => {
    expect(accuracyToQuality(0.6)).toBe(3);
  });

  it('40% accuracy → quality 2 (failure)', () => {
    expect(accuracyToQuality(0.4)).toBe(2);
  });

  it('0% accuracy → quality 0 (total blackout)', () => {
    expect(accuracyToQuality(0)).toBe(0);
  });

  it('clamps values above 1.0', () => {
    expect(accuracyToQuality(1.5)).toBe(5);
  });

  it('clamps values below 0', () => {
    expect(accuracyToQuality(-0.1)).toBe(0);
  });
});
