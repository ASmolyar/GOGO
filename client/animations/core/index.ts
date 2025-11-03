/**
 * Core animations API
 * Re-exports animation functionality from animejs
 */
export { animate, stagger, createTimeline, createAnimatable } from 'animejs';

// Type definitions for animations
export type AnimatableElement =
  | HTMLElement
  | SVGElement
  | null
  | (HTMLElement | SVGElement)[];

export interface AnimationParams {
  [key: string]: any;
}

export interface AnimationInstance {
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (progress: number) => void;
  finished?: Promise<any>;
}

// Add a type for Animatable
export interface Animatable {
  play: () => void;
  pause: () => void;
  restart: () => void;
}
