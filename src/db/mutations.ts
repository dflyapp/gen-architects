import type { D1Database } from '@cloudflare/workers-types'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import { PLACEHOLDER_COVER } from '../data/model'
import type { ImageUpdate, ProjectFormValues } from '../lib/validation'
import * as schema from './schema'

export type NewProjectImage = {
  url: string
  r2Key: string
  detail: string
  sortOrder: number
}

function nowIso(): string {
  return new Date().toISOString()
}

export async function createProject(
  d1: D1Database,
  values: ProjectFormValues,
  packages: string[]
): Promise<number> {
  const db = drizzle(d1, { schema })
  const now = nowIso()

  const inserted = await db
    .insert(schema.projects)
    .values({
      name: values.name,
      coverUrl: PLACEHOLDER_COVER,
      coverKey: null,
      coverDesc: values.coverDesc,
      category: values.category,
      tag: values.tag,
      location: values.location,
      description: values.description,
      published: values.published ? 1 : 0,
      sortOrder: values.sortOrder,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: schema.projects.id })

  const id = inserted[0]?.id
  if (!id) {
    throw new Error('Failed to create project.')
  }

  if (packages.length > 0) {
    await db.insert(schema.projectPackages).values(
      packages.map((label, index) => ({
        projectId: id,
        label,
        sortOrder: index + 1,
      }))
    )
  }

  return id
}

export async function updateProject(
  d1: D1Database,
  id: number,
  values: ProjectFormValues,
  packages: string[],
  imageUpdates: ImageUpdate[]
): Promise<void> {
  const db = drizzle(d1, { schema })

  await db
    .update(schema.projects)
    .set({
      name: values.name,
      coverDesc: values.coverDesc,
      category: values.category,
      tag: values.tag,
      location: values.location,
      description: values.description,
      published: values.published ? 1 : 0,
      sortOrder: values.sortOrder,
      updatedAt: nowIso(),
    })
    .where(eq(schema.projects.id, id))

  await db
    .delete(schema.projectPackages)
    .where(eq(schema.projectPackages.projectId, id))

  if (packages.length > 0) {
    await db.insert(schema.projectPackages).values(
      packages.map((label, index) => ({
        projectId: id,
        label,
        sortOrder: index + 1,
      }))
    )
  }

  for (const image of imageUpdates) {
    await db
      .update(schema.projectImages)
      .set({
        detail: image.detail,
        sortOrder: image.sortOrder,
      })
      .where(
        and(
          eq(schema.projectImages.id, image.id),
          eq(schema.projectImages.projectId, id)
        )
      )
  }
}

export async function updateProjectCover(
  d1: D1Database,
  id: number,
  coverUrl: string,
  coverKey: string | null
): Promise<void> {
  const db = drizzle(d1, { schema })

  await db
    .update(schema.projects)
    .set({
      coverUrl,
      coverKey,
      updatedAt: nowIso(),
    })
    .where(eq(schema.projects.id, id))
}

export async function addProjectImages(
  d1: D1Database,
  projectId: number,
  images: NewProjectImage[]
): Promise<void> {
  if (images.length === 0) {
    return
  }

  const db = drizzle(d1, { schema })
  await db.insert(schema.projectImages).values(
    images.map((image) => ({
      projectId,
      url: image.url,
      r2Key: image.r2Key,
      detail: image.detail,
      sortOrder: image.sortOrder,
    }))
  )
}

export async function deleteProjectImage(
  d1: D1Database,
  projectId: number,
  imageId: number
): Promise<void> {
  const db = drizzle(d1, { schema })

  await db
    .delete(schema.projectImages)
    .where(
      and(
        eq(schema.projectImages.id, imageId),
        eq(schema.projectImages.projectId, projectId)
      )
    )
}

export async function deleteProject(
  d1: D1Database,
  id: number
): Promise<void> {
  const db = drizzle(d1, { schema })

  await db
    .delete(schema.projectImages)
    .where(eq(schema.projectImages.projectId, id))
  await db
    .delete(schema.projectPackages)
    .where(eq(schema.projectPackages.projectId, id))
  await db.delete(schema.projects).where(eq(schema.projects.id, id))
}
