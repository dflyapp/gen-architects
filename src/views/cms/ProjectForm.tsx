import type { Project } from '../../data/model'
import { PLACEHOLDER_COVER } from '../../data/model'
import { ALLOWED_IMAGE_TYPES } from '../../lib/media'
import type { ProjectFormValues } from '../../lib/validation'

type ProjectFormProps = {
  project: Project | null
  values: ProjectFormValues
  errors: Record<string, string>
  csrfToken: string
  isNew: boolean
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }
  return <p class="mt-1 text-sm text-red-600">{message}</p>
}

export default function ProjectForm({
  project,
  values,
  errors,
  csrfToken,
  isNew,
}: ProjectFormProps) {
  const action = isNew
    ? '/cms/projects'
    : `/cms/projects/${project?.id ?? 0}`
  const coverPreview = project?.cover ?? PLACEHOLDER_COVER
  const images = project?.images ?? []
  const accept = ALLOWED_IMAGE_TYPES.join(',')

  return (
    <div class="space-y-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold">
            {isNew ? 'New project' : 'Edit project'}
          </h1>
          {project && (
            <p class="text-sm text-gray-600">
              ID {project.id} · {project.published ? 'Published' : 'Draft'}
            </p>
          )}
        </div>
        <a href="/cms" class="underline">
          Back to dashboard
        </a>
      </div>

      {errors.form && (
        <div class="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {errors.form}
        </div>
      )}

      <form
        id="project-form"
        method="post"
        action={action}
        class="space-y-5 rounded bg-white p-6 shadow"
      >
        <input type="hidden" name="_csrf" value={csrfToken} />

        <div class="grid gap-5 md:grid-cols-2">
          <label class="block">
            <span class="block text-sm font-medium">Name</span>
            <input
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              type="text"
              name="name"
              value={values.name}
              maxlength={200}
              required
            />
            <FieldError message={errors.name} />
          </label>

          <label class="block">
            <span class="block text-sm font-medium">Category</span>
            <input
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              type="text"
              name="category"
              value={values.category}
              maxlength={100}
              required
            />
            <FieldError message={errors.category} />
          </label>

          <label class="block">
            <span class="block text-sm font-medium">Tag</span>
            <input
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              type="text"
              name="tag"
              value={values.tag}
              maxlength={100}
              required
            />
            <FieldError message={errors.tag} />
          </label>

          <label class="block">
            <span class="block text-sm font-medium">Location</span>
            <input
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              type="text"
              name="location"
              value={values.location}
              maxlength={200}
              required
            />
            <FieldError message={errors.location} />
          </label>
        </div>

        <label class="block">
          <span class="block text-sm font-medium">Cover caption</span>
          <input
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            type="text"
            name="cover_desc"
            value={values.coverDesc}
            maxlength={500}
          />
          <FieldError message={errors.coverDesc} />
        </label>

        <label class="block">
          <span class="block text-sm font-medium">Description</span>
          <textarea
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            name="description"
            rows={5}
            maxlength={10000}
            required
          >
            {values.description}
          </textarea>
          <FieldError message={errors.description} />
        </label>

        <label class="block">
          <span class="block text-sm font-medium">
            Package items (one per line)
          </span>
          <textarea
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            name="package"
            rows={6}
          >
            {values.packageText}
          </textarea>
          <FieldError message={errors.package} />
        </label>

        <div class="flex flex-wrap items-end gap-6">
          <label class="block">
            <span class="block text-sm font-medium">Sort order</span>
            <input
              class="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
              type="number"
              name="sort_order"
              value={String(values.sortOrder)}
              step="1"
            />
            <FieldError message={errors.sortOrder} />
          </label>

          <label class="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              name="published"
              checked={values.published}
            />
            <span class="text-sm font-medium">Published</span>
          </label>
        </div>

        <div class="flex flex-wrap items-center gap-3 border-t pt-4">
          <button
            type="submit"
            class="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
          >
            {isNew ? 'Create project' : 'Save project'}
          </button>
          <a href="/cms" class="px-2 py-2 underline">
            Cancel
          </a>
        </div>
      </form>

      {!isNew && project && (
        <>
          <section class="space-y-4 rounded bg-white p-6 shadow">
            <h2 class="text-xl font-semibold">Cover image</h2>
            <img
              src={coverPreview}
              alt="Current cover"
              class="max-h-64 w-full max-w-md border object-cover"
            />

            <form
              method="post"
              action={`/cms/projects/${project.id}/cover`}
              enctype="multipart/form-data"
              class="space-y-3"
            >
              <input type="hidden" name="_csrf" value={csrfToken} />
              <input
                class="block text-sm"
                type="file"
                name="cover"
                accept={accept}
                required
              />
              <p class="text-sm text-gray-600">
                JPEG, PNG, WebP, or AVIF up to 10 MB.
              </p>
              <button
                type="submit"
                class="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
              >
                Upload cover
              </button>
            </form>
          </section>

          <section class="space-y-4 rounded bg-white p-6 shadow">
            <div>
              <h2 class="text-xl font-semibold">Gallery images</h2>
              <p class="text-sm text-gray-600">
                Captions and order are saved with the main project form.
              </p>
            </div>

            {images.length === 0 ? (
              <p class="text-sm text-gray-600">No gallery images yet.</p>
            ) : (
              <div class="space-y-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    class="flex flex-wrap gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={image.src}
                      alt={image.detail || 'Gallery image'}
                      class="h-28 w-40 border object-cover"
                    />
                    <div class="min-w-[200px] flex-1 space-y-2">
                      <label class="block text-sm">
                        <span class="block font-medium">Caption</span>
                        <input
                          form="project-form"
                          class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                          type="text"
                          name={`image_detail_${image.id}`}
                          value={image.detail}
                          maxlength={500}
                        />
                      </label>
                      <label class="block text-sm">
                        <span class="block font-medium">Order</span>
                        <input
                          form="project-form"
                          class="mt-1 w-28 rounded border border-gray-300 px-3 py-2"
                          type="number"
                          name={`image_sort_${image.id}`}
                          value={String(image.sortOrder ?? 0)}
                          step="1"
                        />
                      </label>
                    </div>
                    <form
                      method="post"
                      action={`/cms/projects/${project.id}/images/${image.id}/delete`}
                      class="self-start"
                    >
                      <input
                        type="hidden"
                        name="_csrf"
                        value={csrfToken}
                      />
                      <button
                        type="submit"
                        class="text-sm text-red-700 underline hover:no-underline"
                      >
                        Delete image
                      </button>
                    </form>
                  </div>
                ))}

                <button
                  type="submit"
                  form="project-form"
                  class="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
                >
                  Save captions & order
                </button>
              </div>
            )}

            <form
              method="post"
              action={`/cms/projects/${project.id}/images`}
              enctype="multipart/form-data"
              class="space-y-3 border-t pt-4"
            >
              <input type="hidden" name="_csrf" value={csrfToken} />
              <label class="block">
                <span class="block text-sm font-medium">
                  Upload gallery images
                </span>
                <input
                  class="mt-1 block text-sm"
                  type="file"
                  name="images"
                  accept={accept}
                  multiple
                  required
                />
              </label>
              <p class="text-sm text-gray-600">
                JPEG, PNG, WebP, or AVIF up to 10 MB each.
              </p>
              <button
                type="submit"
                class="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
              >
                Upload images
              </button>
            </form>
          </section>

          <section class="space-y-3 rounded border border-red-200 bg-white p-6 shadow">
            <h2 class="text-xl font-semibold text-red-700">Danger zone</h2>
            <p class="text-sm text-gray-600">
              Deleting a project also removes its uploaded images.
            </p>
            <form
              method="post"
              action={`/cms/projects/${project.id}/delete`}
            >
              <input type="hidden" name="_csrf" value={csrfToken} />
              <button
                type="submit"
                class="rounded bg-red-700 px-4 py-2 text-white hover:opacity-90"
              >
                Delete project
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
