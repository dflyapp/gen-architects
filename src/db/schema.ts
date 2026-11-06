import { relations } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  coverUrl: text('cover_url').notNull(),
  coverKey: text('cover_key'),
  coverDesc: text('cover_desc').notNull().default(''),
  category: text('category').notNull(),
  tag: text('tag').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  published: integer('published').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const projectImages = sqliteTable(
  'project_images',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    r2Key: text('r2_key'),
    detail: text('detail').notNull().default(''),
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    index('project_images_project_sort_idx').on(
      table.projectId,
      table.sortOrder
    ),
  ]
)

export const projectPackages = sqliteTable(
  'project_packages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    index('project_packages_project_sort_idx').on(
      table.projectId,
      table.sortOrder
    ),
  ]
)

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
  packages: many(projectPackages),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}))

export const projectPackagesRelations = relations(
  projectPackages,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectPackages.projectId],
      references: [projects.id],
    }),
  })
)
