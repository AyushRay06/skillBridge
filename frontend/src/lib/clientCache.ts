/**
 * Lightweight in-memory & sessionStorage cache with TTL.
 * Zero external dependencies. Fast stale-while-revalidate for instant page transitions.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string, maxAgeMs = 120_000): T | null {
  // 1. In-memory check (instant)
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.timestamp < maxAgeMs) {
    return mem.data as T;
  }

  // 2. sessionStorage check (cross-page within current tab)
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(`sb_cache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < maxAgeMs) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {
      // Storage unavailable or blocked
    }
  }

  return null;
}

export function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`sb_cache_${key}`, JSON.stringify(entry));
    } catch {
      // Storage quota or blocked
    }
  }
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }

  for (const k of memoryCache.keys()) {
    if (k.startsWith(keyPrefix)) {
      memoryCache.delete(k);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(`sb_cache_${keyPrefix}`)) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      // Storage unavailable
    }
  }
}
