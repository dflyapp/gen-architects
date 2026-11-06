import type { Project } from '../../data/model'

type DashboardProps = {
  projects: Project[]
}

export default function Dashboard({ projects }: DashboardProps) {
  return (
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold">Projects</h1>
          <p class="text-sm text-gray-600">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </p>
        </div>
        <a
          href="/cms/projects/new"
          class="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          New project
        </a>
      </div>

      {projects.length === 0 ? (
        <div class="rounded bg-white p-6 shadow">
          <p>No projects yet. Create the first one.</p>
        </div>
      ) : (
        <div class="overflow-x-auto rounded bg-white shadow">
          <table class="w-full text-left text-sm">
            <thead class="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th class="px-4 py-3">Project</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Tag</th>
                <th class="px-4 py-3">Order</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} class="border-b last:border-b-0">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img
                        src={project.cover}
                        alt=""
                        class="h-12 w-16 object-cover"
                      />
                      <div>
                        <div class="font-medium">{project.name}</div>
                        <div class="text-xs text-gray-500">
                          ID {project.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">{project.category}</td>
                  <td class="px-4 py-3">{project.tag}</td>
                  <td class="px-4 py-3">{project.sortOrder ?? 0}</td>
                  <td class="px-4 py-3">
                    <span
                      class={`rounded px-2 py-1 text-xs ${
                        project.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-3">
                      <a
                        class="underline"
                        href={`/cms/projects/${project.id}/edit`}
                      >
                        Edit
                      </a>
                      {project.published && (
                        <a
                          class="underline"
                          href={`/work/${project.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
