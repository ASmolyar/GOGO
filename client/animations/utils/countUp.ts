import { animate } from 'animejs';

interface CountUpOptions {
  duration?: number;
  easing?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (value: number) => string;
}

/**
 * Animate a number from 0 (or a start) to an end value and write into element textContent
 */
export function countUp(
  element: Element | null,
  endValue: number,
  options: CountUpOptions = {},
): void {
  if (!element) return;
  const {
    duration = 1200,
    easing = 'easeOutExpo',
    prefix = '',
    suffix = '',
    decimals = 0,
    formatter,
  } = options;

  const obj = { value: 0 };
  const format = (v: number) => {
    const fixed = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return formatter ? formatter(Number(fixed)) : fixed;
  };

  animate(obj, {
    value: [0, endValue],
    duration,
    easing,
    update: () => {
      const text = `${prefix}${format(obj.value)}${suffix}`;
      (element as HTMLElement).textContent = text;
    },
  });
}

export function parseNumericWithSuffix(raw: string): {
  numeric: number | null;
  suffix: string;
} {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d+)([kK%+]*)$/);
  if (!match) return { numeric: null, suffix: '' };
  let value = Number(match[1]);
  const suffix = match[2] || '';
  if (/k/i.test(suffix)) value = value * 1000;
  return { numeric: value, suffix };
}
