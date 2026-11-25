import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from 'astro:env/server';

/**
 * Upstash is optional. Without it, limits fall back to a per-instance memory map:
 * good enough for dev and a safety net, not a guarantee on serverless.
 */
const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    : null;

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, { count: number; reset: number }>();

function memoryHit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= max;
}

/** True when the call is allowed. */
export async function allow(bucket: string, id: string, max: number, windowSec: number): Promise<boolean> {
  if (!redis) return memoryHit(`${bucket}:${id}`, max, windowSec * 1000);
  let limiter = limiters.get(bucket);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: `cv:${bucket}`,
    });
    limiters.set(bucket, limiter);
  }
  try {
    return (await limiter.limit(id)).success;
  } catch {
    return memoryHit(`${bucket}:${id}`, max, windowSec * 1000);
  }
}

const used = new Set<string>();

/** Marks a challenge as consumed. Returns false if it was already used. */
export async function consume(nonce: string, ttlSec: number): Promise<boolean> {
  if (redis) {
    try {
      return (await redis.set(`cv:used:${nonce}`, '1', { nx: true, ex: ttlSec })) === 'OK';
    } catch {
      /* fall through to memory */
    }
  }
  if (used.has(nonce)) return false;
  used.add(nonce);
  return true;
}
