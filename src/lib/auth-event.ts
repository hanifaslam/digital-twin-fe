type Listener = () => void

const unauthorizedListeners = new Set<Listener>()

export const authEvents = {
  onUnauthorized(cb: Listener) {
    unauthorizedListeners.add(cb)
    return () => unauthorizedListeners.delete(cb)
  },
  emitUnauthorized() {
    unauthorizedListeners.forEach((cb) => cb())
  }
}
