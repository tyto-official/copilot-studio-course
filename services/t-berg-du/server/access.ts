import { randomBytes } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { consumeAccessKey, createAccessSession } from './store.js';

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '';
const turnstileHostname = process.env.TURNSTILE_ALLOWED_HOSTNAME || '';
const localTurnstileToken = 'tberg-local-turnstile';

type WindowCounter = { count: number; resetsAt: number };
const issueCounters = new Map<string, WindowCounter>();
const generalCounters = new Map<string, WindowCounter>();

function clientIp(req: Request) {
  return req.ip || 'unknown';
}

function withinLimit(store: Map<string, WindowCounter>, key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetsAt <= now) {
    store.set(key, { count: 1, resetsAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) };
  }
  current.count += 1;
  return { allowed: current.count <= limit, remaining: Math.max(0, limit - current.count), retryAfter: Math.ceil((current.resetsAt - now) / 1000) };
}

export function generalRateLimit(req: Request, res: Response, next: NextFunction) {
  const result = withinLimit(generalCounters, clientIp(req), 600, 60_000);
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfter));
    res.status(429).json({ error: 'För många anrop. Försök igen om en stund.' });
    return;
  }
  next();
}

export function issueRateLimit(req: Request, res: Response, next: NextFunction) {
  const result = withinLimit(issueCounters, clientIp(req), 50, 60 * 60_000);
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfter));
    res.status(429).json({ error: 'För många testmiljöer har skapats från nätverket. Försök igen senare.' });
    return;
  }
  next();
}

export async function verifyTurnstile(token: string, req: Request) {
  if (process.env.NODE_ENV !== 'production' && !turnstileSecret && token === localTurnstileToken) return true;
  if (!turnstileSecret) throw new Error('Turnstile är inte konfigurerat på servern.');
  if (!token) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: token,
        remoteip: clientIp(req),
        idempotency_key: randomBytes(16).toString('hex'),
      }),
      signal: controller.signal,
    });
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
    if (!result.success) return false;
    if (turnstileHostname && result.hostname !== turnstileHostname) return false;
    return !result.action || result.action === 'issue-test-key';
  } finally {
    clearTimeout(timeout);
  }
}

export async function issueAccess(req: Request, res: Response) {
  try {
    const valid = await verifyTurnstile(String(req.body?.turnstileToken || ''), req);
    if (!valid) {
      res.status(400).json({ error: 'Verifieringen misslyckades. Försök igen.' });
      return;
    }
    const result = await createAccessSession();
    res.status(201).json(result);
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : 'Testmiljön kunde inte skapas.' });
  }
}

export async function requireAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const rawKey = req.header('x-workshop-key') || '';
    if (!rawKey) {
      res.status(401).json({ error: 'En giltig T-Berg-testnyckel krävs.' });
      return;
    }
    const session = await consumeAccessKey(rawKey);
    res.locals.accessSession = session;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nyckeln kunde inte verifieras.';
    const status = message.includes('förbrukat') ? 429 : 401;
    res.status(status).json({ error: message });
  }
}

export const localDevelopmentTurnstileToken = localTurnstileToken;
