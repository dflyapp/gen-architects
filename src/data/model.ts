export type ProjectImage = {
  src: string
  detail: string
}

export type Project = {
  id: number
  name: string
  cover: string
  coverdesc: string
  category: string
  tag: string
  location: string
  description: string
  package: string[]
  images: ProjectImage[]
}

export const projects: Project[] = [
  {
    id: 1,
    name: '59 HOUSE',
    cover: '/assets/img/cover1.jpg',
    coverdesc: 'Exterior perspective',
    category: 'HOUSE',
    tag: 'GEN 16—004',
    location: 'Gò Vấp, TP. Hồ Chí Minh',
    description:
      'The process of context research has brought us to the typical tropical architectural form of the site location. We have chosen to demonstrate the form of two layers of walls with a light outer wall made of ball breeze concrete blocks and carry to the shape of the facade.',
    package: [
      'Site Analysis',
      'Concept Design',
      'Planning Process',
      'Technical Design',
      'On Site Assistance',
    ],
    images: [
      { src: '/assets/img/1/1.jpg', detail: 'unknown' },
      { src: '/assets/img/1/2.jpg', detail: 'Living room' },
      { src: '/assets/img/1/3.jpg', detail: 'Master bedroom' },
      { src: '/assets/img/1/4.jpg', detail: 'Kitchen space' },
      { src: '/assets/img/1/5.jpg', detail: 'Sleeping and working space' },
      { src: '/assets/img/1/6.jpg', detail: 'Facade perspective' },
    ],
  },
  {
    id: 2,
    name: 'PHAN THIET HOUSE',
    cover: '/assets/img/cover2.jpg',
    coverdesc: 'Exterior perspective',
    category: 'COUNTRY HOUSE',
    tag: 'GEN 19—205',
    location: 'PHAN THIET - VIETNAM',
    description:
      'In the mood of a sunny and sandy tropical air, the concept came up with a traditional country house form with details of a sloped roof, porch, and solid and hollow bricks to minimize the solar radiation entering the building, and combine that with modern materials to resist corrosion from the sea air.',
    package: [
      'Site Analysis',
      'Concept Design',
      'Planning Process',
      'Technical Design',
      'On Site Assistance',
    ],
    images: [
      { src: '/assets/img/2/1.jpg', detail: 'unknown' },
      { src: '/assets/img/2/2.jpg', detail: 'Image from brick background' },
      { src: '/assets/img/2/3.jpg', detail: 'Kitchen space' },
      { src: '/assets/img/2/4.jpg', detail: 'Courtyard' },
      { src: '/assets/img/2/5.jpg', detail: 'Exterior perspective' },
    ],
  },
  {
    id: 3,
    name: 'VINHOME CENTRAL PARK',
    cover: '/assets/img/cover3.jpg',
    coverdesc: 'Exterior perspective',
    category: 'APARTMENT',
    tag: 'GEN 17—002',
    location: 'BINH THANH - TPHCM',
    description:
      'For interior space, designers proposed the style of the North of Europe - Scandinavian. In the spirit of minimalism - functionality - comfort has been conveyed into the spaces inside the building.',
    package: [
      'Site Analysis',
      'Concept Design',
      'Planning Process',
      'Technical Design',
      'On Site Assistance',
    ],
    images: [
      { src: '/assets/img/3/1.jpg', detail: 'unknown' },
      { src: '/assets/img/3/2.jpg', detail: 'Living room' },
      { src: '/assets/img/3/3.jpg', detail: 'Living room and dining space' },
      { src: '/assets/img/3/4.jpg', detail: 'Entrance' },
      { src: '/assets/img/3/5.jpg', detail: 'Master bedroom' },
      { src: '/assets/img/3/6.jpg', detail: "Child's bedroom" },
    ],
  },
  {
    id: 4,
    name: 'TEN LUA HOUSE ',
    cover: '/assets/img/cover4.jpg',
    coverdesc: 'Exterior perspective',
    category: 'HOUSE',
    tag: 'GEN 18—001',
    location: 'BINH TAN - TPHCM',
    description:
      'Typical design solution of Vietnamese townhouses, with minimalist modern lines, balconies, loggias, and trees came between, taking advantage of old furniture items but carrying many memories have reused them to combine with suitable spaces.',
    package: [
      'Site Analysis',
      'Concept Design',
      'Planning Process',
      'Technical Design',
      'On Site Assistance',
    ],
    images: [
      { src: '/assets/img/4/1.jpg', detail: 'unknown' },
      { src: '/assets/img/4/2.jpg', detail: 'Kitchen space' },
      { src: '/assets/img/4/3.jpg', detail: 'Living room' },
      { src: '/assets/img/4/4.jpg', detail: 'Kitchen space' },
      { src: '/assets/img/4/5.jpg', detail: 'Master bedroom' },
      { src: '/assets/img/4/6.jpg', detail: 'Music room' },
    ],
  },
]

// Adapted from https://github.com/Popmotion/popmotion/blob/master/packages/popmotion/src/utils/wrap.ts
export const wrap = (min: number, max: number, value: number) => {
  const rangeSize = max - min
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min
}
