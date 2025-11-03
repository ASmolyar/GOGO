import { Region } from '../types';
import COLORS from '../../../../assets/colors.ts';

// Major cities as regions with their coordinates and bounds
const regions: Region[] = [
  {
    id: 'chicago',
    name: 'Chicago',
    centerCoordinates: [41.8781, -87.6298],
    defaultZoom: 11,
    minZoom: 8,
    maxZoom: 18,
    color: COLORS.gogo_blue,
    maxBounds: [
      [41.5447, -88.0402], // Southwest corner - expanded
      [42.123, -87.2241], // Northeast corner - expanded
    ],
    sublocations: [
      {
        id: 'mosaic-hub-chicago',
        name: 'Mosaic Hub Chicago',
        coordinates: [41.8826, -87.6322],
        type: 'hub',
        mediums: ['Music Education', 'Recording Studio'],
        mediaType: 'image',
        mediaUrl: '/images/locations/chicago/mosaic-hub.jpg',
      },
      {
        id: 'walter-payton-college-prep',
        name: 'Walter Payton College Prep',
        coordinates: [41.9106, -87.6382],
        type: 'school',
        mediums: ['After School Music Program', 'Youth Development'],
      },
      {
        id: 'sound-studio-chicago',
        name: 'Sound Studio Chicago',
        coordinates: [41.8916, -87.6446],
        type: 'studio',
        mediums: ['Music Production', 'Artist Development'],
        mediaType: 'video',
        mediaUrl: 'https://www.youtube.com/embed/Dn4MBJJmvmw',
      },
      {
        id: 'whitney-young-magnet',
        name: 'Whitney M. Young Magnet High School',
        coordinates: [41.8783, -87.6728],
        type: 'school',
        mediums: ['Music Classes', 'Performance Arts'],
      },
      {
        id: 'chicago-youth-center',
        name: 'Chicago Youth Center',
        coordinates: [41.8513, -87.6516],
        type: 'community-center',
        mediums: ['After School Activities', 'Music Training'],
        extraText: 'In partnership with City of Chicago',
      },
    ],
  },
  {
    id: 'new-york',
    name: 'New York City',
    centerCoordinates: [40.7128, -74.006],
    defaultZoom: 11,
    minZoom: 8,
    maxZoom: 18,
    color: COLORS.gogo_green,
    maxBounds: [
      [40.3774, -74.359], // Southwest corner - expanded
      [41.0176, -73.6004], // Northeast corner - expanded
    ],
    sublocations: [
      {
        id: 'bronx-school-music',
        name: 'Bronx School of Music',
        coordinates: [40.8448, -73.8648],
        type: 'academy',
        mediums: ['Classical Training', 'Jazz Studies'],
        mediaType: 'image',
        mediaUrl: '/images/locations/nyc/bronx-school.jpg',
      },
      {
        id: 'brooklyn-arts-center',
        name: 'Brooklyn Arts Center',
        coordinates: [40.6782, -73.9442],
        type: 'community-center',
        mediums: ['Urban Music', 'Hip Hop Production'],
        extraText: 'GOGO Foundation partner site',
      },
      {
        id: 'juilliard-outreach',
        name: 'Juilliard Community Outreach',
        coordinates: [40.7738, -73.9837],
        type: 'program',
        mediums: ['Classical Music Education', 'Performance Training'],
      },
      {
        id: 'harlem-studio-museum',
        name: 'Harlem Studio Museum',
        coordinates: [40.8054, -73.943],
        type: 'studio',
        mediums: ['Recording Sessions', 'Music History'],
        extraText: 'In collaboration with NYC Cultural Affairs',
      },
      {
        id: 'laguardia-high-school',
        name: 'LaGuardia High School of Music & Art',
        coordinates: [40.7744, -73.9816],
        type: 'school',
        mediums: ['Music & Arts Education', 'Performance'],
        extraText: 'In partnership with NYC Department of Education',
      },
    ],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    centerCoordinates: [34.0522, -118.2437],
    defaultZoom: 10,
    minZoom: 8,
    maxZoom: 18,
    color: COLORS.gogo_purple,
    maxBounds: [
      [33.6037, -118.7682], // Southwest corner - expanded
      [34.4373, -118.0553], // Northeast corner - expanded
    ],
    sublocations: [
      {
        id: 'la-music-academy',
        name: 'LA Music Academy',
        coordinates: [34.0922, -118.3278],
        type: 'academy',
        mediums: ['Music Industry', 'Production'],
        extraText: 'Supported by LA Arts Commission',
      },
      {
        id: 'hollywood-high',
        name: 'Hollywood High School of Performing Arts',
        coordinates: [34.1016, -118.3391],
        type: 'school',
        mediums: ['Performance Arts', 'Music Theory'],
      },
      {
        id: 'echo-park-community',
        name: 'Echo Park Community Music Center',
        coordinates: [34.0781, -118.2593],
        type: 'community-center',
        mediums: ['Youth Music Program', 'Instrument Lessons'],
        extraText: 'GOGO Foundation partner site',
      },
      {
        id: 'downtown-recording',
        name: 'Downtown Recording Studio',
        coordinates: [34.0407, -118.2468],
        type: 'studio',
        mediums: ['Professional Recording', 'Production Classes'],
      },
      {
        id: 'compton-youth-ensemble',
        name: 'Compton Youth Ensemble',
        coordinates: [33.8958, -118.2201],
        type: 'program',
        mediums: ['Orchestra', 'Music Education'],
        extraText: 'In collaboration with LA Philharmonic Outreach',
      },
    ],
  },
  {
    id: 'miami',
    name: 'Miami',
    centerCoordinates: [25.7617, -80.1918],
    defaultZoom: 10,
    minZoom: 7,
    maxZoom: 18,
    color: COLORS.gogo_yellow,
    maxBounds: [
      [25.3, -80.65], // Southwest corner - expanded further
      [26.1, -79.95], // Northeast corner - expanded further
    ],
    sublocations: [
      {
        id: 'lake-stevens-middle-school',
        name: 'Lake Stevens Middle School',
        coordinates: [25.9373, -80.2753], // Miami Gardens
        type: 'school',
        mediums: ['Guitar/Bass', 'Keys', 'Drums', 'Vocals', 'Wellness'],
        website: 'https://lakestevensms.com',
      },
      {
        id: 'myrtle-grove-elementary',
        name: 'Myrtle Grove Elementary',
        coordinates: [25.945, -80.253], // Miami Gardens
        type: 'school',
        mediums: ['Vocals', 'Drums', 'Wellness'],
        website: 'https://myrtlegrovees.com',
      },
      {
        id: 'linda-lentin-k8-center',
        name: 'Linda Lentin K-8 Center',
        coordinates: [25.9061, -80.1695], // North Miami
        type: 'school',
        mediums: ['Drums', 'Piano', 'Vocals', 'Wellness'],
        website: 'https://lindalentink8.net',
      },
      {
        id: 'north-miami-middle-school',
        name: 'North Miami Middle School',
        coordinates: [25.8983, -80.1668], // North Miami
        type: 'school',
        mediums: ['Piano', 'Vocals', 'Drums', 'Guitar', 'Art', 'Wellness'],
        website: 'https://northmiamims.com',
      },
      {
        id: 'north-miami-senior-high',
        name: 'North Miami Senior High School',
        coordinates: [25.89, -80.181], // North Miami
        type: 'school',
        mediums: ['Art', 'Vocals', 'Drums', 'Guitar'],
        website: 'https://northmiamisenior.org',
      },
      {
        id: 'citrus-grove-k8',
        name: 'Citrus Grove K-8',
        coordinates: [25.7933, -80.238], // Miami
        type: 'school',
        mediums: ['Vocals', 'Guitars', 'Drums'],
        website: 'https://citrusgrovek8.org',
      },
      {
        id: 'north-dade-middle-school',
        name: 'North Dade Middle School',
        coordinates: [25.9294, -80.239], // Opa-locka
        type: 'school',
        mediums: ['Rap', 'Music Production'],
        website: 'https://northdadems.org',
      },
      {
        id: 'gwen-cherry-park',
        name: 'Gwen Cherry Park',
        coordinates: [25.8278, -80.2217], // Miami
        type: 'community-center',
        mediums: ['Music Production', 'Wellness'],
        website: 'https://miamidade.gov/parks/gwen-cherry.asp',
      },
      {
        id: 'carol-city-middle',
        name: 'Carol City Middle',
        coordinates: [25.9425, -80.2694], // Miami Gardens
        type: 'school',
        mediums: ['Production', 'Guitar/Bass', 'Wellness'],
        website: 'https://carolcityms.org',
      },
      {
        id: 'miami-carol-city-senior-high',
        name: 'Miami Carol City Senior High School',
        coordinates: [25.9396, -80.2525], // Miami Gardens
        type: 'school',
        mediums: ['Production', 'Guitar'],
        website: 'https://carolcityhs.org',
      },
      {
        id: 'overtown-youth-center',
        name: 'Overtown Youth Center',
        coordinates: [25.7867, -80.2031], // Miami
        type: 'community-center',
        mediums: ['Production', 'Songwriting', 'Keys'],
        extraText: 'GOGO Foundation partner site',
        website: 'https://overtownyouth.org',
      },
      {
        id: 'homestead-studio',
        name: 'GOGO Homestead Studio @ Live Like Bella Park',
        coordinates: [25.5404, -80.4821], // Homestead
        type: 'studio',
        mediums: ['Drums', 'Guitar/Bass'],
        website: 'https://gogohomestead.org',
      },
      {
        id: 'miami-beach-bandshell',
        name: 'Miami Beach Bandshell',
        coordinates: [25.8196, -80.1231], // Miami Beach
        type: 'performance-venue',
        mediums: ['North Dade Showcase'],
        website: 'https://northbeachbandshell.com',
        mediaType: 'video',
        mediaUrl: 'https://www.youtube.com/embed/9o_v6i_kQxs',
      },
    ],
  },
  {
    id: 'summer-programs',
    name: 'Summer Programs Nationwide',
    centerCoordinates: [39.8283, -98.5795], // Center of US
    defaultZoom: 4,
    minZoom: 3,
    maxZoom: 18,
    color: COLORS.gogo_pink,
    sublocations: [
      {
        id: 'camp-gogo-wisconsin',
        name: 'Camp GOGO @ Lake Geneva, WI',
        coordinates: [42.5916, -88.4334],
        type: 'summer-program',
        mediums: ['Summer Music Camp', 'Instrument Instruction'],
        website: 'https://campgogo.org',
      },
      {
        id: 'berklee-summer-boston',
        name: 'Berklee Summer Program Boston',
        coordinates: [42.3467, -71.0972],
        type: 'summer-program',
        mediums: ['College Prep Music', 'Performance Workshops'],
        extraText: 'In partnership with Berklee College of Music',
        website: 'https://berklee.edu/summer',
      },
      {
        id: 'aspen-music-festival',
        name: 'Aspen Music Festival Colorado',
        coordinates: [39.1911, -106.8175],
        type: 'summer-program',
        mediums: ['Classical Training', 'Orchestra Experience'],
        extraText: 'In collaboration with Aspen Music Festival',
        website: 'https://aspenmusicfestival.com',
      },
      {
        id: 'interlochen-arts-camp',
        name: 'Interlochen Arts Camp Michigan',
        coordinates: [44.6367, -85.7694],
        type: 'summer-program',
        mediums: ['Intensive Music Training', 'Performance Arts'],
        extraText: 'In partnership with Interlochen Center for the Arts',
        website: 'https://interlochen.org',
      },
      {
        id: 'new-orleans-jazz-camp',
        name: 'New Orleans Jazz & Heritage Camp',
        coordinates: [29.9511, -90.0715],
        type: 'summer-program',
        mediums: ['Jazz Education', 'Louisiana Music History'],
        extraText: 'GOGO Foundation partner site',
        website: 'https://jazzandheritage.org/camp',
      },
    ],
  },
];

export default regions;
