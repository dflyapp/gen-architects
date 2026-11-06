export function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  const length = Math.max(aBytes.length, bBytes.length)
  let diff = aBytes.length ^ bBytes.length

  for (let index = 0; index < length; index += 1) {
    diff |= (aBytes[index] ?? 0) ^ (bBytes[index] ?? 0)
  }

  return diff === 0
}

export function checkCredentials(
  expectedUser: string,
  expectedPassword: string,
  submittedUser: string,
  submittedPassword: string
): boolean {
  const userMatches = safeEqual(expectedUser, submittedUser)
  const passwordMatches = safeEqual(expectedPassword, submittedPassword)
  return userMatches && passwordMatches
}
