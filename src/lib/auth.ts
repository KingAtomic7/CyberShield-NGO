// CyberShield NGO - Authentication Utilities
// Secure password hashing with bcryptjs and JWT session management with jose

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Security: Use environment variable for JWT secret, never hardcode
const configuredJwtSecret = process.env.JWT_SECRET?.trim();
if (process.env.NODE_ENV === "production" && !configuredJwtSecret) {
  throw new Error("JWT_SECRET must be set in production");
}

// Development fallback is intentionally limited to non-production environments.
const JWT_SECRET = new TextEncoder().encode(
  configuredJwtSecret || "cybershield-ngo-local-development-secret"
);

const COOKIE_NAME = "cybershield_session";
const COOKIE_OPTIONS = {
  httpOnly: true,    // Security: Prevent XSS access to cookie
  secure: process.env.NODE_ENV === "production", // Security: HTTPS only in production
  sameSite: "lax" as const, // Security: CSRF protection
  path: "/",
  maxAge: 60 * 60 * 8, // 8 hour session
};

export interface SessionPayload {
  userId: string;
  username: string;
  role: "ngo_admin" | "sys_admin";
  organizationId?: string;
}

// Password hashing - Security: Never store plaintext passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Security: High work factor for bcrypt
  return bcrypt.hash(password, saltRounds);
}

// Password verification - Security: Constant-time comparison via bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Input validation - Security: Prevent injection and XSS
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function validateUsername(username: string): boolean {
  // Security: Alphanumeric + limited special chars, prevent injection
  const usernameRegex = /^[a-zA-Z0-9_\-]{3,50}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number");
  return { valid: errors.length === 0, errors };
}

// Security: Sanitize string input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Create JWT session token
export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

// Verify JWT session token
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    // Security: Don't leak token verification errors
    return null;
  }
}

// Set session cookie in response
export function setSessionCookie(token: string): typeof COOKIE_OPTIONS & { value: string } {
  return { ...COOKIE_OPTIONS, value: token };
}

// Get current session from cookies
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}

// Get cookie name for clearing
export function getCookieName(): string {
  return COOKIE_NAME;
}

export { COOKIE_NAME, COOKIE_OPTIONS };
