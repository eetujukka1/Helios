function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

export const localStorageService = {
  getItem(key: string): string | null {
    return getLocalStorage()?.getItem(key) ?? null
  },

  setItem(key: string, value: string): void {
    getLocalStorage()?.setItem(key, value)
  },

  removeItem(key: string): void {
    getLocalStorage()?.removeItem(key)
  },

  isLocalStorageEvent(event: StorageEvent): boolean {
    const storage = getLocalStorage()

    return storage !== null && event.storageArea === storage
  },
}
