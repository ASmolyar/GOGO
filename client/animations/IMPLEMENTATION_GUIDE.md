# Animation System Implementation Guide

This document outlines the remaining steps needed to fully implement the new animation system in the GOGO application.

## Completed Steps

1. ✅ Created the new animation architecture

   - Core layer with types and anime.js wrappers
   - Preset animations for common use cases
   - Application-specific animations
   - React hooks for animation integration

2. ✅ Converted initial components
   - Updated HeroSection to use the new timeline API
   - Updated Modal to use the new useAnimation hook
   - Created migration guide for developers

## Remaining Tasks

1. **Update Remaining Components**

   - Update all components listed below to use the new animation system
   - Follow patterns shown in HeroSection.tsx and Modal.tsx as examples
   - Use the most appropriate approach for each component (hooks, presets, or core API)

2. **Remove Old Animation Files**

   - After all components are migrated, remove the following files:
     - `client/src/utils/animeWrapper.ts`
     - `client/src/utils/animations.ts`
     - `client/src/utils/animation.ts`
     - `client/src/utils/animationWrapper.ts`
     - `src/utils/animation.ts`
     - `src/utils/animations.ts`
     - `src/utils/animationWrapper.ts`

3. **Verify Type Safety**
   - Fix any type errors that arise during migration
   - Common issues include:
     - `Type 'HTMLElement | null' is not assignable to type 'AnimatableElement'`
     - `Property 'play' does not exist on type...`

## Components to Update

### Client-side Components

- `client/src/ImpactReport/components/ImpactSection.tsx`
- `client/src/ImpactReport/components/ProgramsSection.tsx`
- `client/src/ImpactReport/components/MusicLibrary.tsx`
- `client/src/ImpactReport/components/ArtisticDisciplinesSection.tsx`
- `client/src/ImpactReport/components/AchievementsSection.tsx`
- `client/src/ImpactReport/components/FutureVisionSection.tsx`
- `client/src/ImpactReport/components/AlbumView.tsx`
- `client/src/ImpactReport/MusicPage.tsx`
- `client/src/ImpactReport/ImpactReportPage.tsx`

### Server-side Components

- `src/ImpactReport/ImpactReportPage.tsx`
- `src/ImpactReport/components/HeroSection.tsx`
- `src/ImpactReport/components/ImpactSection.tsx`

## Common Migration Patterns

### 1. Direct Animation to Preset

```typescript
// OLD
animate({
  targets: element,
  opacity: [0, 1],
  duration: 600,
});

// NEW
fadeIn(element, { duration: 600 });
```

### 2. Animation in useEffect to useAnimation Hook

```typescript
// OLD
useEffect(() => {
  if (element) {
    animate({
      targets: element,
      opacity: [0, 1],
    });
  }
}, [element]);

// NEW
const animation = useAnimation(
  {
    targets: element,
    opacity: [0, 1],
  },
  [element],
);

useEffect(() => {
  if (element) {
    animation.play();
  }
}, [element, animation]);
```

### 3. Simple Ref Animation to useAnimateOnMount

```typescript
// OLD
const elementRef = useRef(null);
useEffect(() => {
  if (elementRef.current) {
    animate({
      targets: elementRef.current,
      opacity: [0, 1],
    });
  }
}, []);

// NEW
const [elementRef, controls] = useAnimateOnMount((element) => ({
  opacity: [0, 1],
}));
```

### 4. Sequential Animations to Timeline

```typescript
// OLD
const animate1 = animate({...}).finished;
animate1.then(() => animate({...}));

// NEW
const tl = timeline();
tl.add({...});
tl.add({...}, '-=200');
```

## Optional Performance Improvements

- Consider using the Web Animation API for simple animations

  - The animation hooks support this natively
  - Better performance for simple property animations
  - Falls back to anime.js for complex animations

- Use the `useAnimation` hook for repeated animations
  - Creates animation once and reuses it
  - Better for animations triggered by user interactions

## Testing

After all components are updated, perform the following tests:

1. Verify all animations work as expected in different browsers
2. Test performance on lower-end devices
3. Check for any console errors related to animations
4. Ensure animations degrade gracefully when they fail
