import type { Project, ProjectImage } from '../data/model'

export type ProjectFormValues = {
  name: string
  category: string
  tag: string
  location: string
  description: string
  coverDesc: string
  published: boolean
  sortOrder: number
  packageText: string
}

export type ProjectFormResult =
  | {
      ok: true
      values: ProjectFormValues
      packages: string[]
    }
  | {
      ok: false
      values: ProjectFormValues
      errors: Record<string, string>
    }

export type ImageUpdate = {
  id: number
  detail: string
  sortOrder: number
}

function stringValue(form: FormData, key: string): string {
  const value = form.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export function parsePackages(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function readProjectForm(form: FormData): ProjectFormResult {
  const sortOrderText = stringValue(form, 'sort_order')
  const parsedSortOrder = Number(sortOrderText || 0)

  const values: ProjectFormValues = {
    name: stringValue(form, 'name'),
    category: stringValue(form, 'category'),
    tag: stringValue(form, 'tag'),
    location: stringValue(form, 'location'),
    description: stringValue(form, 'description'),
    coverDesc: stringValue(form, 'cover_desc'),
    published:
      form.get('published') === 'on' ||
      form.get('published') === '1' ||
      form.get('published') === 'true',
    sortOrder: Number.isInteger(parsedSortOrder) ? parsedSortOrder : 0,
    packageText: stringValue(form, 'package'),
  }

  const errors: Record<string, string> = {}

  if (!values.name) {
    errors.name = 'Name is required.'
  } else if (values.name.length > 200) {
    errors.name = 'Name must be 200 characters or fewer.'
  }

  if (!values.category) {
    errors.category = 'Category is required.'
  } else if (values.category.length > 100) {
    errors.category = 'Category must be 100 characters or fewer.'
  }

  if (!values.tag) {
    errors.tag = 'Tag is required.'
  } else if (values.tag.length > 100) {
    errors.tag = 'Tag must be 100 characters or fewer.'
  }

  if (!values.location) {
    errors.location = 'Location is required.'
  } else if (values.location.length > 200) {
    errors.location = 'Location must be 200 characters or fewer.'
  }

  if (!values.description) {
    errors.description = 'Description is required.'
  } else if (values.description.length > 10000) {
    errors.description = 'Description must be 10,000 characters or fewer.'
  }

  if (values.coverDesc.length > 500) {
    errors.coverDesc = 'Cover caption must be 500 characters or fewer.'
  }

  if (!Number.isInteger(parsedSortOrder)) {
    errors.sortOrder = 'Sort order must be a whole number.'
  }

  const packages = parsePackages(values.packageText)
  if (packages.length > 50) {
    errors.package = 'Use 50 package items or fewer.'
  } else if (packages.some((item) => item.length > 200)) {
    errors.package = 'Each package item must be 200 characters or fewer.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, values, errors }
  }

  return { ok: true, values, packages }
}

export function projectFormValuesFromProject(
  project: Project
): ProjectFormValues {
  return {
    name: project.name,
    category: project.category,
    tag: project.tag,
    location: project.location,
    description: project.description,
    coverDesc: project.coverDesc,
    published: project.published ?? false,
    sortOrder: project.sortOrder ?? 0,
    packageText: project.package.join('\n'),
  }
}

export function readImageUpdates(
  form: FormData,
  images: ProjectImage[]
): ImageUpdate[] {
  return images.flatMap((image) => {
    if (image.id === undefined) {
      return []
    }

    const detail = form.get(`image_detail_${image.id}`)
    const sortOrder = form.get(`image_sort_${image.id}`)
    const parsedSortOrder = Number(sortOrder)

    return [
      {
        id: image.id,
        detail:
          typeof detail === 'string'
            ? detail.trim().slice(0, 500)
            : image.detail,
        sortOrder: Number.isInteger(parsedSortOrder)
          ? parsedSortOrder
          : (image.sortOrder ?? 0),
      },
    ]
  })
}
