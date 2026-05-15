const axios = require('axios');

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value, ttl = CACHE_TTL) {
  cache.set(key, { value, expiresAt: Date.now() + ttl });
}

async function requestWithRetry(url, params = {}, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await axios.get(url, { params, timeout: 10_000 });
      return res.data;
    } catch (err) {
      lastErr = err;
      // Retry on network errors or 5xx
      const status = err.response && err.response.status;
      const shouldRetry = !err.response || (status >= 500 && status < 600);
      if (!shouldRetry) break;
      const delay = Math.pow(2, i) * 500;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// Parse ISO 8601 duration (e.g. PT1H2M10S) to seconds
function parseISODuration(iso) {
  if (!iso) return 0;
  const regex = /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
  const matches = iso.match(regex);
  if (!matches) return 0;
  const [, years, months, days, hours, minutes, seconds] = matches;
  return (
    (Number(years || 0) * 365 * 24 * 3600) +
    (Number(months || 0) * 30 * 24 * 3600) +
    (Number(days || 0) * 24 * 3600) +
    (Number(hours || 0) * 3600) +
    (Number(minutes || 0) * 60) +
    Number(seconds || 0)
  );
}

function normalizeVideoItem(item) {
  const snippet = item.snippet || {};
  const thumbnails = snippet.thumbnails || {};
  const thumbnail = (thumbnails.maxres || thumbnails.high || thumbnails.medium || thumbnails.default || {}).url || null;
  return {
    id: item.id,
    title: snippet.title || '',
    channel: snippet.channelTitle || '',
    duration: parseISODuration(item.contentDetails && item.contentDetails.duration),
    thumbnail,
    embedUrl: `https://www.youtube.com/embed/${item.id}`,
    source: 'youtube',
  };
}

async function search(q, options = {}) {
  if (!q) return [];
  const maxResults = options.maxResults || 5;
  const cacheKey = `search:${q}:${maxResults}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!API_KEY) throw new Error('YOUTUBE_API_KEY not set in environment');

  // First call: search to get video IDs
  const searchParams = {
    part: 'snippet',
    q,
    type: 'video',
    maxResults,
    key: API_KEY,
  };

  const searchData = await requestWithRetry(`${API_BASE}/search`, searchParams);
  const ids = (searchData.items || []).map((it) => it.id && it.id.videoId).filter(Boolean);
  if (ids.length === 0) {
    setCache(cacheKey, []);
    return [];
  }

  // Second call: get contentDetails for durations
  const videosParams = {
    part: 'snippet,contentDetails',
    id: ids.join(','),
    key: API_KEY,
    maxResults,
  };

  const videosData = await requestWithRetry(`${API_BASE}/videos`, videosParams);
  const results = (videosData.items || []).map((v) => normalizeVideoItem({ id: v.id, snippet: v.snippet, contentDetails: v.contentDetails }));

  setCache(cacheKey, results);
  return results;
}

async function getVideoById(id) {
  if (!id) return null;
  const cacheKey = `video:${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!API_KEY) throw new Error('YOUTUBE_API_KEY not set in environment');

  const params = {
    part: 'snippet,contentDetails',
    id,
    key: API_KEY,
  };

  const data = await requestWithRetry(`${API_BASE}/videos`, params);
  const item = (data.items && data.items[0]) || null;
  if (!item) return null;
  const normalized = normalizeVideoItem({ id: item.id, snippet: item.snippet, contentDetails: item.contentDetails });
  setCache(cacheKey, normalized);
  return normalized;
}

module.exports = {
  search,
  getVideoById,
  // exported for testing
  _parseISODuration: parseISODuration,
};
