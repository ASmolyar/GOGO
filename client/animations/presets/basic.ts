/**
 * Basic animations
 * Provides common animation presets
 */
import { animate, stagger } from 'animejs';

/**
 * Basic animation presets
 * Common animations for opacity, movement, and scaling
 */
import { AnimatableElement, AnimationParams, AnimationInstance } from '../core';

/**
 * Fade in animation
 */
export function fadeIn(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Fade out animation
 */
export function fadeOut(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    opacity: [1, 0],
    duration: 400,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Slide in from bottom animation
 */
export function slideInUp(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Slide in from top animation
 */
export function slideInDown(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Slide in from left animation
 */
export function slideInLeft(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Slide in from right animation
 */
export function slideInRight(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    translateX: [50, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Scale up animation
 */
export function scaleIn(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Pulse animation (for attention)
 */
export function pulse(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    scale: [1, 1.05, 1],
    duration: 600,
    easing: 'easeInOutQuad',
    ...options,
  });
}

/**
 * Staggered fade in for multiple elements
 */
export function staggerFadeIn(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    opacity: [0, 1],
    duration: 600,
    delay: stagger(100),
    easing: 'easeOutCubic',
    ...options,
  });
}

/**
 * Staggered slide in from bottom for multiple elements
 */
export function staggerSlideIn(
  targets: AnimatableElement,
  options: Partial<AnimationParams> = {},
): AnimationInstance | null {
  if (!targets) return null;

  return animate(targets, {
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    delay: stagger(80),
    easing: 'easeOutCubic',
    ...options,
  });
}
