const pLimit = (n: number) => {
  let active = 0
  const q: Array<() => void> = []
  const next = () => {
    active--
    q.shift()?.()
  }
  return async <T>(fn: () => Promise<T>) => {
    if (active >= n) await new Promise<void>((r) => q.push(r))
    active++
    try {
      return await fn()
    } finally {
      next()
    }
  }
}
const limit = pLimit(6)

async function fetchWithTimeout<T>(fn: () => Promise<T>, ms = 5000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fn()
  } finally {
    clearTimeout(t)
  }
}

function unwrap<T>(res: { success: boolean; data?: T; message?: string }) {
  if (!res?.success) throw new Error(res?.message || 'Permintaan gagal')
  return res.data
}

export async function swrCall<T>(
  service: () => Promise<{ success: boolean; data?: T; message?: string }>
) {
  const res = await limit(() => fetchWithTimeout(() => service(), 5000))
  return unwrap(res)
}
