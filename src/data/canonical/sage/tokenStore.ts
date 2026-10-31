/**
 * Token persistence for Sage OAuth 2.0.
 *
 * Sage access tokens expire after 300 seconds (5 minutes).
 * This module manages reading and persisting tokens under .data/sage_tokens.json
 * (which is gitignored). It tracks expiration timestamps so the client can
 * proactively refresh before making API calls.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface StoredSageTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
  businessId?: string;
  updatedAt: string;
}

const TOKENS_PATH = path.join(process.cwd(), ".data", "sage_tokens.json");

/** Safety buffer in seconds before actual expiration to trigger refresh */
const EXPIRATION_BUFFER_MS = 30_000;

export async function readSageTokens(): Promise<StoredSageTokens | null> {
  try {
    const text = await readFile(TOKENS_PATH, "utf8");
    const data = JSON.parse(text) as StoredSageTokens;
    if (data.accessToken && data.refreshToken) {
      return data;
    }
    return null;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function writeSageTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  businessId?: string;
}): Promise<StoredSageTokens> {
  await mkdir(path.dirname(TOKENS_PATH), { recursive: true });
  const expiresAt = Date.now() + tokens.expiresIn * 1000;
  const stored: StoredSageTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt,
    businessId: tokens.businessId,
    updatedAt: new Date().toISOString(),
  };

  await writeFile(TOKENS_PATH, JSON.stringify(stored, null, 2) + "\n", "utf8");
  return stored;
}

export function isTokenExpired(tokens: StoredSageTokens): boolean {
  return Date.now() >= tokens.expiresAt - EXPIRATION_BUFFER_MS;
}
