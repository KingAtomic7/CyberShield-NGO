// Auth API Route - Login, Logout, Session Check
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, verifySession, validateUsername, validateEmail, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;

      // Security: Input validation
      if (!username || !password) {
        return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
      }

      if (!validateUsername(username) && !validateEmail(username)) {
        return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
      }

      // Find user by username or email
      const user = await db.query.users.findFirst({
        where: or(eq(users.username, username), eq(users.email, username)),
      });

      if (!user) {
        // Security: Don't reveal whether username exists
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Security: Verify password with constant-time comparison
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Create session token
      const token = await createSession({
        userId: user.id,
        username: user.username,
        role: user.role as "ngo_admin" | "sys_admin",
        organizationId: user.organizationId || undefined,
      });

      // Security: Set HTTP-only secure cookie
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, role: user.role, organizationId: user.organizationId },
      });

      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
      return response;
    }

    if (action === "register") {
      const { username, email, password } = body;

      // Security: Validate all inputs
      if (!validateUsername(username)) {
        return NextResponse.json({ error: "Invalid username (3-50 chars, alphanumeric/underscore/hyphen)" }, { status: 400 });
      }
      if (!validateEmail(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
      if (!password || password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }

      // Check if user exists
      const existing = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      if (existing) {
        return NextResponse.json({ error: "Username already exists" }, { status: 409 });
      }

      const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }

      // Security: Hash password before storage
      const passwordHash = await hashPassword(password);

      const result = await db.insert(users).values({
        username,
        email,
        passwordHash,
        role: "ngo_admin",
      }).returning();

      const user = result[0];

      const token = await createSession({
        userId: user.id,
        username: user.username,
        role: user.role as "ngo_admin" | "sys_admin",
        organizationId: user.organizationId || undefined,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, role: user.role, organizationId: user.organizationId },
      });

      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    // Security: Don't leak error details
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Get fresh user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, username: user.username, role: user.role, email: user.email, organizationId: user.organizationId },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
