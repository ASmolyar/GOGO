// Type definitions fixes for leaflet
declare module 'leaflet' {
  export class Marker {
    options: {
      icon: any;
      [key: string]: any;
    };

    static prototype: Marker;
  }

  export function latLng(lat: number, lng: number): any;
  export class LatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number);
  }
}
