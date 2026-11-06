export type ProjectImage = {
  id?: number
  src: string
  detail: string
  r2Key?: string | null
  sortOrder?: number
}

export type Project = {
  id: number
  name: string
  cover: string
  coverDesc: string
  coverKey?: string | null
  category: string
  tag: string
  location: string
  description: string
  package: string[]
  images: ProjectImage[]
  published?: boolean
  sortOrder?: number
}

// Adapted from https://github.com/Popmotion/popmotion/blob/master/packages/popmotion/src/utils/wrap.ts
export const wrap = (min: number, max: number, value: number) => {
  const rangeSize = max - min
  return ((((value - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export const PLACEHOLDER_COVER = '/assets/svg/placeholder.svg'
