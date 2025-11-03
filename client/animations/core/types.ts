/**
 * Core animation types
 * TypeScript interfaces for CSS animations
 */

// Element types that can be animated
export type AnimatableElement =
  | HTMLElement
  | SVGElement
  | NodeListOf<HTMLElement | SVGElement>
  | HTMLElement[]
  | SVGElement[]
  | Element
  | Element[]
  | NodeListOf<Element>
  | string // CSS selector
  | null;

// Function for calculating delays in staggered animations
export type DelayFunction = (
  el: Element,
  index: number,
  total: number,
) => number;

// Animation callback function
export type AnimationCallback = (anim: AnimationInstance) => void;

// Animation parameters
export interface AnimationParams {
  targets?: AnimatableElement;
  duration?: number;
  delay?: number | DelayFunction;
  endDelay?: number;
  easing?: string;
  round?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  loop?: number | boolean;
  autoplay?: boolean;

  // Callbacks
  begin?: AnimationCallback;
  complete?: AnimationCallback;
  update?: AnimationCallback;
  loopBegin?: AnimationCallback;
  loopComplete?: AnimationCallback;
  changeBegin?: AnimationCallback;
  changeComplete?: AnimationCallback;

  // Allow any property for animations (translateX, opacity, etc.)
  [property: string]: any;
}

// Animation instance
export interface AnimationInstance {
  play: () => AnimationInstance;
  pause: () => AnimationInstance;
  restart: () => AnimationInstance;
  seek: (time: number) => AnimationInstance;
  reverse: () => AnimationInstance;
  finished: Promise<any>;
  // Add targets property for support
  targets?: AnimatableElement;
}

// Timeline interface
export interface Timeline extends AnimationInstance {
  add: (
    animation: AnimationParams | AnimationCallback,
    timeOffset?: number | string,
  ) => Timeline;
}

// Timeline creation parameters
export interface TimelineParams {
  direction?: string;
  loop?: boolean | number;
  autoplay?: boolean;
  [property: string]: any;
}

// Path animation types
export interface PathOptions {
  el?: SVGPathElement;
  d?: string;
  begin?: number;
  end?: number;
  [key: string]: any;
}

export interface Path {
  el: SVGPathElement;
  [key: string]: any;
}

export type PathFunction = (prop: string) => Path;
