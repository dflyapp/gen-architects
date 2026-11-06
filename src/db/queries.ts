import type { D1Database } from '@cloudflare/workers-types'
import { and, asc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import type { Project } from '../data/model'
import * as schema from './schema'

type ProjectRow = typeof schema.projects.$inferSelect
type ProjectImageRow = typeof schema.projectImages.$inferSelect
type ProjectPackageRow = typeof schema.projectPackages.$inferSelect

type ProjectWithRelations = ProjectRow & {
  images: ProjectImageRow[]
  packages: ProjectPackageRow[]
}

function toProject(row: ProjectWithRelations): Project {
  return {
    id: row.id,
    name: row.name,
    cover: row.coverUrl,
    coverDesc: row.coverDesc,
    coverKey: row.coverKey,
    category: row.category,
    tag: row.tag,
    location: row.location,
    description: row.description,
    published: row.published === 1,
    sortOrder: row.sortOrder,
    package: row.packages.map((item) => item.label),
    images: row.images.map((image) => ({
      id: image.id,
      src: image.url,
      detail: image.detail,
      r2Key: image.r2Key,
      sortOrder: image.sortOrder,
    })),
  }
}

const withRelations = {
  images: {
    orderBy: [asc(schema.projectImages.sortOrder), asc(schema.projectImages.id)],
  },
  packages: {
    orderBy: [
      asc(schema.projectPackages.sortOrder),
      asc(schema.projectPackages.id),
    ],
  },
}

export async function getPublishedProjects(
  d1: D1Database
): Promise<Project[]> {
  const db = drizzle(d1, { schema })
  const rows = await db.query.projects.findMany({
    where: eq(schema.projects.published, 1),
    orderBy: [asc(schema.projects.sortOrder), asc(schema.projects.id)],
    with: withRelations,
  })

  return rows.map(toProject)
}

export async function getPublishedProject(
  d1: D1Database,
  id: number
): Promise<Project | null> {
  const db = drizzle(d1, { schema })
  const row = await db.query.projects.findFirst({
    where: and(
      eq(schema.projects.id, id),
      eq(schema.projects.published, 1)
    ),
    with: withRelations,
  })

  return row ? toProject(row) : null
}

export async function getProjectById(
  d1: D1Database,
  id: number
): Promise<Project | null> {
  const db = drizzle(d1, { schema })
  const row = await db.query.projects.findFirst({
    where: eq(schema.projects.id, id),
    with: withRelations,
  })

  return row ? toProject(row) : null
}

export async function getAllProjects(d1: D1Database): Promise<Project[]> {
  const db = drizzle(d1, { schema })
  const rows = await db.query.projects.findMany({
    orderBy: [asc(schema.projects.sortOrder), asc(schema.projects.id)],
    with: withRelations,
  })

  return rows.map(toProject)
}
