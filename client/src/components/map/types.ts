/**
 * Types for the Map component
 */

export type LocationType =
  | 'school'
  | 'community-center'
  | 'studio'
  | 'academy'
  | 'hub'
  | 'program'
  | 'office'
  | 'summer-program'
  | 'performance-venue'
  | 'default';

// Define media types for locations
export type LocationMediaType = 'image' | 'video';

// Base interface with common properties
interface SublocationBase {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  type?: LocationType;
  mediums?: string[];
  extraText?: string;
  description?: string;
  address?: string;
  website?: string;
  contactInfo?: string;
}

// Interface for locations with images
interface SublocationWithImage extends SublocationBase {
  mediaType: 'image';
  mediaUrl: string;
}

// Interface for locations with videos
interface SublocationWithVideo extends SublocationBase {
  mediaType: 'video';
  mediaUrl: string;
}

// Interface for locations with no media
interface SublocationWithoutMedia extends SublocationBase {
  mediaType?: never;
  mediaUrl?: never;
}

// Combined type that allows either image, video, or no media
export type Sublocation =
  | SublocationWithImage
  | SublocationWithVideo
  | SublocationWithoutMedia;

export interface Region {
  id: string;
  name: string;
  centerCoordinates: [number, number]; // [latitude, longitude]
  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: [[number, number], [number, number]]; // [[southWest], [northEast]]
  color?: string;
  sublocations: Sublocation[];
  description?: string;
}
