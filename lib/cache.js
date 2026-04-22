const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export const getCache = (key) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    cache.delete(key);
  }
  return null;
};

export const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = () => {
  cache.clear();
};
