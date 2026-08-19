import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "cybershield-ngo", version: "1.0.0" });
}
