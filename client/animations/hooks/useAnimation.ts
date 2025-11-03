/**
 * React hooks for animations
 * Provides React integration for the animation system
 */
import { useRef, useEffect, useCallback, useState } from 'react';
import { animate } from 'animejs';
import { AnimatableElement, AnimationParams, AnimationInstance } from '../core';

/**
 * Hook to create and manage an animation
 * @param animationParams Animation parameters to use
 * @param deps Dependencies array for when to recreate the animation
 * @returns Object with animation controls
 */
export function useAnimation(
  targetElement: AnimatableElement,
  animationParams: AnimationParams,
  deps: React.DependencyList = [],
) {
  // Store the animation instance
  const animationRef = useRef<AnimationInstance | null>(null);
  // Store the animation targets
  const [targets, setTargets] = useState<AnimatableElement>(targetElement);

  // Create or recreate the animation when dependencies change
  useEffect(() => {
    // Clean up previous animation
    if (animationRef.current) {
      // No explicit destroy method needed, so we just dereference
      animationRef.current = null;
    }

    if (!targetElement) {
      return;
    }

    try {
      // Create the animation with autoplay disabled by default
      const params = {
        autoplay: false,
        ...animationParams,
      };

      animationRef.current = animate(
        targetElement,
        params,
      ) as unknown as AnimationInstance;
      // Update targets when animation is created
      setTargets(targetElement);
    } catch (error) {
      console.error('Error creating animation:', error);
    }

    // Clean up on unmount
    return () => {
      animationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetElement, ...deps]);

  // Update targets when targetElement changes
  useEffect(() => {
    setTargets(targetElement);
  }, [targetElement]);

  // Convenience methods to control the animation
  const play = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  const restart = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.restart();
    }
  }, []);

  const seek = useCallback((progress: number) => {
    if (animationRef.current) {
      animationRef.current.seek(progress);
    }
  }, []);

  // Return the animation controls with extended interface
  return {
    play,
    pause,
    restart,
    seek,
    // Return the ref in case advanced usage is needed
    animationRef,
    // These properties are added to our extended interface
    targets,
    setTargets: (newTargets: AnimatableElement) => {
      setTargets(newTargets);
    },
  };
}

/**
 * Hook for creating animations on element mount
 * @param getAnimationParams Function to create animation parameters based on the element
 * @param autoplay Whether to play the animation automatically on mount
 * @returns [ref, controls] - Ref to attach to the element and animation controls
 */
export function useAnimateOnMount<T extends Element>(
  getAnimationParams: (element: T) => AnimationParams,
  autoplay = true,
) {
  const elementRef = useRef<T | null>(null);
  const animationRef = useRef<AnimationInstance | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      try {
        const params = getAnimationParams(elementRef.current);
        const animationInstance = animate(
          elementRef.current,
          params,
        ) as unknown as AnimationInstance;

        animationRef.current = animationInstance;
      } catch (error) {
        console.error('Error creating animation on mount:', error);
      }
    }

    return () => {
      animationRef.current = null;
    };
  }, [autoplay, getAnimationParams]);

  const play = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  }, []);

  return [elementRef, { play, pause }] as const;
}
