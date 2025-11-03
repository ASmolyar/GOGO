# Animation System Migration Guide

This guide will help you migrate from the old animation system to the new unified animation API in the GOGO application.

## Overview of the New System

The animation system has been reorganized for better maintainability, performance, and developer experience. The new architecture includes:

- **Core Layer**: Type-safe wrappers around anime.js
- **Preset Layer**: Commonly used animations
- **App-Specific Layer**: GOGO-specific animations
- **React Integration**: Hooks for using animations in React components

## Migration Steps

### Step 1: Update Imports

Replace imports from the old animation system with the new unified API:

```typescript
// OLD
import { animate, stagger, animations } from '../../utils/animeWrapper';

// NEW
import {
  animate,
  stagger,
  fadeIn,
  slideInUp,
  // other specific functions as needed
} from '../../animations';
```

### Step 2: Replace `animations` Object References

Replace any usage of the `animations` object with direct function calls:

```typescript
// OLD
animations.fadeIn(element, { duration: 800 });

// NEW
fadeIn(element, { duration: 800 });

// OLD
animations.staggerSlideIn(elements, { delay: stagger(100) });

// NEW
staggerSlideIn(elements, { delay: stagger(100) });
```

### Step 3: Use React Hooks for Component Animations

Replace imperative animation calls in React components with hooks:

```typescript
// OLD
useEffect(() => {
  if (elementRef.current) {
    animate({
      targets: elementRef.current,
      opacity: [0, 1],
      duration: 600,
    });
  }
}, []);

// NEW (with useAnimateOnMount)
const [elementRef, controls] = useAnimateOnMount((element) => ({
  opacity: [0, 1],
  duration: 600,
}));

// NEW (with useAnimation)
const elementRef = useRef(null);
const animation = useAnimation(
  {
    targets: elementRef.current,
    opacity: [0, 1],
    duration: 600,
  },
  [elementRef.current],
);

useEffect(() => {
  if (elementRef.current) {
    animation.play();
  }
}, [animation]);
```

### Step 4: Use Timeline for Sequenced Animations

Use the timeline API for more complex animation sequences:

```typescript
// OLD
animate({
  targets: elementRef.current,
  opacity: [0, 1],
  duration: 600,
}).then(() => {
  animate({
    targets: secondElementRef.current,
    translateY: [50, 0],
    duration: 400,
  });
});

// NEW
const sequence = timeline();
sequence.add({
  targets: elementRef.current,
  opacity: [0, 1],
  duration: 600,
});
sequence.add(
  {
    targets: secondElementRef.current,
    translateY: [50, 0],
    duration: 400,
  },
  '-=200',
); // Overlap with previous animation
```

## Available Animation Presets

### Basic Animations

- `fadeIn` / `fadeOut`: Fade elements in or out
- `slideInUp` / `slideInDown`: Slide from bottom or top
- `slideInLeft` / `slideInRight`: Slide from left or right
- `scaleIn`: Scale up with fade
- `pulse`: Create a pulsing effect
- `staggerFadeIn`: Fade in multiple elements with staggered timing
- `staggerSlideIn`: Slide in multiple elements with staggered timing

### Application-Specific Animations

- `pageEnter` / `pageExit`: Animations for page transitions
- `cardsEnter`: Animate a grid of cards
- `albumCoverEnter`: Animation for album covers
- `albumInfoEnter`: Animation for album info sections
- `trackListEnter`: Animation for track lists
- `cardHover`: Hover effect for cards
- `loading`: Loading animation

## React Hooks

- `useAnimation`: Create and manage an animation instance
- `useAnimateOnMount`: Automatically animate an element when it mounts

## Examples

### Simple Element Animation

```tsx
import { fadeIn } from '../../animations';

const MyComponent = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      fadeIn(elementRef.current);
    }
  }, []);

  return <div ref={elementRef}>Animated content</div>;
};
```

### Using Animation Hooks

```tsx
import { useAnimateOnMount } from '../../animations';

const MyComponent = () => {
  const [elementRef, controls] = useAnimateOnMount((element) => ({
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
  }));

  return (
    <>
      <div ref={elementRef}>Animated content</div>
      <button onClick={() => controls.play()}>Replay animation</button>
    </>
  );
};
```

## Need Help?

If you have any questions or need assistance migrating your animations, please contact the frontend team for support.
