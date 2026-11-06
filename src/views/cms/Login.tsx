type LoginProps = {
  error?: string
}

export default function Login({ error }: LoginProps) {
  return (
    <section class="max-w-sm mx-auto mt-16 bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-semibold mb-6">CMS login</h1>

      {error && (
        <p class="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <form method="post" action="/cms/login" class="space-y-4">
        <label class="block">
          <span class="block text-sm font-medium">Username</span>
          <input
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            type="text"
            name="username"
            autocomplete="username"
            required
          />
        </label>

        <label class="block">
          <span class="block text-sm font-medium">Password</span>
          <input
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </label>

        <button
          type="submit"
          class="w-full rounded bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </section>
  )
}
