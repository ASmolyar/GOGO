/**
 * GOGO Application-specific animations
 * Implements animations for specific app components
 */
import { animate, stagger } from 'animejs';
import { AnimatableElement, AnimationParams, AnimationInstance } from '../core';
import { fadeIn, slideInUp, slideInRight, scaleIn } from './basic';

/**
 * Helper to safely cast Element to HTMLElement for anime.js
 */
function asHTMLElement(element: Element | null): HTMLElement | null {
  return element instanceof HTMLElement ? element : null;
}

/**
 * Helper to safely cast Element[] to HTMLElement[]
 */
function asHTMLElements(elements: Element[] | null): HTMLElement[] {
  return (
    elements?.filter((el): el is HTMLElement => el instanceof HTMLElement) || []
  );
}

/**
 * Page enter animation
 */
export function pageEnter(
  container: Element | null,
): AnimationInstance | null | undefined {
  if (!container) {
    console.warn('pageEnter animation called with null container');
    return undefined;
  }

  const htmlElement = asHTMLElement(container);
  if (htmlElement) {
    return slideInUp(htmlElement, {
      duration: 600,
      easing: 'easeOutCubic',
    });
  }
  return undefined;
}

/**
 * Page exit animation
 */
export function pageExit(container: Element | null): Promise<any> {
  if (!container) {
    console.warn('pageExit animation called with null container');
    return Promise.resolve();
  }

  const htmlElement = asHTMLElement(container);
  if (htmlElement) {
    animate(htmlElement, {
      opacity: [1, 0],
      translateY: [0, -20],
      easing: 'easeInCubic',
      duration: 400,
    });

    // Wait for the animation to complete
    return new Promise((resolve) => setTimeout(resolve, 400));
  }
  return Promise.resolve();
}

/**
 * Cards grid enter animation
 */
export function cardsEnter(
  cards: Element[] | null,
): AnimationInstance | undefined {
  if (!cards || cards.length === 0) {
    console.warn('cardsEnter animation called with null or empty cards array');
    return undefined;
  }

  const htmlElements = asHTMLElements(cards);
  if (htmlElements.length > 0) {
    return animate(htmlElements, {
      translateY: [20, 0],
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      delay: stagger(40),
      easing: 'easeOutCubic',
    });
  }
  return undefined;
}

/**
 * Album cover enter animation
 */
export function albumCoverEnter(
  cover: Element | null,
): AnimationInstance | null | undefined {
  if (!cover) {
    console.warn('albumCoverEnter animation called with null cover');
    return undefined;
  }

  const htmlElement = asHTMLElement(cover);
  if (htmlElement) {
    return scaleIn(htmlElement, {
      duration: 600,
      easing: 'easeOutCubic',
    });
  }
  return undefined;
}

/**
 * Album info enter animation
 */
export function albumInfoEnter(
  info: Element | null,
  titleElement: Element | null,
): void {
  if (!info) {
    console.warn('albumInfoEnter animation called with null info');
    return;
  }

  const htmlInfo = asHTMLElement(info);
  if (htmlInfo) {
    slideInRight(htmlInfo, {
      duration: 600,
    });
  }

  if (!titleElement) {
    console.warn('albumInfoEnter animation called with null titleElement');
    return;
  }

  const htmlTitle = asHTMLElement(titleElement);
  if (htmlTitle) {
    slideInUp(htmlTitle, {
      duration: 600,
      delay: 200,
    });
  }
}

/**
 * Track list enter animation
 */
export function trackListEnter(
  tracks: Element[] | null,
): AnimationInstance | undefined {
  if (!tracks || tracks.length === 0) {
    console.warn(
      'trackListEnter animation called with null or empty tracks array',
    );
    return undefined;
  }

  const htmlElements = asHTMLElements(tracks);
  if (htmlElements.length > 0) {
    return animate(htmlElements, {
      translateX: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      delay: stagger(50, { start: 300 }),
      easing: 'easeOutCubic',
    });
  }
  return undefined;
}

/**
 * Card hover animation
 */
export function cardHover(
  card: Element | null,
  entering: boolean,
): AnimationInstance | undefined {
  if (!card) {
    console.warn('cardHover animation called with null card');
    return undefined;
  }

  const htmlElement = asHTMLElement(card);
  if (htmlElement) {
    return animate(htmlElement, {
      scale: entering ? [1, 1.05] : [1.05, 1],
      boxShadow: entering
        ? ['0 4px 10px rgba(0,0,0,0.1)', '0 10px 20px rgba(0,0,0,0.15)']
        : ['0 10px 20px rgba(0,0,0,0.15)', '0 4px 10px rgba(0,0,0,0.1)'],
      duration: 250,
      easing: 'easeOutQuad',
    });
  }
  return undefined;
}

/**
 * Loading animation
 */
export function loading(element: Element | null): {
  play: () => void;
  pause: () => void;
} {
  if (!element) {
    console.warn('loading animation called with null element');
    return {
      pause: () => {
        /* intentionally empty */
      },
      play: () => {
        /* intentionally empty */
      },
    };
  }

  const htmlElement = asHTMLElement(element);
  if (htmlElement) {
    const animation = animate(htmlElement, {
      opacity: [0.2, 1],
      scale: [0.9, 1],
      easing: 'easeInOutQuad',
      duration: 800,
      direction: 'alternate',
      loop: true,
    });

    return {
      pause() {
        animation.pause();
      },
      play() {
        animation.play();
      },
    };
  }

  return {
    pause: () => {
      /* intentionally empty */
    },
    play: () => {
      /* intentionally empty */
    },
  };
}
